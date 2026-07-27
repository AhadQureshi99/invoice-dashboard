import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineEye, HiOutlinePlus, HiOutlinePrinter, HiOutlineTrash } from 'react-icons/hi'
import { createDraft } from '../../services/drafts'
import { listSellers } from '../../services/sellers'
import { logActivity } from '../../services/activity'
import BrandingAssets from '../common/BrandingAssets'
import VerifyButton from '../common/VerifyButton'
import DateInput from '../common/DateInput'
import InvoiceDocModal from '../common/InvoiceDocModal'
import HsCodeInput from './HsCodeInput'
import ProductInput from './ProductInput'
import { fbrErrorText } from '../../services/fbr'

const inputClass = `w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
  placeholder:text-gray-300 text-gray-700
  focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20 focus:border-[#0e5f4f] transition-colors`

const GST_RATE = 0.18
// FBR-accepted province values. A registered buyer's invoice is rejected when
// buyerProvince is blank, so this must be selectable on the draft.
const PROVINCES = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Capital Territory', 'Gilgit-Baltistan', 'Azad Jammu and Kashmir']
const todayISO = () => new Date().toISOString().slice(0, 10)
const draftNumber = () => `DFT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
const DEFAULT_HS = '0101.2100'
const blankItem = () => ({ description: '', quantity: 1, unit_price: 0, hs_code: DEFAULT_HS })

const lineTotals = (it) => {
  const sub = Number(it.quantity || 0) * Number(it.unit_price || 0)
  const gst = sub * GST_RATE
  return { sub, gst, total: sub + gst }
}

const money = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const NewQuickDraft = ({ onSaved }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    invoice_number: draftNumber(),
    invoice_date:   todayISO(),
    buyer_ntn:      '',
    buyer_name:     '',
    buyer_province: '',
    buyer_address:  '',
  })
  const [items, setItems] = useState([blankItem()])
  const [sellers, setSellers]       = useState([])
  const [sellerId, setSellerId]     = useState('')
  const [busy, setBusy] = useState(false)
  const [msg,  setMsg]  = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  // Snapshot of the last FBR verification: { invoice, verification }. Kept so the
  // verified invoice stays printable even if the form is edited afterwards.
  const [receipt, setReceipt] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)

  // Load the user's companies; preselect the default (or first) one.
  useEffect(() => {
    listSellers().then(list => {
      setSellers(list)
      const def = list.find(s => s.is_default) || list[0]
      if (def) setSellerId(def.id)
    }).catch(() => {})
  }, [])

  const seller = useMemo(() => sellers.find(s => s.id === sellerId) || null, [sellers, sellerId])

  const totals = useMemo(() => items.reduce((acc, it) => {
    const { sub, gst, total } = lineTotals(it)
    acc.sub += sub; acc.gst += gst; acc.total += total
    return acc
  }, { sub: 0, gst: 0, total: 0 }), [items])

  // Normalized invoice shape used to verify the current draft against FBR.
  const verifyInput = useMemo(() => ({
    invoice_number: form.invoice_number,
    invoice_ref_no: form.invoice_number,
    invoice_date:   form.invoice_date,
    seller_ntn:     seller?.ntn || '',
    seller_name:    seller?.company_name || '',
    seller_province: seller?.province || '',
    seller_address: seller?.address || '',
    fbr_token:      seller?.fbr_token || '',
    buyer_ntn:      form.buyer_ntn,
    buyer_name:     form.buyer_name,
    buyer_province: form.buyer_province,
    buyer_address:  form.buyer_address,
    items: items.map(it => {
      const { sub, gst, total } = lineTotals(it)
      return {
        description:   (it.description || '').trim(),
        quantity:      Number(it.quantity),
        rate:          '18%',
        hs_code:       (it.hs_code || '').trim() || DEFAULT_HS,
        // uom intentionally omitted — verifyAndRecord fetches the valid UoM for the HS code
        value_excl_st: sub,
        sales_tax:     gst,
        total,
        sale_type:     'Goods at standard rate (default)',
      }
    }),
  }), [form, items, seller])

  const handleVerified = async (result) => {
    if (result.error) { setReceipt(null); setMsg({ kind: 'err', text: result.error }); return }
    setReceipt({
      invoice: verifyInput,
      verification: {
        status:       result.status,
        fbrInvoiceNo: result.record?.fbr_invoice_no || result.response?.invoiceNumber || null,
        statusCode:   result.response?.validationResponse?.statusCode || result.record?.fbr_status_code || null,
      },
    })
    setMsg({
      kind: result.status === 'verified' ? 'ok' : 'err',
      text: result.status === 'verified'
        ? `Verified by FBR in ${(result.durationMs / 1000).toFixed(1)}s`
        : (fbrErrorText(result.response) || result.error || 'FBR rejected the invoice'),
    })
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const setItem = (idx, key) => (e) => {
    const val = e.target.value
    setItems(list => list.map((it, i) => (i === idx ? { ...it, [key]: val } : it)))
  }
  // Set an item field directly from a value (used by the HS-code picker).
  const setItemVal = (idx, key, val) => setItems(list => list.map((it, i) => (i === idx ? { ...it, [key]: val } : it)))
  // Set multiple item fields at once (used when a product suggestion is picked).
  const setItemFields = (idx, patch) => setItems(list => list.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  const addItem = () => setItems(list => [...list, blankItem()])
  const removeItem = (idx) => setItems(list => (list.length === 1 ? list : list.filter((_, i) => i !== idx)))

  const handleSave = async () => {
    setBusy(true); setMsg(null)
    try {
      const cleanItems = items
        .filter(it => (it.description || '').trim() !== '' || Number(it.unit_price) > 0)
        .map(it => {
          const { sub, gst, total } = lineTotals(it)
          return {
            description: (it.description || '').trim(),
            quantity:    Number(it.quantity),
            unit_price:  Number(it.unit_price),
            hs_code:     (it.hs_code || '').trim() || DEFAULT_HS,
            subtotal:    sub,
            tax_amount:  gst,
            total,
          }
        })
      if (cleanItems.length === 0) throw new Error('Add at least one product with a description or price.')

      const first   = cleanItems[0]
      const summary = cleanItems.length === 1
        ? first.description
        : `${first.description || 'Item'} +${cleanItems.length - 1} more`

      const row = await createDraft({
        invoice_number: form.invoice_number,
        invoice_date:   form.invoice_date,
        seller_id:      seller?.id || null,
        seller_ntn:     seller?.ntn || '',
        buyer_ntn:      form.buyer_ntn,
        buyer_name:     form.buyer_name,
        description:    summary,
        quantity:       cleanItems.reduce((s, it) => s + it.quantity, 0),
        unit_price:     first.unit_price,
        subtotal:       totals.sub,
        tax_amount:     totals.gst,
        total_amount:   totals.total,
        // Buyer province/address have no dedicated columns, so they ride along
        // in the payload and are read back by the verifier + edit modal.
        payload:        { items: cleanItems, buyer_province: form.buyer_province, buyer_address: form.buyer_address },
      })
      await logActivity({ action: 'Draft Saved', subject: row.invoice_number, status: 'Saved', type: 'saved' })
      setMsg({ kind: 'ok', text: `Draft saved with ${cleanItems.length} product${cleanItems.length > 1 ? 's' : ''}.` })
      setForm(f => ({ ...f, invoice_number: draftNumber(), buyer_ntn: '', buyer_name: '', buyer_province: '', buyer_address: '' }))
      setItems([blankItem()])
      onSaved?.()
      navigate('/dashboard/reports')
    } catch (err) {
      setMsg({ kind: 'err', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#0e5f4f]">Create Invoice</p>
        <span className="text-[10px] text-gray-400 font-medium">ID: {form.invoice_number}</span>
      </div>

      <div className="border-b border-gray-100 pb-4">
        <BrandingAssets title="Invoice Branding — Logo &amp; Barcode" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Seller Company</label>
        {sellers.length === 0 ? (
          <a href="/dashboard/settings" className="block border border-dashed border-amber-300 bg-amber-50 rounded-lg px-3.5 py-2.5 text-xs text-amber-700 hover:bg-amber-100 transition-colors">
            No company added yet — add one with its FBR token in Settings →
          </a>
        ) : (
          <select value={sellerId} onChange={(e) => setSellerId(e.target.value)} className={inputClass}>
            {sellers.map(s => (
              <option key={s.id} value={s.id}>{s.company_name} — {s.ntn}{s.is_default ? ' (default)' : ''}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Invoice Date</label>
          <DateInput value={form.invoice_date} onChange={set('invoice_date')} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buyer NTN</label>
          <input type="text" value={form.buyer_ntn} onChange={set('buyer_ntn')} placeholder="7-digit NTN or 13-digit CNIC" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Buyer Name <span className="text-red-500">*</span>
          </label>
          <input type="text" value={form.buyer_name} onChange={set('buyer_name')} placeholder="Buyer business name (required by FBR)" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buyer Province</label>
          <select value={form.buyer_province} onChange={set('buyer_province')} className={inputClass}>
            <option value="">Select province…</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <p className="text-[10px] text-gray-400 mt-1">Required when the buyer is FBR-registered.</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buyer Address</label>
          <input type="text" value={form.buyer_address} onChange={set('buyer_address')} placeholder="Buyer address" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-700">Products</label>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-xs font-semibold text-[#0e5f4f] hover:text-[#083f33] transition-colors"
          >
            <HiOutlinePlus className="w-3.5 h-3.5" />
            Add product
          </button>
        </div>

        {items.map((it, idx) => {
          const lt = lineTotals(it)
          return (
            <div key={idx} className="rounded-xl border border-gray-200 p-3 flex flex-col gap-2.5 bg-[#fafbfc]">
              <div className="flex items-start gap-2">
                <span className="mt-2.5 text-[10px] font-bold text-gray-400 w-3 shrink-0">{idx + 1}</span>
                <div className="flex-1">
                  <ProductInput
                    value={it.description}
                    sellerId={seller?.id}
                    onChange={(v) => setItemVal(idx, 'description', v)}
                    onPick={(p) => setItemFields(idx, {
                      description: p.description,
                      hs_code: p.hs_code || it.hs_code,
                      unit_price: p.unit_price || it.unit_price,
                    })}
                    className={`${inputClass} bg-white`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  disabled={items.length === 1}
                  className="mt-1.5 p-1.5 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-30 disabled:hover:text-gray-300"
                  title="Remove product"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
              <div className="pl-5 mb-2">
                <label className="block text-[10px] font-semibold text-gray-400 mb-1">HS Code</label>
                <HsCodeInput
                  value={it.hs_code}
                  onChange={(v) => setItemVal(idx, 'hs_code', v)}
                  className={`${inputClass} bg-white`}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 pl-5">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 mb-1">QTY</label>
                  <input type="number" min="0" value={it.quantity} onChange={setItem(idx, 'quantity')} className={`${inputClass} bg-white`} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 mb-1">Unit Price</label>
                  <input type="number" min="0" value={it.unit_price} onChange={setItem(idx, 'unit_price')} className={`${inputClass} bg-white`} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 mb-1">Line Total</label>
                  <div className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 bg-white truncate" title={money(lt.total)}>
                    {money(lt.total)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Subtotal</span>
          <span className="text-xs font-medium text-gray-700">PKR {money(totals.sub)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">GST (18%)</span>
          <span className="text-xs font-semibold text-green-500">+ PKR {money(totals.gst)}</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <span className="text-sm font-bold text-gray-800">Total Payable</span>
          <span className="text-sm font-bold text-[#0e5f4f]">PKR {money(totals.total)}</span>
        </div>
      </div>

      {msg && (
        <div className={`text-xs font-medium rounded-lg px-3 py-2 border ${
          msg.kind === 'ok'
            ? 'text-green-700 bg-green-50 border-green-100'
            : 'text-red-700 bg-red-50 border-red-100'
        }`}>
          {msg.text}
        </div>
      )}

      <VerifyButton
        invoice={verifyInput}
        onVerified={handleVerified}
        className="w-full flex items-center justify-center gap-1.5 border border-[#0e5f4f] text-[#0e5f4f] hover:bg-[#0e5f4f]/5 rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
      />

      {/* Once FBR accepts the invoice, it can be printed / saved as PDF with its
          FBR invoice number on it. */}
      {receipt?.verification?.status === 'verified' && (
        <button
          type="button"
          onClick={() => setShowReceipt(true)}
          className="w-full flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
        >
          <HiOutlinePrinter className="w-4 h-4" />
          Print / Save Verified Invoice
        </button>
      )}

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button type="button" onClick={() => setShowPreview(true)} className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          <HiOutlineEye className="w-4 h-4" />
          Preview
        </button>
        <button onClick={handleSave} disabled={busy} className="bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60">
          {busy ? 'Saving…' : 'Save Draft'}
        </button>
      </div>

      {/* Draft preview — same document that gets printed. */}
      <InvoiceDocModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        invoice={verifyInput}
        title="Invoice Preview"
      />

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

export default NewQuickDraft
