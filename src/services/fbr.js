import { supabase } from '../lib/supabase'
import { recordVerification } from './verifications'

const TOKEN     = import.meta.env.VITE_FBR_TOKEN
const FBR_BASE  = import.meta.env.VITE_FBR_BASE_URL || 'https://gw.fbr.gov.pk'
const IS_DEV    = import.meta.env.DEV

const POST_PATH = '/di_data/v1/di/postinvoicedata_sb'
const GET_PATH  = '/di_data/v1/di/getinvoicedata_sb'

function buildUrl(path) {
  // In dev, route through Vite proxy to avoid CORS.
  if (IS_DEV) return `/fbr-api${path}`
  // In prod, prefer Supabase Edge Function proxy if available.
  return `${FBR_BASE}${path}`
}

async function callDirect(method, path, body) {
  const res = await fetch(buildUrl(path), {
    method,
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${TOKEN}`,
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

async function callViaEdge(method, path, body) {
  const { data, error } = await supabase.functions.invoke('fbr-proxy', {
    body: { method, path, payload: body },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

async function call(method, path, body) {
  // Try edge function first in prod, fall back to direct fetch (works in dev via proxy)
  if (!IS_DEV) {
    try { return await callViaEdge(method, path, body) }
    catch (_) { /* fall through to direct */ }
  }
  return callDirect(method, path, body)
}

/**
 * POST invoice to FBR sandbox for verification.
 * @param {object} invoice — payload matching FBR sandbox schema
 */
export async function postInvoice(invoice) {
  return call('POST', POST_PATH, invoice)
}

export async function getInvoice(query = {}) {
  const qs = new URLSearchParams(query).toString()
  return call('GET', `${GET_PATH}${qs ? `?${qs}` : ''}`)
}

/**
 * Build the FBR payload from a normalized internal invoice shape.
 */
export function buildPayload(input) {
  const items = (input.items || []).map(it => ({
    hsCode:                          it.hs_code || '0000.0000',
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
    sellerNTNCNIC:         input.seller_ntn          || '',
    sellerBusinessName:    input.seller_name         || '',
    sellerProvince:        input.seller_province     || '',
    sellerAddress:         input.seller_address      || '',
    buyerNTNCNIC:          input.buyer_ntn           || '',
    buyerBusinessName:     input.buyer_name          || '',
    buyerProvince:         input.buyer_province      || '',
    buyerAddress:          input.buyer_address       || '',
    buyerRegistrationType: input.buyer_reg_type      || 'Registered',
    invoiceRefNo:          input.invoice_ref_no      || '',
    scenarioId:            input.scenario_id         || 'SN000',
    items,
  }
}

/**
 * High-level helper: verify a normalized invoice via FBR + persist to verifications.
 * Returns { ok, status, response, durationMs }.
 */
export async function verifyAndRecord(input) {
  const payload = buildPayload(input)
  const started = Date.now()
  let response, ok = true, errorMsg = null
  try {
    response = await postInvoice(payload)
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
