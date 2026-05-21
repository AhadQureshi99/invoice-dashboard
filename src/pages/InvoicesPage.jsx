import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineFilter, HiOutlinePlusCircle } from 'react-icons/hi'
import DashboardLayout       from '../components/dashboard/DashboardLayout'
import InvoiceTopBar         from '../components/invoices/InvoiceTopBar'
import BulkUploadCard        from '../components/invoices/BulkUploadCard'
import UploadStatusCards     from '../components/invoices/UploadStatusCards'
import ValidationPreviewTable from '../components/invoices/ValidationPreviewTable'
import AdvancedFilters       from '../components/invoices/AdvancedFilters'

const InvoicesPage = () => {
  const navigate = useNavigate()
  const [showFilters, setShowFilters] = useState(false)
  const [filters,     setFilters]     = useState({ status: '', range: '', type: '', min: '', max: '' })
  const [refreshKey,  setRefreshKey]  = useState(0)
  const bump = () => setRefreshKey(k => k + 1)

  return (
    <DashboardLayout>
        <InvoiceTopBar />

        <main className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-5">

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f] leading-tight">Invoice Upload &amp; Validation</h1>
                <p className="text-xs text-gray-400 mt-1">Manage and complete your pending tax filings.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(f => !f)}
                  className={`flex items-center gap-1.5 border rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm ${
                    showFilters ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <HiOutlineFilter className="w-4 h-4" />
                  Filter
                </button>
                <button onClick={() => navigate('/dashboard/draft')} className="flex items-center gap-1.5 bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm">
                  <HiOutlinePlusCircle className="w-4 h-4" />
                  Create New Draft
                </button>
              </div>
            </div>

            {showFilters && <AdvancedFilters onApply={setFilters} />}

            <div className="flex flex-col lg:flex-row gap-5 items-stretch">
              <BulkUploadCard onUploaded={bump} />
              <UploadStatusCards refreshKey={refreshKey} />
            </div>

            <ValidationPreviewTable filters={filters} refreshKey={refreshKey} onChange={bump} />

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

export default InvoicesPage
