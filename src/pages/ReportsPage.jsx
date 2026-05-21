import { useState } from 'react'
import { HiOutlineRefresh, HiOutlinePlusCircle } from 'react-icons/hi'
import DashboardLayout    from '../components/dashboard/DashboardLayout'
import InvoiceTopBar      from '../components/invoices/InvoiceTopBar'
import BulkExportCard     from '../components/reports/BulkExportCard'
import VerificationReports from '../components/reports/VerificationReports'
import SystemStatus       from '../components/reports/SystemStatus'
import DownloadHistory    from '../components/reports/DownloadHistory'
import Modal              from '../components/common/Modal'
import { createReport }   from '../services/reports'

const ReportsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [open, setOpen]             = useState(false)
  const [form, setForm]             = useState({ name: '', kind: 'verification', format: 'csv' })
  const [busy, setBusy]             = useState(false)

  const refresh = () => setRefreshKey(k => k + 1)

  const handleGenerate = async () => {
    setBusy(true)
    try {
      await createReport({ ...form, status: 'ready', progress: 100, date_range: 'Custom' })
      setOpen(false)
      setForm({ name: '', kind: 'verification', format: 'csv' })
      refresh()
    } finally { setBusy(false) }
  }

  return (
    <DashboardLayout>
        <InvoiceTopBar />

        <main className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-5">

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f] leading-tight">Reporting &amp; Download Center</h1>
                <p className="text-xs text-gray-400 mt-1">Export, generate, and manage your financial compliance documentation.</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={refresh} className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <HiOutlineRefresh className="w-4 h-4" />
                  Refresh Data
                </button>
                <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm">
                  <HiOutlinePlusCircle className="w-4 h-4" />
                  Generate New Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <BulkExportCard      onCreated={refresh} />
              <VerificationReports refreshKey={refreshKey} onChange={refresh} />
              <SystemStatus />
            </div>

            <DownloadHistory refreshKey={refreshKey} />

            <p className="text-[11px] text-gray-400 pb-2">
              © 2026{' '}
              <a href="/" className="text-blue-500 hover:underline">Name</a>
              {' '}All rights reserved.
            </p>

          </div>
        </main>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Generate New Report"
        footer={
          <>
            <button onClick={() => setOpen(false)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleGenerate} disabled={busy || !form.name} className="bg-[#1e3a5f] hover:bg-[#0f2040] disabled:opacity-60 text-white rounded-lg px-3 py-1.5 text-xs font-semibold">
              {busy ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Name</label>
            <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kind</label>
            <select value={form.kind} onChange={(e) => setForm(f => ({ ...f, kind: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="verification">Verification</option>
              <option value="audit">Audit</option>
              <option value="tax-liability">Tax Liability</option>
              <option value="reconciliation">Reconciliation</option>
              <option value="bulk-export">Bulk Export</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Format</label>
            <select value={form.format} onChange={(e) => setForm(f => ({ ...f, format: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="csv">CSV</option>
              <option value="xlsx">XLSX</option>
              <option value="pdf">PDF</option>
              <option value="zip">ZIP</option>
            </select>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default ReportsPage
