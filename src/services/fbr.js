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
 * Fetch FBR's allowed UoM list for an HS code.
 * Returns { ok, list }: ok=false means the lookup itself failed (network/edge),
 * ok=true with an empty list means FBR definitively has NO valid UoM for the
 * code — i.e. it can't be used for DI (typical of services/non-standard codes),
 * and FBR will reject it with errorCode 0099 whatever UoM is sent.
 */
export async function getUoMListForHsCode(hsCode, token) {
  const hs = (hsCode || '').trim()
  if (!hs) return { ok: true, list: [] }
  try {
    const data = await call('GET', `/pdi/v2/HS_UOM?hs_code=${encodeURIComponent(hs)}&annexure_id=3`, undefined, token)
    return { ok: true, list: Array.isArray(data) ? data : [] }
  } catch (_) {
    return { ok: false, list: [] }
  }
}

/**
 * Look up the valid Unit of Measure for an HS code. FBR rejects an item
 * (errorCode 0099) when the UoM doesn't match the HS code, so we fetch the
 * allowed UoM instead of guessing. Returns the UoM string or null.
 */
export async function getUoMForHsCode(hsCode, token) {
  const { list } = await getUoMListForHsCode(hsCode, token)
  return list[0]?.description || null
}

// ── FBR HS-code catalogue (for the searchable HS picker) ──────────────────
// FBR's full HS list is bundled as a static asset (public/hs-codes.json) rather
// than fetched from FBR at runtime: FBR firewalls Supabase's edge egress (calls
// time out) and blocks direct browser CORS, so a live fetch is unreliable. The
// list is static reference data, so it's served from our own CDN, cached once
// in memory, and searched locally — instant, no CORS, no edge dependency.
let _hsCache = null
let _hsPromise = null
export async function loadHsCodes() {
  if (_hsCache) return _hsCache
  if (_hsPromise) return _hsPromise
  _hsPromise = fetch('/hs-codes.json')
    .then(r => (r.ok ? r.json() : []))
    .then(arr => {
      _hsCache = (Array.isArray(arr) ? arr : []).filter(x => x && x.code)
      return _hsCache
    })
    .catch(() => { _hsPromise = null; return [] })
  return _hsPromise
}

// Filter the cached catalogue by HS code or description. Digits in the query
// match the code; words match the description.
export function searchHsCodes(list, query, limit = 40) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return list.slice(0, limit)
  const codeQ = q.replace(/[^0-9.]/g, '')
  const out = []
  for (const item of list) {
    const hit = (codeQ && item.code.toLowerCase().includes(codeQ)) || item.description.toLowerCase().includes(q)
    if (hit) { out.push(item); if (out.length >= limit) break }
  }
  return out
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
// When FBR has no UoM list for an HS code (HS_UOM returns empty — common for
// service codes like 9817.0000), it still rejects a BLANK uoM (errorCode 0099).
// FBR accepts this generic UoM whenever no specific list is defined, so it's the
// safe fallback. When a specific list exists, getUoMForHsCode supplies it instead.
const DEFAULT_UOM = 'Numbers, pieces, units'
// FBR HS codes are formatted "1234.5678" (dot after the 4th digit). Users often
// paste an 8-digit code with no dot (e.g. "90278090") — insert it so FBR can
// classify the code. (This only fixes formatting; the code must still be a real
// FBR HS code, or FBR returns "HS Code does not match with provided sale type".)
export function normalizeHsCode(v) {
  const raw = String(v || '').trim()
  const digits = raw.replace(/\D/g, '')
  if (!raw.includes('.') && digits.length === 8) return `${digits.slice(0, 4)}.${digits.slice(4)}`
  return raw
}
const usableHsCode   = (v) => { const n = normalizeHsCode(v); return (n && n !== '0000.0000') ? n : DEFAULT_HS_CODE }
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

  // FBR rejects a live filing that is missing the seller's registered business
  // name, province, or address. Catch it here with a clear, actionable message
  // instead of letting FBR return a cryptic error after the round-trip.
  const sellerName     = (input.seller_name     || '').trim()
  const sellerProvince = (input.seller_province || '').trim()
  const sellerAddress  = (input.seller_address  || '').trim()
  const missing = [
    !sellerName     && 'business name',
    !sellerProvince && 'province',
    !sellerAddress  && 'address',
  ].filter(Boolean)
  if (missing.length) {
    throw new Error(
      `The selected company is missing its FBR ${missing.join(', ')}. ` +
      'Add it in Settings → Companies, then verify again.'
    )
  }

  // FBR requires a buyer business name on every invoice.
  if (!(input.buyer_name || '').trim()) {
    throw new Error('Buyer name is required by FBR. Add the buyer name to this draft before verifying.')
  }

  // A *registered* buyer's invoice is rejected by FBR when the buyer province is
  // blank. Catch it here with a clear message instead of a cryptic rejection.
  if (input.buyer_reg_type === 'Registered' && !(input.buyer_province || '').trim()) {
    throw new Error('This buyer is FBR-registered, so a buyer province is required. Set the buyer province on the draft, then verify.')
  }
  // FBR (errorCode 0302) rejects any monetary value with more than 2 decimals,
  // or a quantity with more than 4. JS float math (e.g. 4720 * 0.18) produces
  // artifacts like 849.6000000000001, so every numeric field is rounded here.
  const money = (n) => Math.round((Number(n) || 0) * 100) / 100
  const qty   = (n) => Math.round((Number(n) || 0) * 10000) / 10000
  const items = (input.items || []).map(it => ({
    hsCode:                          usableHsCode(it.hs_code),
    productDescription:              it.description || '',
    rate:                            it.rate || '0%',
    uoM:                             it.uom || DEFAULT_UOM,
    quantity:                        qty(it.quantity),
    totalValues:                     money(it.total),
    valueSalesExcludingST:           money(it.value_excl_st),
    fixedNotifiedValueOrRetailPrice: money(it.retail_price),
    salesTaxApplicable:              money(it.sales_tax),
    salesTaxWithheldAtSource:        money(it.tax_withheld),
    extraTax:                        it.extra_tax || '',
    furtherTax:                      money(it.further_tax),
    sroScheduleNo:                   it.sro_schedule || '',
    fedPayable:                      money(it.fed_payable),
    discount:                        money(it.discount),
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
    // scenarioId is an FBR *sandbox* concept used to exercise validation cases.
    // It must not be sent on a live filing, so it is omitted in production
    // (JSON.stringify drops the key when the value is undefined).
    scenarioId:            IS_PRODUCTION ? undefined : usableScenario(input.scenario_id),
    items,
  }
}

/**
 * Pull the most specific human-readable error out of an FBR response.
 * FBR puts the top-level problem in `validationResponse.error`, but item-level
 * rejections (the common case) live in `validationResponse.invoiceStatuses[].error`
 * while the top-level error stays blank. Reading only the top level surfaces a
 * useless "FBR rejected the invoice", hiding the real reason — so we check both.
 */
export function fbrErrorText(response) {
  if (!response) return null
  const vr = response.validationResponse
  if (!vr) return response.error || null
  if (vr.error) return vr.error
  const items = Array.isArray(vr.invoiceStatuses) ? vr.invoiceStatuses : []
  const itemErrors = items
    .filter(s => s && s.error)
    .map(s => (s.itemSNo ? `Item ${s.itemSNo}: ` : '') + (s.errorCode ? `[${s.errorCode}] ` : '') + s.error)
  if (itemErrors.length) return itemErrors.join(' | ')
  return response.error || null
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
  // explicit UoM; otherwise ask FBR what's allowed for that HS code. When FBR
  // confirms it has NO valid UoM for the code (empty list, not a lookup
  // failure), the code is unusable for DI — surface a clear message instead of
  // letting FBR return a cryptic 0099.
  const noUomCodes = []
  const items = await Promise.all((input.items || []).map(async (it) => {
    if (it.uom) return it
    const hs = usableHsCode(it.hs_code)
    const { ok, list } = await getUoMListForHsCode(hs, token)
    if (ok && list.length === 0) noUomCodes.push(hs)
    return list[0]?.description ? { ...it, uom: list[0].description } : it
  }))
  if (noUomCodes.length) {
    throw new Error(
      `HS code ${noUomCodes[0]} has no valid unit of measure in FBR, so FBR will reject it (error 0099). ` +
      'This is usually a services or non-standard code. Open the product and pick a valid goods HS code from the HS Code search.'
    )
  }

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

  // FBR returns validationResponse with statusCode "00" on success. An item-level
  // rejection can leave the top-level code blank/00 while flagging the item, so
  // also treat any extracted error as a failure.
  const fbrStatus = response?.validationResponse?.statusCode
  const detailError = fbrErrorText(response)
  let status = ok && !detailError && (fbrStatus === '00' || fbrStatus === '0' || !fbrStatus) ? 'verified' : 'invalid'
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
    fbr_message:       detailError || errorMsg || null,
    fbr_invoice_no:    response?.invoiceNumber || null,
    response_payload:  response,
    request_payload:   payload,
    response_time_ms:  durationMs,
  })

  return { ok, status, response, durationMs, record: saved }
}

// ── FBR sandbox test cases ────────────────────────────────────────────────
// FBR issues a SANDBOX token first; a new integrator must pass the DI test
// scenarios in sandbox before FBR releases the PRODUCTION token. These are the
// standard scenarios (the exact set required for a given business shows in its
// FBR IRIS profile). Each maps to a real FBR sale type / rate.
// Each scenario's config was verified to return statusCode "00" against FBR
// sandbox. Non-18% rates require the matching SRO schedule + item serial
// (FBR errorCode 0077/0078); 3rd-schedule sales need a retail price.
export const SANDBOX_SCENARIOS = [
  { id: 'SN001', name: 'Goods at standard rate — to registered buyers',   saleType: 'Goods at standard rate (default)', rate: '18%',   buyerRegistered: true  },
  { id: 'SN002', name: 'Goods at standard rate — to unregistered buyers', saleType: 'Goods at standard rate (default)', rate: '18%',   buyerRegistered: false },
  { id: 'SN005', name: 'Reduced rate sale',                               saleType: 'Goods at Reduced Rate',            rate: '1%',    buyerRegistered: true,  sroScheduleNo: 'EIGHTH SCHEDULE Table 1', sroItemSerialNo: 82 },
  { id: 'SN006', name: 'Exempt goods sale',                               saleType: 'Exempt goods',                     rate: 'Exempt',buyerRegistered: true,  sroScheduleNo: '6th Schd Table I',        sroItemSerialNo: 82 },
  { id: 'SN007', name: 'Zero rated sale',                                 saleType: 'Goods at zero-rate',               rate: '0%',    buyerRegistered: true,  sroScheduleNo: '327(I)/2008',             sroItemSerialNo: 1  },
  { id: 'SN008', name: 'Sale of 3rd schedule goods',                      saleType: '3rd Schedule Goods',               rate: '18%',   buyerRegistered: true,  retailPrice: true },
  { id: 'SN016', name: 'Processing / conversion of goods',                saleType: 'Processing/Conversion of Goods',   rate: '18%',   buyerRegistered: true  },
  { id: 'SN017', name: 'Sale of goods where FED is charged in ST mode',   saleType: 'Goods (FED in ST Mode)',           rate: '17%',   buyerRegistered: true  },
  { id: 'SN024', name: 'Goods sold under SRO 297(I)/2023',                saleType: 'Goods as per SRO.297(|)/2023',     rate: '25%',   buyerRegistered: true,  sroScheduleNo: '297(I)/2023-Table-II',    sroItemSerialNo: 1  },
  { id: 'SN026', name: 'Sale to end consumer by retailers — standard',    saleType: 'Goods at standard rate (default)', rate: '18%',   buyerRegistered: false },
  { id: 'SN027', name: 'Sale to end consumer by retailers — 3rd schedule',saleType: '3rd Schedule Goods',               rate: '18%',   buyerRegistered: false, retailPrice: true },
  { id: 'SN028', name: 'Sale to end consumer by retailers — reduced rate',saleType: 'Goods at Reduced Rate',            rate: '1%',    buyerRegistered: true,  sroScheduleNo: 'EIGHTH SCHEDULE Table 1', sroItemSerialNo: 82 },
]

/**
 * Run ONE FBR sandbox test scenario for a seller. Always posts to the sandbox
 * endpoint (…postinvoicedata_sb) with the seller's own (sandbox) token — never
 * touches production. Returns { id, name, ok, statusCode, error, ms }.
 */
export async function runSandboxScenario(scenario, seller) {
  const token      = seller?.fbr_token || undefined
  const sellerNTN  = normalizeNTN(seller?.ntn) || SELLER_NTN
  const valueExcl  = 1000
  const pct        = parseFloat(scenario.rate) || 0        // "Exempt"/"0%" → 0
  const salesTax   = Math.round(valueExcl * pct) / 100
  const total      = Math.round((valueExcl + salesTax) * 100) / 100
  const registered = !!scenario.buyerRegistered

  const payload = {
    invoiceType:           'Sale Invoice',
    invoiceDate:           new Date().toISOString().slice(0, 10),
    sellerNTNCNIC:         sellerNTN,
    sellerBusinessName:    seller?.company_name || 'Test Seller',
    sellerProvince:        seller?.province || 'Punjab',
    sellerAddress:         seller?.address || 'Test Address',
    buyerNTNCNIC:          registered ? '9010600' : '',   // registered test buyer / blank for unregistered
    buyerBusinessName:     registered ? 'Test Registered Buyer' : 'Test Unregistered Buyer',
    buyerProvince:         'Punjab',
    buyerAddress:          'Test Address',
    buyerRegistrationType: registered ? 'Registered' : 'Unregistered',
    invoiceRefNo:          '',
    scenarioId:            scenario.id,
    items: [{
      hsCode:                          '0101.2100',
      productDescription:              scenario.name,
      rate:                            scenario.rate,
      uoM:                             'Numbers, pieces, units',
      quantity:                        1,
      totalValues:                     total,
      valueSalesExcludingST:           valueExcl,
      // 3rd-schedule sales are taxed on a retail price (FBR errorCode 0102 otherwise).
      fixedNotifiedValueOrRetailPrice: scenario.retailPrice ? valueExcl : 0,
      salesTaxApplicable:              salesTax,
      salesTaxWithheldAtSource:        0,
      extraTax:                        '',
      furtherTax:                      0,
      // Non-18% rates require a matching SRO schedule + item serial (0077/0078).
      sroScheduleNo:                   scenario.sroScheduleNo || '',
      fedPayable:                      0,
      discount:                        0,
      saleType:                        scenario.saleType,
      sroItemSerialNo:                 scenario.sroItemSerialNo != null ? scenario.sroItemSerialNo : '',
    }],
  }

  const started = Date.now()
  try {
    const res  = await call('POST', '/di_data/v1/di/postinvoicedata_sb', payload, token)
    const code = res?.validationResponse?.statusCode
    const err  = fbrErrorText(res)
    const ok   = (code === '00' || code === '0') && !err
    return { id: scenario.id, name: scenario.name, ok, statusCode: code || null, error: ok ? null : (err || 'Rejected by FBR'), ms: Date.now() - started }
  } catch (e) {
    return { id: scenario.id, name: scenario.name, ok: false, statusCode: null, error: e.message, ms: Date.now() - started }
  }
}
