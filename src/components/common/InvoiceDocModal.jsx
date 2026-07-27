import Modal from './Modal'
import { isoToDMY } from './DateInput'

/**
 * Printable invoice document in a modal, shared by the draft preview and the
 * "verified invoice" receipt. The body is marked .print-area so handlePrint's
 * body.printing-preview class isolates just this document on the printout.
 *
 * @param {object} invoice      normalized invoice { invoice_number, invoice_date, seller{…}|seller_*, buyer_*, items[…] }
 * @param {object} verification optional { status, fbrInvoiceNo, statusCode, durationMs } — renders the FBR badge
 */

const money = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Items arrive either unit-price shaped (draft form) or amount shaped
// (verification form). Normalize both into one row shape.
const toRow = (it) => {
  const qty   = Number(it.quantity || 0)
  const sub   = it.value_excl_st != null ? Number(it.value_excl_st) : qty * Number(it.unit_price || 0)
  const tax   = Number(it.sales_tax || 0)
  const total = it.total != null ? Number(it.total) : sub + tax
  const unit  = it.unit_price != null ? Number(it.unit_price) : (qty ? sub / qty : 0)
  return { description: it.description, hs_code: it.hs_code, qty, unit, sub, tax, total }
}

const InvoiceDocModal = ({ open, onClose, invoice, verification = null, title = 'Invoice Preview', onPrint }) => {
  if (!open || !invoice) return null

  const rows   = (invoice.items || []).map(toRow)
  const totals = rows.reduce((a, r) => ({ sub: a.sub + r.sub, tax: a.tax + r.tax, total: a.total + r.total }), { sub: 0, tax: 0, total: 0 })

  const handlePrint = onPrint || (() => {
    document.body.classList.add('printing-preview')
    const cleanup = () => {
      document.body.classList.remove('printing-preview')
      window.removeEventListener('afterprint', cleanup)
    }
    window.addEventListener('afterprint', cleanup)
    window.print()
  })

  const verified = verification?.status === 'verified'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="max-w-2xl"
      footer={
        <>
          <button onClick={onClose} className="no-print border border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Close</button>
          <button onClick={handlePrint} className="no-print bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-lg px-4 py-2 text-sm font-semibold">Print / Save PDF</button>
        </>
      }
    >
      <div className="print-area flex flex-col gap-5 text-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-bold">Invoice</p>
            <p className="text-xs text-gray-500 mt-0.5">ID: {invoice.invoice_number || '—'}</p>
            <p className="text-xs text-gray-400">Date: {isoToDMY(invoice.invoice_date) || '—'}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-[#0e5f4f]">PKR {money(totals.total)}</p>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Total Amount</p>
          </div>
        </div>

        {verification && (
          <div className={`rounded-xl border px-3.5 py-2.5 flex flex-wrap items-center gap-x-5 gap-y-1 ${
            verified ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}>
            <span className={`text-[11px] font-bold uppercase tracking-wide ${verified ? 'text-green-700' : 'text-red-700'}`}>
              {verified ? 'Verified by FBR' : 'Rejected by FBR'}
            </span>
            {verification.fbrInvoiceNo && (
              <span className="text-[11px] text-gray-600">FBR Invoice No: <span className="font-semibold">{verification.fbrInvoiceNo}</span></span>
            )}
            {verification.statusCode && (
              <span className="text-[11px] text-gray-600">Status code: <span className="font-semibold">{verification.statusCode}</span></span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-4">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Seller</p>
            <p className="text-sm font-bold">{invoice.seller_name || '—'}</p>
            <p className="text-xs text-gray-500 mt-1">NTN: {invoice.seller_ntn || '—'}</p>
            <p className="text-xs text-gray-500">{invoice.seller_address || ''}{invoice.seller_province ? `, ${invoice.seller_province}` : ''}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Buyer</p>
            <p className="text-sm font-bold">{invoice.buyer_name || '—'}</p>
            <p className="text-xs text-gray-500 mt-1">NTN: {invoice.buyer_ntn || '—'}</p>
            <p className="text-xs text-gray-500">{invoice.buyer_address || ''}{invoice.buyer_province ? `, ${invoice.buyer_province}` : ''}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left">
                <th className="pb-2">Description</th>
                <th className="pb-2">HS Code</th>
                <th className="pb-2 text-center">Qty</th>
                <th className="pb-2 text-right">Unit Price</th>
                <th className="pb-2 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="border-b border-gray-50 text-xs text-gray-700">
                  <td className="py-2 pr-3">{r.description || '—'}</td>
                  <td className="py-2 pr-3">{r.hs_code || '—'}</td>
                  <td className="py-2 text-center">{r.qty}</td>
                  <td className="py-2 text-right">{money(r.unit)}</td>
                  <td className="py-2 text-right font-semibold">{money(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-12"><span className="text-xs text-gray-500">Subtotal</span><span className="text-xs font-semibold w-32 text-right">{money(totals.sub)}</span></div>
            <div className="flex items-center gap-12"><span className="text-xs text-gray-500">Sales Tax</span><span className="text-xs font-semibold w-32 text-right">{money(totals.tax)}</span></div>
            <div className="flex items-center gap-12 border-t border-gray-200 pt-2 mt-1"><span className="text-sm font-bold">Total</span><span className="text-sm font-black text-[#0e5f4f] w-32 text-right">PKR {money(totals.total)}</span></div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default InvoiceDocModal
