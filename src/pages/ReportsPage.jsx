import { HiOutlineRefresh, HiOutlinePlusCircle } from 'react-icons/hi'
import Sidebar            from '../components/dashboard/Sidebar'
import InvoiceTopBar      from '../components/invoices/InvoiceTopBar'
import BulkExportCard     from '../components/reports/BulkExportCard'
import VerificationReports from '../components/reports/VerificationReports'
import SystemStatus       from '../components/reports/SystemStatus'
import DownloadHistory    from '../components/reports/DownloadHistory'

const ReportsPage = () => (
  <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">

    <Sidebar />

    <div className="flex-1 flex flex-col min-w-0">
      <InvoiceTopBar />

      <main className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-5">

          {/* Page title */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f] leading-tight">Reporting &amp; Download Center</h1>
              <p className="text-xs text-gray-400 mt-1">Export, generate, and manage your financial compliance documentation.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-4 py-2.5
                                 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <HiOutlineRefresh className="w-4 h-4" />
                Refresh Data
              </button>
              <button className="flex items-center gap-1.5 bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-xl px-4 py-2.5
                                 text-sm font-semibold transition-colors shadow-sm">
                <HiOutlinePlusCircle className="w-4 h-4" />
                Generate New Report
              </button>
            </div>
          </div>

          {/* Top 3 cards */}
          <div className="grid grid-cols-3 gap-5">
            <BulkExportCard />
            <VerificationReports />
            <SystemStatus />
          </div>

          {/* Download history table */}
          <DownloadHistory />

          {/* Footer */}
          <p className="text-[11px] text-gray-400 pb-2">
            © 2026{' '}
            <a href="/" className="text-blue-500 hover:underline">Name</a>
            {' '}All rights reserved.
          </p>

        </div>
      </main>
    </div>
  </div>
)

export default ReportsPage
