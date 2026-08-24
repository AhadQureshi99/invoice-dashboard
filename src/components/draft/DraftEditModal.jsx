import { useMemo, useState } from 'react'
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi'
import Modal from '../common/Modal'
import DateInput from '../common/DateInput'
import HsCodeInput from './HsCodeInput'
import ProductInput from './ProductInput'
import { updateDraft } from '../../services/drafts'
import { logActivity } from '../../services/activity'

const inputClass = `w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
  placeholder:text-gray-300 text-gray-700
  focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20 focus:border-[#0e5f4f] transition-colors`

const GST_RATE = 0.18
const PROVINCES = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Capital Territory', 'Gilgit-Baltistan', 'Azad Jammu and Kashmir']
const DEFAULT_HS = '0101.2100'
const blankItem = () => ({ description: '', quantity: 1, unit_price: 0, hs_code: DEFAULT_HS })

const lineTotals = (it) => {
  const sub = Number(it.quantity || 0) * Number(it.unit_price || 0)
  const gst = sub * GST_RATE
  return { sub, gst, total: sub + gst }
}

const money = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Build the editable items list from a draft row. Prefer the stored payload
// items; otherwise reconstruct a single line from the draft's flat fields so an
// older/quick draft is still fully editable.
const itemsFromDraft = (d) => {
  const payloadItems = Array.isArray(d?.payload?.items) ? d.payload.items : null
  if (payloadItems && payloadItems.length) {
    return payloadItems.map(it => ({
      description: it.description || '',
      quantity:   Number(it.quantity ?? 1),
      unit_price: Number(it.unit_price ?? (it.quantity ? Number(it.subtotal || 0) / Number(it.quantity) : 0)),
      hs_code:    it.hs_code || DEFAULT_HS,
    }))
  }
  return [{
    description: d?.description || '',
    quantity:   Number(d?.quantity || 1),
    unit_price: Number(d?.unit_price || 0),
    hs_code:    DEFAULT_HS,
  }]
}

/**
 * Full draft editor: edit every field (invoice no, date, buyer NTN + name) and
 * fully manage products — add, remove, and edit description / HS code / qty /
 * price. On save the totals + payload.items are recomputed and persisted.
 */
const DraftEditModal = ({ open, draft, onClose, onSaved }) => {
  const [form, setForm] = useState({})
  const [items, setItems] = useState([blankItem()])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  // Re-seed local state whenever a new draft is opened.
  const [seededId, setSeededId] = useState(null)
  if (open && draft && draft.id !== seededId) {
    setForm({
      invoice_number: draft.invoice_number || '',
      invoice_date:   draft.invoice_date || '',
      buyer_ntn:      draft.buyer_ntn || '',
      buyer_name:     draft.buyer_name || '',
      buyer_province: draft.payload?.buyer_province || '',
      buyer_address:  draft.payload?.buyer_address || '',
    })
    setItems(itemsFromDraft(draft))
    setErr(null)
    setSeededId(draft.id)
  }

  const totals = useMemo(() => items.reduce((acc, it) => {
    const { sub, gst, total } = lineTotals(it)
    acc.sub += sub; acc.gst += gst; acc.total += total
    return acc
  }, { sub: 0, gst: 0, total: 0 }), [items])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const setItem = (idx, key) => (e) => {
    const val = e.target.value
    setItems(list => list.map((it, i) => (i === idx ? { ...it, [key]: val } : it)))
  }
  const setItemVal = (idx, key, val) => setItems(list => list.map((it, i) => (i === idx ? { ...it, [key]: val } : it)))
  const setItemFields = (idx, patch) => setItems(list => list.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  const addItem = () => setItems(list => [...list, blankItem()])
  const removeItem = (idx) => setItems(list => (list.length === 1 ? list : list.filter((_, i) => i !== idx)))

  const handleSave = async () => {
    setBusy(true); setErr(null)
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
      if (!(form.buyer_name || '').trim()) throw new Error('Buyer name is required — FBR rejects invoices without it.')

      const first   = cleanItems[0]
      const summary = cleanItems.length === 1
        ? first.description
        : `${first.description || 'Item'} +${cleanItems.length - 1} more`

      await updateDraft(draft.id, {
        invoice_number: (form.invoice_number || '').trim(),
        invoice_date:   form.invoice_date || null,
        buyer_ntn:      (form.buyer_ntn || '').trim(),
        buyer_name:     (form.buyer_name || '').trim(),
        description:    summary,
        quantity:       cleanItems.reduce((s, it) => s + it.quantity, 0),
        unit_price:     first.unit_price,
        subtotal:       totals.sub,
        tax_amount:     totals.gst,
        total_amount:   totals.total,
        payload:        { ...(draft.payload || {}), items: cleanItems, buyer_province: form.buyer_province, buyer_address: form.buyer_address },
      })
      await logActivity({ action: 'Draft Edited', subject: form.invoice_number || draft.id, status: 'Updated', type: 'updated' })
      onSaved?.()
      onClose?.()
      setSeededId(null)
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  const close = () => { setSeededId(null); onClose?.() }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Edit Draft"
      maxWidth="max-w-2xl"
      footer={
        <>
          <button onClick={close} className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={busy} className="bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60">
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Invoice #</label>
            <input value={form.invoice_number || ''} onChange={set('invoice_number')} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Invoice Date</label>
            <DateInput value={form.invoice_date || ''} onChange={set('invoice_date')} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buyer NTN / CNIC</label>
            <input value={form.buyer_ntn || ''} onChange={set('buyer_ntn')} placeholder="7-digit NTN or 13-digit CNIC" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Buyer Name <span className="text-red-500">*</span>
            </label>
            <input value={form.buyer_name || ''} onChange={set('buyer_name')} placeholder="Buyer business name (required by FBR)" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buyer Province</label>
            <select value={form.buyer_province || ''} onChange={set('buyer_province')} className={inputClass}>
              <option value="">Select province…</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <p className="text-[10px] text-gray-400 mt-1">Required when the buyer is FBR-registered.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buyer Address</label>
            <input value={form.buyer_address || ''} onChange={set('buyer_address')} placeholder="Buyer address" className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-700">Products</label>
            <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs font-semibold text-[#0e5f4f] hover:text-[#083f33] transition-colors">
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
                      sellerId={draft?.seller_id}
                      onChange={(v) => setItemVal(idx, 'description', v)}
                      onPick={(p) => setItemFields(idx, {
                        description: p.description,
                        hs_code: p.hs_code || it.hs_code,
                        unit_price: p.unit_price != null ? p.unit_price : it.unit_price,
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-5">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 mb-1">HS Code</label>
                    <HsCodeInput value={it.hs_code} onChange={(v) => setItemVal(idx, 'hs_code', v)} className={`${inputClass} bg-white`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 mb-1">QTY</label>
                    <input type="number" min="0" step="any" value={it.quantity} onChange={setItem(idx, 'quantity')} className={`${inputClass} bg-white`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 mb-1">Unit Price</label>
                    <input type="number" min="0" step="any" value={it.unit_price} onChange={setItem(idx, 'unit_price')} className={`${inputClass} bg-white`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 mb-1">Line Total</label>
                    <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 bg-white truncate" title={money(lt.total)}>
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
            <span className="text-xs text-gray-400">GST (18%)</span>
            <span className="text-xs font-semibold text-green-500">+ PKR {money(totals.gst)}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-800">Total Payable</span>
            <span className="text-sm font-bold text-[#0e5f4f]">PKR {money(totals.total)}</span>
          </div>
        </div>

        {err && (
          <div className="text-xs font-medium rounded-lg px-3 py-2 border text-red-700 bg-red-50 border-red-100">
            {err}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default DraftEditModal
