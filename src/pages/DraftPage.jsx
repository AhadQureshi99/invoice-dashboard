import { HiOutlineFilter, HiOutlinePlusCircle } from 'react-icons/hi'
import Sidebar          from '../components/dashboard/Sidebar'
import DraftTopBar      from '../components/draft/DraftTopBar'
import DraftTable       from '../components/draft/DraftTable'
import NewQuickDraft    from '../components/draft/NewQuickDraft'
import DraftBottomCards from '../components/draft/DraftBottomCards'

const DraftPage = () => (
  <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">

    <Sidebar />

    <div className="flex-1 flex flex-col min-w-0">
      <DraftTopBar />

      <main className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-5">

          {/* Page title row */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f] leading-tight">Draft Invoices</h1>
              <p className="text-xs text-gray-400 mt-1">Manage and complete your pending tax filings.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <HiOutlineFilter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-1.5 bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm">
                <HiOutlinePlusCircle className="w-4 h-4" />
                Create New Draft
              </button>
            </div>
          </div>

          {/* Main content: table + quick draft form */}
          <div className="flex gap-5 items-start">
            <div className="flex-[1.6] min-w-0">
              <DraftTable />
            </div>
            <div className="flex-[1] min-w-0">
              <NewQuickDraft />
            </div>
          </div>

          {/* Bottom cards */}
          <DraftBottomCards />

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

export default DraftPage
