import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineFilter, HiOutlineCheck, HiOutlineTrash } from 'react-icons/hi'
import { listInvoices, updateInvoice, deleteInvoice } from '../../services/invoices'
import { logActivity } from '../../services/activity'
import { useSearch } from '../../lib/SearchContext'
import { downloadCSV } from '../../lib/export'

const badgeClass = {
  ready:     'bg-green-50 text-green-500',
  verified:  'bg-green-50 text-green-500',
  missing:   'bg-red-50   text-red-500',
  pending:   'bg-yellow-50 text-yellow-600',
  invalid:   'bg-red-50   text-red-500',
  failed:    'bg-red-50   text-red-500',
  draft:     'bg-gray-50  text-gray-500',
  duplicate: 'bg-[#4eaa88]/25 text-[#0e5f4f]',
  void:      'bg-gray-100 text-gray-500',
}
const labelFor = (s) => ({ ready: 'Ready', verified: 'Verified', missing: 'Missing Field', pending: 'Pending', invalid: 'Invalid', failed: 'Failed', draft: 'Draft', duplicate: 'Duplicate', void: 'Void' }[s] || s)

const StatusBadge = ({ status }) => (
  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badgeClass[status] || badgeClass.draft}`}>
    {labelFor(status)}
  </span>
)

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-3.5'
const PAGE_SIZE = 10

const ValidationPreviewTable = ({ filters = {}, refreshKey = 0, onChange }) => {
  const { query } = useSearch()
  const [rows,    setRows]    = useState([])
  const [count,   setCount]   = useState(0)
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(true)
  const [busy,    setBusy]    = useState(false)

  const load = () => {
    setLoading(true)
    listInvoices({
      limit:     PAGE_SIZE,
      offset:    (page - 1) * PAGE_SIZE,
      search:    query,
      status:    filters.status,
      type:      filters.type,
      minAmount: filters.min,
      maxAmount: filters.max,
      rangeDays: filters.range,
    })
      .then(({ rows, count }) => { setRows(rows); setCount(count) })
      .finally(() => setLoading(false))
  }

  useEffect(load, [page, query, filters.status, filters.type, filters.min, filters.max, filters.range, refreshKey])

  const authorizeAll = async () => {
    setBusy(true)
    try {
      const ready = rows.filter(r => r.status === 'ready' || r.status === 'draft')
      await Promise.all(ready.map(r => updateInvoice(r.id, { status: 'pending' })))
      load()
      onChange?.()
    } finally { setBusy(false) }
  }

  const handleDelete = async (row) => {
    if (!confirm(`Delete invoice ${row.invoice_number}? This cannot be undone.`)) return
    await deleteInvoice(row.id)
    await logActivity({ action: 'Invoice Deleted', subject: row.invoice_number, status: 'Deleted', type: 'deleted' })
    load()
    onChange?.()
  }

  const exportCSV = () => {
    const flat = rows.map(r => ({
      invoice_number: r.invoice_number,
      invoice_date:   r.invoice_date,
      buyer_ntn:      r.buyer_ntn,
      total_amount:   r.total_amount,
      status:         r.status,
    }))
    downloadCSV(flat, ['invoice_number','invoice_date','buyer_ntn','total_amount','status'], `invoices-page-${page}.csv`)
  }

  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <div className="flex items-start justify-between px-6 pt-5 pb-1">
        <div>
          <p className="text-sm font-bold text-[#0e5f4f]">Invoice Validation Preview</p>
          <p className="text-xs text-gray-400 mt-0.5">{count.toLocaleString()} invoice(s) matching current filters</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
            <HiOutlineFilter className="w-3 h-3" />
            EXPORT CSV
          </button>
          <button onClick={authorizeAll} disabled={busy} className="flex items-center gap-1.5 bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60">
            <HiOutlineCheck className="w-3.5 h-3.5" />
            {busy ? 'Working…' : 'AUTHORIZE ALL READY'}
          </button>
        </div>
      </div>

      <div className="px-6 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className={thClass}>Invoice ID</th>
              <th className={thClass}>Recipient NTN</th>
              <th className={thClass}>Date</th>
              <th className={thClass}>Total Amount (PKR)</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="py-8 text-center text-xs text-gray-400">Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-xs text-gray-400">No invoices match your filters</td></tr>}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 last:border-0">
                <td className={`${tdClass} font-medium text-gray-800`}>{row.invoice_number}</td>
                <td className={tdClass}>{row.buyer_ntn || '—'}</td>
                <td className={tdClass}>{row.invoice_date ? new Date(row.invoice_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                <td className={tdClass}>{Number(row.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className={tdClass}><StatusBadge status={row.status} /></td>
                <td className={tdClass}>
                  <div className="flex items-center gap-3">
                    <Link to={`/dashboard/invoices/${row.id}`} className="text-xs font-semibold text-gray-500 hover:text-[#0e5f4f] transition-colors">
                      View
                    </Link>
                    <button onClick={() => handleDelete(row)} className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors" title="Delete invoice">
                      <HiOutlineTrash className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
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
              n === page ? 'bg-[#0e5f4f] text-white' : 'text-gray-500 hover:bg-gray-100'
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

export default ValidationPreviewTable