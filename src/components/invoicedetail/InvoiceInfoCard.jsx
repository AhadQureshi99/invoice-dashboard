import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getInvoice } from '../../services/invoices'
import { useAuth } from '../../lib/AuthContext'

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'

const InvoiceInfoCard = () => {
  const { id } = useParams()
  const { profile } = useAuth()
  const [inv, setInv]       = useState(null)
  const [loading, setLoad]  = useState(true)
  const [err, setErr]       = useState(null)

  useEffect(() => {
    if (!id) { setLoad(false); return }
    getInvoice(id).then(setInv).catch(e => setErr(e.message)).finally(() => setLoad(false))
  }, [id])

  if (loading) return <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-sm text-gray-400">Loading invoice…</div>
  if (err)     return <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 text-sm text-red-500">{err}</div>
  if (!inv)    return <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-sm text-gray-400">Invoice not found.</div>

  const items   = inv.items || []
  const subtotal = items.reduce((s, it) => s + Number(it.value_excl_st || 0), 0)
  const tax      = items.reduce((s, it) => s + Number(it.sales_tax || 0), 0)
  const total    = items.reduce((s, it) => s + Number(it.total || 0), 0) || inv.total_amount

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {profile?.logo_url && (
            <img
              src={profile.logo_url}
              alt="Company logo"
              className="h-12 w-12 rounded-lg object-contain border border-gray-100 bg-white shrink-0"
            />
          )}
          <div>
            <p className="text-base font-bold text-gray-800">Invoice</p>
            <p className="text-xs text-gray-500 mt-0.5">ID: {inv.invoice_number}</p>
            {inv.invoice_ref_no && <p className="text-xs text-gray-400">INTERNAL REF: {inv.invoice_ref_no}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-[#0e5f4f]">PKR {Number(total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Total Amount Due</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 pt-5">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Issuer Information</p>
          <p className="text-sm font-black text-gray-800">{inv.seller_name || '—'}</p>
          <p className="text-xs text-gray-500 mt-2">NTN: {inv.seller_ntn || '—'}</p>
          <p className="text-xs text-gray-500 mt-1">{inv.seller_address || '—'}, {inv.seller_province || ''}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Recipient Information</p>
          <p className="text-sm font-black text-gray-800">{inv.buyer_name || '—'}</p>
          <p className="text-xs text-gray-500 mt-2">NTN: {inv.buyer_ntn || '—'}</p>
          <p className="text-xs text-gray-500 mt-1">{inv.buyer_address || '—'}, {inv.buyer_province || ''}</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5 overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className={thClass}>Description</th>
              <th className={`${thClass} text-center`}>Quantity</th>
              <th className={`${thClass} text-right`}>Unit Value</th>
              <th className={`${thClass} text-right`}>Sales Tax</th>
              <th className={`${thClass} text-right`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={5} className="py-6 text-xs text-gray-400 text-center">No line items</td></tr>}
            {items.map((it) => (
              <tr key={it.id} className="border-b border-gray-50">
                <td className="text-xs text-gray-700 py-3.5 pr-4 max-w-[240px]">{it.description}</td>
                <td className="text-xs text-gray-500 py-3.5 text-center">{it.quantity}</td>
                <td className="text-xs text-gray-500 py-3.5 text-right">{Number(it.value_excl_st || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="text-xs text-gray-500 py-3.5 text-right">{Number(it.sales_tax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="text-xs text-gray-700 font-semibold py-3.5 text-right">{Number(it.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-12">
            <span className="text-xs text-gray-500">Subtotal</span>
            <span className="text-xs font-semibold text-gray-700 w-32 text-right">{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center gap-12">
            <span className="text-xs text-gray-500">Sales Tax</span>
            <span className="text-xs font-semibold text-gray-700 w-32 text-right">{tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center gap-12 border-t border-gray-200 pt-2 mt-1">
            <span className="text-sm font-bold text-gray-800">Total Amount</span>
            <span className="text-sm font-black text-[#0e5f4f] w-32 text-right">PKR {Number(total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {profile?.barcode_url && (
        <div className="flex justify-end border-t border-gray-100 pt-4">
          <img src={profile.barcode_url} alt="Barcode" className="h-16 object-contain" />
        </div>
      )}

    </div>
  )
}

export default InvoiceInfoCard
