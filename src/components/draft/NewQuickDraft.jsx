import { useMemo, useState } from 'react'
import { HiOutlineEye } from 'react-icons/hi'
import { createDraft } from '../../services/drafts'
import { logActivity } from '../../services/activity'

const inputClass = `w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
  placeholder:text-gray-300 text-gray-700
  focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20 focus:border-[#0e5f4f] transition-colors`

const todayISO = () => new Date().toISOString().slice(0, 10)
const draftNumber = () => `DFT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`

const NewQuickDraft = ({ onSaved }) => {
  const [form, setForm] = useState({
    invoice_number: draftNumber(),
    invoice_date:   todayISO(),
    seller_ntn:     '',
    buyer_ntn:      '',
    description:    '',
    quantity:       1,
    unit_price:     0,
  })
  const [busy, setBusy] = useState(false)
  const [msg,  setMsg]  = useState(null)

  const totals = useMemo(() => {
    const sub = Number(form.quantity || 0) * Number(form.unit_price || 0)
    const gst = sub * 0.18
    return { sub, gst, total: sub + gst }
  }, [form.quantity, form.unit_price])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setBusy(true); setMsg(null)
    try {
      const row = await createDraft({
        invoice_number: form.invoice_number,
        invoice_date:   form.invoice_date,
        seller_ntn:     form.seller_ntn,
        buyer_ntn:      form.buyer_ntn,
        description:    form.description,
        quantity:       Number(form.quantity),
        unit_price:     Number(form.unit_price),
        subtotal:       totals.sub,
        tax_amount:     totals.gst,
        total_amount:   totals.total,
      })
      await logActivity({ action: 'Draft Saved', subject: row.invoice_number, status: 'Saved', type: 'saved' })
      setMsg({ kind: 'ok', text: 'Draft saved.' })
      setForm(f => ({ ...f, invoice_number: draftNumber(), description: '' }))
      onSaved?.()
    } catch (err) {
      setMsg({ kind: 'err', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#0e5f4f]">New Quick Draft</p>
        <span className="text-[10px] text-gray-400 font-medium">ID: {form.invoice_number}</span>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Invoice Date</label>
        <input type="date" value={form.invoice_date} onChange={set('invoice_date')} className={inputClass} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Seller NTN</label>
          <input type="text" value={form.seller_ntn} onChange={set('seller_ntn')} placeholder="xxxxxxx-x" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buyer NTN</label>
          <input type="text" value={form.buyer_ntn} onChange={set('buyer_ntn')} placeholder="xxxxxxx-x" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={set('description')}
          placeholder="Item details..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">QTY</label>
          <input type="number" value={form.quantity} onChange={set('quantity')} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Unit Price (PKR)</label>
          <input type="number" value={form.unit_price} onChange={set('unit_price')} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Subtotal</span>
          <span className="text-xs font-medium text-gray-700">PKR {totals.sub.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">GST (18%)</span>
          <span className="text-xs font-semibold text-green-500">+ PKR {totals.gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <span className="text-sm font-bold text-gray-800">Total Payable</span>
          <span className="text-sm font-bold text-[#0e5f4f]">PKR {totals.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          <HiOutlineEye className="w-4 h-4" />
          Preview
        </button>
        <button onClick={handleSave} disabled={busy} className="bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60">
          {busy ? 'Saving…' : 'Save Draft'}
        </button>
      </div>
    </div>
  )
}

export default NewQuickDraft
