import { useState } from 'react'
import { HiOutlineDownload } from 'react-icons/hi'
import { listInvoices } from '../../services/invoices'
import { createReport } from '../../services/reports'
import { downloadCSV } from '../../lib/export'
import { logActivity } from '../../services/activity'

const BulkExportCard = ({ onCreated }) => {
  const [format, setFormat]   = useState('csv')
  const [range,  setRange]    = useState('90')
  const [busy,   setBusy]     = useState(false)
  const [size,   setSize]     = useState('—')

  const initialize = async () => {
    setBusy(true)
    try {
      const { rows } = await listInvoices({ limit: 5000, rangeDays: range === 'all' ? null : range })
      const flat = rows.map(r => ({
        invoice_number: r.invoice_number,
        invoice_date:   r.invoice_date,
        seller_ntn:     r.seller_ntn,
        seller_name:    r.seller_name,
        buyer_ntn:      r.buyer_ntn,
        buyer_name:     r.buyer_name,
        subtotal:       r.subtotal,
        tax_amount:     r.tax_amount,
        total_amount:   r.total_amount,
        status:         r.status,
      }))
      const name = `bulk-export-${Date.now()}.${format === 'zip' ? 'zip' : 'csv'}`

      // The CSV download happens locally; ZIP option still produces a CSV (single-file zip would need JSZip).
      downloadCSV(flat,
        ['invoice_number','invoice_date','seller_ntn','seller_name','buyer_ntn','buyer_name','subtotal','tax_amount','total_amount','status'],
        name.replace(/\.zip$/, '.csv'))

      const bytes = flat.reduce((s, r) => s + JSON.stringify(r).length, 0)
      setSize(`${(bytes / 1024).toFixed(1)} KB`)

      const report = await createReport({
        name, kind: 'bulk-export', format,
        date_range: range === 'all' ? 'All time' : `Last ${range} days`,
        size_bytes: bytes,
        progress: 100, status: 'ready',
      })
      await logActivity({ action: 'Bulk Export', subject: name, status: 'Success', type: 'success' })
      onCreated?.(report)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <p className="text-sm font-bold text-[#0e5f4f]">Bulk Invoice Export</p>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date Range</label>
        <select value={range} onChange={(e) => setRange(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20 focus:border-[#0e5f4f] bg-white">
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="180">Last 6 months</option>
          <option value="365">Last year</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">Format Type</label>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setFormat('zip')} className={`flex items-center gap-2.5 border rounded-xl p-3 transition-colors ${format === 'zip' ? 'border-[#0e5f4f] bg-[#4eaa88]/15' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="w-9 h-9 bg-[#0e5f4f] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">ZIP</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">ZIP</span>
          </button>
          <button onClick={() => setFormat('csv')} className={`flex items-center gap-2.5 border rounded-xl p-3 transition-colors ${format === 'csv' ? 'border-[#0e5f4f] bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">CSV</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">CSV/Excel</span>
          </button>
        </div>
      </div>

      <button onClick={initialize} disabled={busy} className="w-full bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors mt-auto disabled:opacity-60">
        <HiOutlineDownload className="w-4 h-4" />
        {busy ? 'Generating…' : 'Initialize Bulk Download'}
      </button>
      <p className="text-[11px] text-gray-400 text-center -mt-2">Estimated size: {size}</p>
    </div>
  )
}

export default BulkExportCard