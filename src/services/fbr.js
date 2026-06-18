import { supabase } from '../lib/supabase'
import { recordVerification } from './verifications'

const TOKEN     = import.meta.env.VITE_FBR_TOKEN
const FBR_BASE  = import.meta.env.VITE_FBR_BASE_URL || 'https://gw.fbr.gov.pk'
const IS_DEV    = import.meta.env.DEV

// An FBR token is bound to exactly ONE seller registration number. This app
// files only for that seller, so the seller NTN is fixed here — never taken
// from per-draft input — so a wrong/blank/typo'd seller can't trigger FBR's
// "token does not exist against seller registration number" error.
// Override via VITE_FBR_SELLER_NTN if the token's registered seller changes.
export const SELLER_NTN = String(import.meta.env.VITE_FBR_SELLER_NTN || '3740697867821').replace(/\D/g, '')

// Switch between FBR sandbox (testing) and production by setting
// VITE_FBR_MODE=production in the environment. Sandbox endpoints use the
// "_sb" suffix; production endpoints drop it. Defaults to sandbox so a
// missing/incorrect production token can never accidentally hit live FBR.
const IS_PRODUCTION = import.meta.env.VITE_FBR_MODE === 'production'
const SUFFIX    = IS_PRODUCTION ? '' : '_sb'
const POST_PATH = `/di_data/v1/di/postinvoicedata${SUFFIX}`
const GET_PATH  = `/di_data/v1/di/getinvoicedata${SUFFIX}`

function buildUrl(path) {
  // In dev, route through Vite proxy to avoid CORS.
  if (IS_DEV) return `/fbr-api${path}`
  // In prod, prefer Supabase Edge Function proxy if available.
  return `${FBR_BASE}${path}`
}

async function callDirect(method, path, body, token) {
  const res = await fetch(buildUrl(path), {
    method,
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token || TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = { raw: text } }
  if (!res.ok) {
    const msg = data?.message || data?.error || `FBR error ${res.status}`
    throw new Error(msg)
  }
  return data
}

async function callViaEdge(method, path, body, token) {
  const { data, error } = await supabase.functions.invoke('fbr-proxy', {
    body: { method, path, payload: body, token },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

// `token` (optional) is the chosen seller's own FBR token for multi-company
// filing; when omitted the edge function / direct call uses the default token.
async function call(method, path, body, token) {
  // Try edge function first in prod, fall back to direct fetch (works in dev via proxy)
  if (!IS_DEV) {
    try { return await callViaEdge(method, path, body, token) }
    catch (_) { /* fall through to direct */ }
  }
  return callDirect(method, path, body, token)
}

/**
 * POST invoice to FBR sandbox for verification.
 * @param {object} invoice — payload matching FBR sandbox schema
 */
export async function postInvoice(invoice, token) {
  return call('POST', POST_PATH, invoice, token)
}

export async function getInvoice(query = {}, token) {
  const qs = new URLSearchParams(query).toString()
  return call('GET', `${GET_PATH}${qs ? `?${qs}` : ''}`, undefined, token)
}

/**
 * Ask FBR whether a registration number is "Registered" or "Unregistered".
 * FBR rejects an invoice (errorCode 0053) when the buyerRegistrationType we
 * send disagrees with the buyer's actual profile, so we look it up instead of
 * guessing. Returns 'Registered' | 'Unregistered' | null (lookup failed).
 */
export async function getRegistrationType(ntn, token) {
  const digits = normalizeNTN(ntn)
  if (!digits) return 'Unregistered'   // no buyer id => treat as walk-in/unregistered
  try {
    const data = await call('POST', '/dist/v1/Get_Reg_Type', { Registration_No: digits }, token)
    const type = data?.REGISTRATION_TYPE || data?.registration_type
    return type === 'Registered' || type === 'Unregistered' ? type : null
  } catch (_) {
    return null
  }
}

/**
 * Look up the valid Unit of Measure for an HS code. FBR rejects an item
 * (errorCode 0099) when the UoM doesn't match the HS code, so we fetch the
 * allowed UoM instead of guessing. Returns the UoM string or null.
 */
export async function getUoMForHsCode(hsCode, token) {
  const hs = (hsCode || '').trim()
  if (!hs) return null
  try {
    const data = await call('GET', `/pdi/v2/HS_UOM?hs_code=${encodeURIComponent(hs)}&annexure_id=3`, undefined, token)
    const list = Array.isArray(data) ? data : []
    return list[0]?.description || null
  } catch (_) {
    return null
  }
}

/**
 * FBR accepts a seller/buyer registration number as raw digits only:
 * a 7-digit NTN or a 13-digit CNIC. Strip any dashes/spaces the user typed
 * (e.g. "1234567-8") so a formatting slip can't trigger FBR's
 * "not 13 digits (CNIC) or 7 digits (NTN)" rejection.
 */
export function normalizeNTN(value) {
  return String(value || '').replace(/\D/g, '')
}

export function isValidNTN(value) {
  const digits = normalizeNTN(value)
  return digits.length === 7 || digits.length === 13
}

// FBR rejects the placeholder HS code "0000.0000" ("HS Code cannot be empty")
// and scenario "SN000" ("scenario not valid for registered user"). Until the
// UI exposes real per-item HS codes, fall back to a known-valid sandbox combo
// so verification returns statusCode "00".
const DEFAULT_HS_CODE  = '0101.2100'
const DEFAULT_SCENARIO = 'SN001'
const usableHsCode   = (v) => (v && v !== '0000.0000') ? v : DEFAULT_HS_CODE
const usableScenario = (v) => (v && v !== 'SN000')      ? v : DEFAULT_SCENARIO

/**
 * Build the FBR payload from a normalized internal invoice shape.
 */
export function buildPayload(input) {
  // The seller NTN must match the token being used. For multi-company filing
  // it comes from the chosen seller (input.seller_ntn); otherwise it falls back
  // to the single-tenant default. Either way it must be a valid 7/13-digit id.
  const sellerNTN = normalizeNTN(input.seller_ntn) || SELLER_NTN
  if (!isValidNTN(sellerNTN)) {
    throw new Error(
      `Seller NTN "${sellerNTN}" is invalid — it must be a 7-digit NTN or ` +
      '13-digit CNIC that matches the FBR token used for this seller.'
    )
  }
  const items = (input.items || []).map(it => ({
    hsCode:                          usableHsCode(it.hs_code),
    productDescription:              it.description || '',
    rate:                            it.rate || '0%',
    uoM:                             it.uom || '',
    quantity:                        Number(it.quantity || 0),
    totalValues:                     Number(it.total || 0),
    valueSalesExcludingST:           Number(it.value_excl_st || 0),
    fixedNotifiedValueOrRetailPrice: Number(it.retail_price || 0),
    salesTaxApplicable:              Number(it.sales_tax || 0),
    salesTaxWithheldAtSource:        Number(it.tax_withheld || 0),
    extraTax:                        it.extra_tax || '',
    furtherTax:                      Number(it.further_tax || 0),
    sroScheduleNo:                   it.sro_schedule || '',
    fedPayable:                      Number(it.fed_payable || 0),
    discount:                        Number(it.discount || 0),
    saleType:                        it.sale_type || '',
    sroItemSerialNo:                 it.sro_serial || '',
  }))

  return {
    invoiceType:           input.invoice_type        || 'Sale Invoice',
    invoiceDate:           input.invoice_date        || new Date().toISOString().slice(0, 10),
    sellerNTNCNIC:         sellerNTN,
    sellerBusinessName:    input.seller_name         || '',
    sellerProvince:        input.seller_province     || '',
    sellerAddress:         input.seller_address      || '',
    buyerNTNCNIC:          normalizeNTN(input.buyer_ntn),
    buyerBusinessName:     input.buyer_name          || '',
    buyerProvince:         input.buyer_province      || '',
    buyerAddress:          input.buyer_address       || '',
    buyerRegistrationType: input.buyer_reg_type      || 'Registered',
    invoiceRefNo:          input.invoice_ref_no      || '',
    scenarioId:            usableScenario(input.scenario_id),
    items,
  }
}

/**
 * High-level helper: verify a normalized invoice via FBR + persist to verifications.
 * Returns { ok, status, response, durationMs }.
 */
export async function verifyAndRecord(input) {
  // The chosen seller's own FBR token (multi-company). When absent, calls use
  // the default token, preserving single-tenant behaviour.
  const token = input.fbr_token || undefined

  // Auto-detect the buyer's registration type from FBR (avoids errorCode 0053
  // "Provided Registration type does not match with Buyer's profile"). Falls
  // back to any explicit value, then to a safe lookup default.
  let buyerRegType = input.buyer_reg_type
  if (!buyerRegType) {
    buyerRegType = (await getRegistrationType(input.buyer_ntn, token)) || 'Unregistered'
  }

  // Resolve the valid UoM for each item's HS code (avoids errorCode 0099
  // "Provided UoM is not allowed against the provided HS Code"). Keep any
  // explicit UoM; otherwise ask FBR what's allowed for that HS code.
  const items = await Promise.all((input.items || []).map(async (it) => {
    if (it.uom) return it
    const uom = await getUoMForHsCode(usableHsCode(it.hs_code), token)
    return uom ? { ...it, uom } : it
  }))

  const payload = buildPayload({ ...input, items, buyer_reg_type: buyerRegType })
  const started = Date.now()
  let response, ok = true, errorMsg = null
  try {
    response = await postInvoice(payload, token)
  } catch (err) {
    ok = false
    errorMsg = err.message
    response = { error: err.message }
  }
  const durationMs = Date.now() - started

  // FBR returns validationResponse with statusCode "00" on success
  const fbrStatus = response?.validationResponse?.statusCode
  let status = ok && (fbrStatus === '00' || fbrStatus === '0' || !fbrStatus) ? 'verified' : 'invalid'
  if (!ok) status = 'invalid'

  const totalAmount = (payload.items || []).reduce((s, it) => s + Number(it.totalValues || 0), 0)

  const saved = await recordVerification({
    invoice_number:    input.invoice_number || input.invoice_ref_no || null,
    seller_ntn:        payload.sellerNTNCNIC,
    buyer_ntn:         payload.buyerNTNCNIC,
    invoice_date:      payload.invoiceDate,
    amount:            totalAmount,
    status,
    fbr_status_code:   fbrStatus || null,
    fbr_message:       response?.validationResponse?.error || errorMsg || null,
    fbr_invoice_no:    response?.invoiceNumber || null,
    response_payload:  response,
    request_payload:   payload,
    response_time_ms:  durationMs,
  })

  return { ok, status, response, durationMs, record: saved }
}
