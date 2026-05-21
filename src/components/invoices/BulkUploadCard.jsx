import { useRef, useState } from 'react'
import { HiOutlineCloudUpload } from 'react-icons/hi'
import { parseCSV, downloadCSV } from '../../lib/export'
import { createInvoice } from '../../services/invoices'
import { logActivity } from '../../services/activity'

const TEMPLATE_HEADERS = [
  'invoice_number','invoice_date','seller_ntn','seller_name','buyer_ntn','buyer_name',
  'description','quantity','unit_price','sales_tax','total','status',
]

const BulkUploadCard = ({ onUploaded }) => {
  const ref = useRef(null)
  const [progress, setProgress] = useState({ done: 0, total: 0, errors: 0 })
  const [busy,     setBusy]     = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const downloadTemplate = () => {
    const sample = [{
      invoice_number: 'INV-2026-0001',
      invoice_date:   new Date().toISOString().slice(0, 10),
      seller_ntn:     '1234567-8',
      seller_name:    'My Company',
      buyer_ntn:      '8765432-1',
      buyer_name:     'Customer Co',
      description:    'Sample Product',
      quantity:       1,
      unit_price:     1000,
      sales_tax:      180,
      total:          1180,
      status:         'draft',
    }]
    downloadCSV(sample, TEMPLATE_HEADERS, 'invoice-template.csv')
  }

  const handleFile = async (file) => {
    setBusy(true)
    try {
      const text = await file.text()
      const { records } = parseCSV(text)
      setProgress({ done: 0, total: records.length, errors: 0 })

      let done = 0, errors = 0
      for (const r of records) {
        try {
          await createInvoice({
            invoice_number: r.invoice_number || `INV-${Date.now()}`,
            invoice_date:   r.invoice_date   || new Date().toISOString().slice(0, 10),
            seller_ntn:     r.seller_ntn,
            seller_name:    r.seller_name,
            buyer_ntn:      r.buyer_ntn,
            buyer_name:     r.buyer_name,
            subtotal:       Number(r.unit_price || 0) * Number(r.quantity || 1),
            tax_amount:     Number(r.sales_tax || 0),
            total_amount:   Number(r.total || 0) || (Number(r.unit_price || 0) * Number(r.quantity || 1) + Number(r.sales_tax || 0)),
            status:         (r.status || 'draft').toLowerCase(),
            items: [{
              description:   r.description,
              quantity:      Number(r.quantity || 1),
              total:         Number(r.total || 0),
              value_excl_st: Number(r.unit_price || 0) * Number(r.quantity || 1),
              sales_tax:     Number(r.sales_tax || 0),
            }],
          })
          done += 1
        } catch (_) { errors += 1 }
        setProgress({ done: done + errors, total: records.length, errors })
      }
      await logActivity({ action: 'Bulk Upload', subject: file.name, status: `${done} imported`, type: 'success', metadata: { errors } })
      onUploaded?.({ done, errors, total: records.length })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-[1.4] min-w-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-[#0e5f4f]">Bulk Invoice Processing</p>
          <p className="text-xs text-gray-400 mt-0.5">Drag and drop your CSV ledger file here</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Current Status</p>
          <p className={`text-xs font-bold mt-0.5 ${busy ? 'text-orange-500' : 'text-green-500'}`}>
            {busy ? `Processing ${progress.done}/${progress.total}` : 'Ready'}
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all ${busy ? 'bg-orange-500' : 'bg-green-500'}`}
          style={{ width: `${progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%` }}
        />
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
        onClick={() => ref.current?.click()}
        className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-12 cursor-pointer transition-colors ${
          dragOver ? 'border-[#0e5f4f] bg-blue-50' : 'border-gray-200 bg-[#fafbfc] hover:border-[#0e5f4f]/40'
        }`}
      >
        <HiOutlineCloudUpload className="w-9 h-9 text-gray-300 mb-3" />
        <p className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-400 mt-1">CSV up to 50 MB (FBR Schema v2.1 compatible)</p>
        <input
          ref={ref}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button onClick={downloadTemplate} className="text-xs font-semibold text-blue-600 hover:underline">
          Download CSV template
        </button>
        {progress.errors > 0 && (
          <span className="text-xs text-red-500 font-semibold">{progress.errors} row(s) failed</span>
        )}
      </div>
    </div>
  )
}

export default BulkUploadCard
