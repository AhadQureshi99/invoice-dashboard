import { useEffect, useState } from 'react'
import { listVerifications } from '../../services/verifications'

const badgeClass = {
  verified:  'bg-green-50  text-green-600',
  invalid:   'bg-red-50    text-red-500',
  duplicate: 'bg-orange-100 text-orange-500',
  pending:   'bg-gray-100  text-gray-500',
}

const labelFor = (s) => ({ verified: 'Verified', invalid: 'Invalid', duplicate: 'Duplicate', pending: 'Pending' }[s] || s)

const StatusBadge = ({ status }) => (
  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badgeClass[status] || badgeClass.pending}`}>
    {labelFor(status)}
  </span>
)

const ExcelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect width="14" height="14" rx="2" fill="#1D6F42" />
    <text x="2" y="11" fontSize="8" fontWeight="bold" fill="white">X</text>
  </svg>
)
const PdfIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect width="14" height="14" rx="2" fill="#E5251A" />
    <text x="1" y="11" fontSize="6.5" fontWeight="bold" fill="white">PDF</text>
  </svg>
)

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-3.5'

const PAGE_SIZE = 10

const VerificationHistory = ({ refreshKey = 0 }) => {
  const [rows,   setRows]   = useState([])
  const [count,  setCount]  = useState(0)
  const [page,   setPage]   = useState(1)
  const [loading,setLoading]= useState(true)

  useEffect(() => {
    setLoading(true)
    listVerifications({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE })
      .then(({ rows, count }) => { setRows(rows); setCount(count) })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [page, refreshKey])

  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

  const exportCSV = () => {
    const header = ['Date', 'Invoice No', 'Seller NTN', 'Buyer NTN', 'Amount', 'Status']
    const body   = rows.map(r => [fmtDate(r.created_at), r.invoice_number || '', r.seller_ntn || '', r.buyer_ntn || '', r.amount || 0, r.status])
    const csv    = [header, ...body].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob   = new Blob([csv], { type: 'text/csv' })
    const a      = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `verifications-${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <div className="flex items-start justify-between px-6 pt-5 pb-1">
        <div>
          <p className="text-sm font-bold text-[#1e3a5f]">Verification History</p>
          <p className="text-xs text-gray-400 mt-0.5">Overview of recent status checks and verification results.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
            <ExcelIcon /> Excel
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
            <PdfIcon /> PDF
          </button>
        </div>
      </div>

      <div className="px-6 overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className={thClass}>Date &amp; Time</th>
              <th className={thClass}>Invoice No.</th>
              <th className={thClass}>Seller NTN</th>
              <th className={thClass}>Amount PKR</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="py-8 text-center text-xs text-gray-400">Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-xs text-gray-400">No verifications yet</td></tr>}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 last:border-0">
                <td className={`${tdClass} text-gray-500`}>{fmtDate(row.created_at)}</td>
                <td className={`${tdClass} text-gray-800 font-medium`}>{row.invoice_number || '—'}</td>
                <td className={tdClass}>{row.seller_ntn || '—'}</td>
                <td className={tdClass}>{Number(row.amount || 0).toLocaleString()}</td>
                <td className={tdClass}>
                  <StatusBadge status={row.status} />
                </td>
                <td className={tdClass}>
                  <button
                    onClick={() => alert(JSON.stringify(row.response_payload, null, 2))}
                    className="text-xs font-medium text-gray-500 hover:text-[#1e3a5f] transition-colors"
                  >
                    View Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-1 px-6 py-4">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs">‹</button>
        {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
              n === page ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {n}
          </button>
        ))}
        <button onClick={() => setPage(p => Math.min(pages, p + 1))} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs">›</button>
      </div>
    </div>
  )
}

export default VerificationHistory
