import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listInvoices } from '../../services/invoices'

const badgeClass = {
  verified: 'text-green-500',
  invalid:  'text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full',
  pending:  'text-orange-400 bg-orange-50 px-2.5 py-0.5 rounded-full',
  draft:    'text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full',
}

const labelFor = (s) => ({ verified: 'Verified', invalid: 'Invalid', pending: 'Pending', draft: 'Draft' }[s] || s)

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-4'

const PAGE_SIZE = 25

const InvoiceTable = () => {
  const [rows,    setRows]    = useState([])
  const [count,   setCount]   = useState(0)
  const [page,    setPage]    = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    listInvoices({ limit: pageSize, offset: (page - 1) * pageSize })
      .then(({ rows, count }) => { setRows(rows); setCount(count) })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [page, pageSize])

  const pages = Math.max(1, Math.ceil(count / pageSize))

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className={thClass}>Date</th>
              <th className={thClass}>Invoice #</th>
              <th className={thClass}>Buyer NTN / Name</th>
              <th className={thClass}>Type</th>
              <th className={thClass}>Amount (PKR)</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="text-center py-8 text-xs text-gray-400">Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-xs text-gray-400">No invoices yet</td></tr>}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 last:border-0">
                <td className={`${tdClass} text-gray-500`}>{row.invoice_date ? new Date(row.invoice_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                <td className={`${tdClass} font-semibold text-gray-800`}>{row.invoice_number}</td>
                <td className={tdClass}>
                  <p className="text-gray-800 font-medium">{row.buyer_ntn}</p>
                  <p className="text-xs text-gray-400">{row.buyer_name}</p>
                </td>
                <td className={tdClass}>{row.invoice_type || 'Sale Invoice'}</td>
                <td className={`${tdClass} font-medium text-gray-800`}>{Number(row.total_amount || 0).toLocaleString()}</td>
                <td className={tdClass}>
                  <span className={`text-xs font-semibold ${badgeClass[row.status] || badgeClass.draft}`}>
                    {labelFor(row.status)}
                  </span>
                </td>
                <td className={tdClass}>
                  <Link to={`/dashboard/invoices/${row.id}`} className="text-xs font-medium text-gray-400 hover:text-[#0e5f4f] transition-colors">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">
            Showing {rows.length ? (page - 1) * pageSize + 1 : 0}-{(page - 1) * pageSize + rows.length} of {count.toLocaleString()} items
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0e5f4f]/20 bg-white"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs">‹</button>
          {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                n === page ? 'bg-[#0e5f4f] text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {n}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs">›</button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceTable
