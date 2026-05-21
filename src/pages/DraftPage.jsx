import { useState } from 'react'
import { HiOutlineFilter, HiOutlinePlusCircle } from 'react-icons/hi'
import DashboardLayout  from '../components/dashboard/DashboardLayout'
import DraftTopBar      from '../components/draft/DraftTopBar'
import DraftTable       from '../components/draft/DraftTable'
import NewQuickDraft    from '../components/draft/NewQuickDraft'
import DraftBottomCards from '../components/draft/DraftBottomCards'

const DraftPage = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [showQuick,  setShowQuick]  = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const refresh = () => setRefreshKey(k => k + 1)

  return (
    <DashboardLayout>
        <DraftTopBar />

        <main className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-5">

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f] leading-tight">Draft Invoices</h1>
                <p className="text-xs text-gray-400 mt-1">Manage and complete your pending tax filings.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilterOpen(o => !o)}
                  className={`flex items-center gap-1.5 border rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm ${
                    filterOpen ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <HiOutlineFilter className="w-4 h-4" />
                  Filter
                </button>
                <button
                  onClick={() => setShowQuick(s => !s)}
                  className="flex items-center gap-1.5 bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm"
                >
                  <HiOutlinePlusCircle className="w-4 h-4" />
                  {showQuick ? 'Hide Draft Form' : 'Create New Draft'}
                </button>
              </div>
            </div>

            {filterOpen && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-3 flex-wrap">
                <label className="text-xs font-semibold text-gray-600">Status:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white">
                  <option value="">All</option>
                  <option value="auto-saved">Auto-saved</option>
                  <option value="ready">Ready</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-5 items-start">
              <div className="flex-[1.6] min-w-0">
                <DraftTable refreshKey={refreshKey} statusFilter={statusFilter} onChange={refresh} />
              </div>
              {showQuick && (
                <div className="flex-[1] min-w-0">
                  <NewQuickDraft onSaved={refresh} />
                </div>
              )}
            </div>

            <DraftBottomCards refreshKey={refreshKey} />

            <p className="text-[11px] text-gray-400 pb-2">
              © 2026{' '}
              <a href="/" className="text-blue-500 hover:underline">Name</a>
              {' '}All rights reserved.
            </p>

          </div>
        </main>
    </DashboardLayout>
  )
}

export default DraftPage
