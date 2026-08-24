import { useEffect, useMemo, useRef, useState } from 'react'
import { HiInformationCircle, HiOutlineCloudUpload, HiOutlinePlus, HiOutlinePrinter, HiOutlineTrash } from 'react-icons/hi'
import { verifyAndRecord } from '../../services/fbr'
import { listSellers } from '../../services/sellers'
import { logActivity } from '../../services/activity'
import { parseCSV } from '../../lib/export'
import DateInput from '../common/DateInput'
import InvoiceDocModal from '../common/InvoiceDocModal'

const initial = {
  invoice_number: '',
  invoice_date:   new Date().toISOString().slice(0, 10),
  seller_ntn:     '',
  seller_name:    '',
  seller_province:'Punjab',
  seller_address: '',
  buyer_ntn:      '',
  buyer_name:     '',
  buyer_province: 'Punjab',
  buyer_address:  '',
  // Empty => verifyAndRecord auto-detects the buyer's registration type from
  // FBR (avoids errorCode 0053 when a walk-in/unregistered buyer is filed). The
  // form's selector can override this with an explicit Registered/Unregistered.
  buyer_reg_type: '',
  scenario_id:    'SN000',
}

const emptyItem = () => ({
  description:   '',
  hs_code:       '0000.0000',
  quantity:      1,
  rate:          '18%',
  uom:           'Numbers, pieces, units',
  value_excl_st: 0,
  sales_tax:     0,
  total:         0,
  sale_type:     'Goods at standard rate (default)',
})

const cellClass = `w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm placeholder:text-gray-300 text-gray-700
  focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20 focus:border-[#0e5f4f] transition-colors`

const fieldClass = 'w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20 focus:border-[#0e5f4f] transition-colors'

const Field = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
    {/* Dates go through DateInput so they read DD/MM/YYYY instead of the
        browser-locale format of a native date input. */}
    {type === 'date' ? (
      <DateInput value={value} onChange={onChange} className={fieldClass} />
    ) : (
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={fieldClass} />
    )}
  </div>
)

const VerificationForm = ({ onResult }) => {
  const [tab, setTab]   = useState('single')
  const [form, setForm] = useState(initial)
  const [items, setItems] = useState([emptyItem()])
  const [busy, setBusy] = useState(false)
  const [msg,  setMsg]  = useState(null)
  const [bulk, setBulk] = useState({ done: 0, total: 0, errors: 0, results: [] })
  const [sellers, setSellers]   = useState([])
  const [sellerId, setSellerId] = useState('')
  // Snapshot of the last verification: { invoice, verification }. Keeps the
  // verified invoice printable even if the form is edited afterwards.
  const [receipt, setReceipt] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    listSellers().then(list => {
      setSellers(list)
      const def = list.find(s => s.is_default) || list[0]
      if (def) setSellerId(def.id)
    }).catch(() => {})
  }, [])

  const seller = useMemo(() => sellers.find(s => s.id === sellerId) || null, [sellers, sellerId])
  // Seller fields + token come from the chosen company, overriding form input.
  const sellerFields = () => (seller ? {
    seller_ntn:      seller.ntn,
    seller_name:     seller.company_name,
    seller_province: seller.province || form.seller_province,
    seller_address:  seller.address || form.seller_address,
    fbr_token:       seller.fbr_token,
  } : {})

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const setItem = (idx, k) => (e) => {
    const value = e.target.value
    setItems(its => its.map((it, i) => (i === idx ? { ...it, [k]: value } : it)))
  }
  const addItem    = () => setItems(its => [...its, emptyItem()])
  const removeItem = (idx) => setItems(its => (its.length === 1 ? its : its.filter((_, i) => i !== idx)))

  const grandTotal = useMemo(
    () => items.reduce((s, it) => s + Number(it.total || 0), 0),
    [items],
  )

  const handleClear = () => { setForm(initial); setItems([emptyItem()]); setMsg(null); setReceipt(null) }

  const handleVerify = async () => {
    setMsg(null); setBusy(true)
    try {
      const payload = {
        ...form,
        ...sellerFields(),
        invoice_ref_no: form.invoice_number,
        items: items.map(it => ({
          hs_code: it.hs_code, description: it.description, rate: it.rate, uom: it.uom,
          quantity: Number(it.quantity), total: Number(it.total),
          value_excl_st: Number(it.value_excl_st), sales_tax: Number(it.sales_tax),
          sale_type: it.sale_type,
        })),
      }
      const result = await verifyAndRecord(payload)
      setReceipt({
        invoice: payload,
        verification: {
          status:       result.status,
          fbrInvoiceNo: result.record?.fbr_invoice_no || result.response?.invoiceNumber || null,
          statusCode:   result.response?.validationResponse?.statusCode || result.record?.fbr_status_code || null,
        },
      })
      await logActivity({
        action:  'Invoice Verification',
        subject: form.invoice_number || 'Manual',
        status:  result.status === 'verified' ? 'Verified' : 'Invalid',
        type:    result.status === 'verified' ? 'verified' : 'invalid',
        metadata:{ duration_ms: result.durationMs },
      })
      setMsg({ kind: result.status, text: result.status === 'verified'
        ? `Verified by FBR in ${(result.durationMs / 1000).toFixed(1)}s`
        : (result.response?.validationResponse?.error || 'FBR rejected the invoice') })
      onResult?.(result)
    } catch (err) {
      setReceipt(null)
      setMsg({ kind: 'invalid', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  const handleBulkFile = async (file) => {
    setBusy(true)
    try {
      const text = await file.text()
      const { records } = parseCSV(text)
      setBulk({ done: 0, total: records.length, errors: 0, results: [] })
      let done = 0, errors = 0
      const results = []
      for (const r of records) {
        try {
          const payload = {
            invoice_number: r.invoice_number, invoice_date: r.invoice_date,
            seller_ntn:     r.seller_ntn,     seller_name: r.seller_name,
            seller_province:r.seller_province,seller_address: r.seller_address,
            ...sellerFields(),
            buyer_ntn:      r.buyer_ntn,      buyer_name:  r.buyer_name,
            buyer_province: r.buyer_province, buyer_address: r.buyer_address,
            buyer_reg_type: r.buyer_reg_type || '',
            scenario_id:    r.scenario_id || 'SN000',
            invoice_ref_no: r.invoice_number,
            items: [{
              hs_code: r.hs_code || '0000.0000', description: r.description, rate: r.rate || '0%',
              uom: r.uom, quantity: Number(r.quantity || 0),
              total: Number(r.total || 0), value_excl_st: Number(r.value_excl_st || 0),
              sales_tax: Number(r.sales_tax || 0), sale_type: r.sale_type,
            }],
          }
          const res = await verifyAndRecord(payload)
          results.push({ invoice: r.invoice_number, status: res.status })
          done += 1
        } catch (e) {
          results.push({ invoice: r.invoice_number, status: 'failed', error: e.message })
          errors += 1
        }
        setBulk({ done: done + errors, total: records.length, errors, results: [...results] })
      }
      onResult?.()
    } finally { setBusy(false) }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-[1.75] min-w-0 flex flex-col">

      <div className="flex gap-6 border-b border-gray-100 mb-6">
        {[
          { key: 'single', label: 'Single Verification' },
          { key: 'bulk',   label: 'Bulk Verification' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 text-sm font-semibold transition-colors ${
              tab === key ? 'text-[#0e5f4f] border-b-2 border-[#0e5f4f]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'single' ? (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Invoice Number" value={form.invoice_number} onChange={set('invoice_number')} placeholder="e.g INV-2026-001" />
            <Field label="Invoice Date"   type="date" value={form.invoice_date}   onChange={set('invoice_date')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Seller Company</label>
              {sellers.length === 0 ? (
                <a href="/dashboard/settings" className="block border border-dashed border-amber-300 bg-amber-50 rounded-lg px-3.5 py-2.5 text-sm text-amber-700 hover:bg-amber-100 transition-colors">
                  Add a company + FBR token in Settings →
                </a>
              ) : (
                <select value={sellerId} onChange={(e) => setSellerId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20 focus:border-[#0e5f4f] transition-colors">
                  {sellers.map(s => <option key={s.id} value={s.id}>{s.company_name} — {s.ntn}{s.is_default ? ' (default)' : ''}</option>)}
                </select>
              )}
            </div>
            <Field label="Buyer NTN"  value={form.buyer_ntn}  onChange={set('buyer_ntn')}  placeholder="7-digit NTN or 13-digit CNIC" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Seller Business Name" value={form.seller_name} onChange={set('seller_name')} />
            <Field label="Buyer Business Name"  value={form.buyer_name}  onChange={set('buyer_name')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buyer Registration Type</label>
              <select value={form.buyer_reg_type} onChange={set('buyer_reg_type')}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20 focus:border-[#0e5f4f] transition-colors">
                <option value="">Auto-detect from buyer NTN</option>
                <option value="Registered">Registered</option>
                <option value="Unregistered">Unregistered</option>
              </select>
              <p className="text-[11px] text-gray-400 mt-1">Leave on auto-detect for walk-in/unregistered buyers to avoid FBR error 0053.</p>
            </div>
          </div>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-700">Products / Line Items ({items.length})</span>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#0e5f4f] hover:text-[#083f33] transition-colors"
              >
                <HiOutlinePlus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide bg-white border-b border-gray-100">
                    <th className="px-3 py-2 w-8">#</th>
                    <th className="px-3 py-2 min-w-[180px]">Product Description</th>
                    <th className="px-3 py-2 w-28">HS Code</th>
                    <th className="px-3 py-2 w-20">Qty</th>
                    <th className="px-3 py-2 w-28">Value excl ST</th>
                    <th className="px-3 py-2 w-28">Sales Tax</th>
                    <th className="px-3 py-2 w-28">Total</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="border-b border-gray-50 last:border-0">
                      <td className="px-3 py-2 text-xs text-gray-400">{idx + 1}</td>
                      <td className="px-3 py-2">
                        <input value={it.description} onChange={setItem(idx, 'description')} placeholder="Item name / description" className={cellClass} />
                      </td>
                      <td className="px-3 py-2">
                        <input value={it.hs_code} onChange={setItem(idx, 'hs_code')} placeholder="0000.0000" className={cellClass} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" step="any" min="0" value={it.quantity} onChange={setItem(idx, 'quantity')} className={cellClass} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" step="any" min="0" value={it.value_excl_st} onChange={setItem(idx, 'value_excl_st')} className={cellClass} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" step="any" min="0" value={it.sales_tax} onChange={setItem(idx, 'sales_tax')} className={cellClass} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" step="any" min="0" value={it.total} onChange={setItem(idx, 'total')} className={cellClass} />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          disabled={items.length === 1}
                          aria-label="Remove product"
                          className="text-gray-300 hover:text-red-500 disabled:opacity-40 disabled:hover:text-gray-300 transition-colors"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-3 px-4 py-2.5 bg-gray-50 border-t border-gray-100">
              <span className="text-xs text-gray-500">Grand Total</span>
              <span className="text-sm font-bold text-[#0e5f4f]">
                PKR {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {msg && (
            <div className={`text-xs font-medium rounded-lg px-3 py-2 border ${
              msg.kind === 'verified' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-700 bg-red-50 border-red-100'
            }`}>
              {msg.text}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <HiInformationCircle className="w-4 h-4 flex-shrink-0 text-gray-400" />
              Data is cross-referenced with FBR central Database
            </div>
            <div className="flex items-center gap-3">
              {/* Once FBR accepts the invoice it can be printed / saved as PDF. */}
              {receipt?.verification?.status === 'verified' && (
                <button
                  type="button"
                  onClick={() => setShowReceipt(true)}
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
                >
                  <HiOutlinePrinter className="w-4 h-4" />
                  Print / Save Invoice
                </button>
              )}
              <button onClick={handleClear} disabled={busy} className="border border-gray-300 rounded-lg px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60">
                Clear Form
              </button>
              <button onClick={handleVerify} disabled={busy} className="bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-lg px-7 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60">
                {busy ? 'Verifying…' : 'Verify Now'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div
            onClick={() => ref.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleBulkFile(f) }}
            className="border-2 border-dashed border-gray-200 rounded-xl bg-[#fafbfc] hover:border-[#0e5f4f]/40 flex flex-col items-center justify-center py-12 cursor-pointer"
          >
            <HiOutlineCloudUpload className="w-9 h-9 text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-700">Click or drop a CSV here</p>
            <p className="text-xs mt-1 text-gray-400">Supports up to 500 records. Use the template on the right.</p>
            <input ref={ref} type="file" accept=".csv" className="hidden"
                   onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBulkFile(f) }} />
          </div>

          {bulk.total > 0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">{busy ? 'Processing…' : 'Done'}</span>
                <span className="text-xs text-gray-500">{bulk.done}/{bulk.total} · {bulk.errors} errors</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-[#0e5f4f] h-1.5 rounded-full transition-all" style={{ width: `${(bulk.done / bulk.total) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Verified invoice: printed from the snapshot taken when FBR accepted it. */}
      <InvoiceDocModal
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        invoice={receipt?.invoice}
        verification={receipt?.verification}
        title="Verified Invoice"
      />
    </div>
  )
}

export default VerificationForm
