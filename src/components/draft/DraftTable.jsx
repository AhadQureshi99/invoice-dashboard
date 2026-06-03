import { useEffect, useState } from 'react'
import { HiOutlinePencil, HiOutlineTrash, HiOutlineDocumentDuplicate, HiOutlineCheckCircle } from 'react-icons/hi'
import { listDrafts, deleteDraft, duplicateDraft, updateDraft } from '../../services/drafts'
import { createInvoice } from '../../services/invoices'
import { logActivity } from '../../services/activity'
import { useSearch } from '../../lib/SearchContext'

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-3.5'

const DraftTable = ({ refreshKey = 0, statusFilter = '', onChange }) => {
  const { query } = useSearch()
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  const load = () => {
    setLoading(true)
    listDrafts({ limit: 200 })
      .then(({ rows }) => {
        let filtered = rows
        if (query) {
          const q = query.toLowerCase()
          filtered = filtered.filter(r =>
            (r.invoice_number || '').toLowerCase().includes(q) ||
            (r.buyer_ntn      || '').toLowerCase().includes(q) ||
            (r.buyer_name     || '').toLowerCase().includes(q)
          )
        }
        if (statusFilter) filtered = filtered.filter(r => r.status === statusFilter)
        setRows(filtered)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(load, [refreshKey, query, statusFilter])

  const handleDelete = async (id) => {
    if (!confirm('Delete this draft?')) return
    await deleteDraft(id)
    await logActivity({ action: 'Draft Deleted', subject: id, status: 'Deleted', type: 'deleted' })
    load(); onChange?.()
  }

  const handleDuplicate = async (id) => {
    await duplicateDraft(id)
    await logActivity({ action: 'Draft Duplicated', subject: id, status: 'Saved', type: 'saved' })
    load(); onChange?.()
  }

  const handlePromote = async (d) => {
    const payloadItems = Array.isArray(d.payload?.items) ? d.payload.items : null
    const items = payloadItems && payloadItems.length
      ? payloadItems.map(it => ({
          description:   it.description,
          quantity:      Number(it.quantity || 0),
          value_excl_st: Number(it.subtotal || 0),
          sales_tax:     Number(it.tax_amount || 0),
          total:         Number(it.total || 0),
        }))
      : [{ description: d.description, quantity: d.quantity, value_excl_st: d.subtotal, sales_tax: d.tax_amount, total: d.total_amount }]
    const inv = await createInvoice({
      invoice_number: d.invoice_number || `INV-${Date.now()}`,
      invoice_date:   d.invoice_date,
      seller_ntn:     d.seller_ntn,
      buyer_ntn:      d.buyer_ntn,
      buyer_name:     d.buyer_name,
      subtotal:       d.subtotal,
      tax_amount:     d.tax_amount,
      total_amount:   d.total_amount,
      status:         'ready',
      items,
    })
    await deleteDraft(d.id)
    await logActivity({ action: 'Draft → Invoice', subject: inv.invoice_number, status: 'Updated', type: 'updated' })
    load(); onChange?.()
  }

  const startEdit = (r) => setEditing({ ...r })
  const saveEdit = async () => {
    await updateDraft(editing.id, {
      invoice_number: editing.invoice_number,
      buyer_ntn:      editing.buyer_ntn,
      buyer_name:     editing.buyer_name,
      description:    editing.description,
    })
    setEditing(null); load(); onChange?.()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <div className="flex items-center justify-between px-6 pt-5 pb-1">
        <div>
          <p className="text-sm font-bold text-[#0e5f4f]">Recent Drafts</p>
          <p className="text-xs text-gray-400 mt-0.5">All your pending draft invoices</p>
        </div>
        <span className="text-xs font-semibold text-gray-500 tracking-wide">{rows.length} ITEMS</span>
      </div>

      <div className="px-6 pb-5 overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className={thClass}>Invoice#</th>
              <th className={thClass}>Recipient</th>
              <th className={thClass}>Total</th>
              <th className={thClass}>Status</th>
              <th className={`${thClass} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="py-8 text-center text-xs text-gray-400">Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-xs text-gray-400">No drafts</td></tr>}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 last:border-0">
                <td className={`${tdClass} font-medium text-gray-800`}>
                  {editing?.id === row.id
                    ? <input value={editing.invoice_number || ''} onChange={(e) => setEditing(s => ({ ...s, invoice_number: e.target.value }))} className="border rounded px-2 py-1 text-xs w-32" />
                    : (row.invoice_number || `DFT-${String(row.id).slice(0, 6)}`)}
                </td>
                <td className={tdClass}>
                  {editing?.id === row.id
                    ? <input value={editing.buyer_ntn || ''} onChange={(e) => setEditing(s => ({ ...s, buyer_ntn: e.target.value }))} className="border rounded px-2 py-1 text-xs w-36" />
                    : `${row.buyer_ntn || '—'}${row.buyer_name ? ` (${row.buyer_name})` : ''}`}
                </td>
                <td className={tdClass}>PKR {Number(row.total_amount || 0).toLocaleString()}</td>
                <td className={tdClass}>
                  <span className="bg-green-50 text-green-500 text-[11px] font-semibold px-3 py-0.5 rounded-full border border-green-100">
                    {String(row.status || 'auto-saved').toUpperCase()}
                  </span>
                </td>
                <td className={`${tdClass} text-right`}>
                  <div className="flex items-center justify-end gap-1">
                    {editing?.id === row.id ? (
                      <>
                        <button onClick={saveEdit} className="text-xs font-semibold text-green-600 hover:underline px-1">Save</button>
                        <button onClick={() => setEditing(null)} className="text-xs font-semibold text-gray-500 hover:underline px-1">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handlePromote(row)} className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Convert to invoice">
                          <HiOutlineCheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => startEdit(row)} className="p-1 text-gray-400 hover:text-[#0e5f4f] transition-colors" title="Edit">
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDuplicate(row.id)} className="p-1 text-gray-400 hover:text-[#0e5f4f] transition-colors" title="Duplicate">
                          <HiOutlineDocumentDuplicate className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DraftTable
