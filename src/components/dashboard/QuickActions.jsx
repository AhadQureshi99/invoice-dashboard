import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { HiOutlineShieldCheck, HiOutlinePencilAlt, HiOutlineUpload, HiOutlineDownload } from 'react-icons/hi'
import { listInvoices } from '../../services/invoices'
import { downloadCSV } from '../../lib/export'

const QuickActions = ({ onUpload }) => {
  const navigate = useNavigate()
  const fileRef  = useRef(null)

  const exportAll = async () => {
    const { rows } = await listInvoices({ limit: 1000 })
    if (!rows.length) { alert('No invoices yet to export.'); return }
    const flat = rows.map(r => ({
      invoice_number: r.invoice_number,
      invoice_date:   r.invoice_date,
      seller_ntn:     r.seller_ntn,
      buyer_ntn:      r.buyer_ntn,
      total_amount:   r.total_amount,
      status:         r.status,
    }))
    downloadCSV(flat, ['invoice_number','invoice_date','seller_ntn','buyer_ntn','total_amount','status'], `invoices-${Date.now()}.csv`)
  }

  const actions = [
    { icon: HiOutlineShieldCheck, label: 'Verify Invoice', bg: 'bg-emerald-500', onClick: () => navigate('/dashboard/verification') },
    { icon: HiOutlinePencilAlt,   label: 'Create Draft',   bg: 'bg-[#0e5f4f]',    onClick: () => navigate('/dashboard/draft') },
    { icon: HiOutlineUpload,      label: 'Upload CSV',     bg: 'bg-red-500',     onClick: () => fileRef.current?.click() },
    { icon: HiOutlineDownload,    label: 'Export CSV',     bg: 'bg-teal-500',    onClick: exportAll },
  ]

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <p className="text-sm font-bold text-[#0e5f4f] mb-4">Quick Actions</p>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label, bg, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-2.5 py-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-700">{label}</span>
          </button>
        ))}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (!f) return
          if (onUpload) onUpload(f)
          else navigate('/dashboard/invoices')
        }}
      />
    </div>
  )
}

export default QuickActions