import Sidebar         from '../components/dashboard/Sidebar'
import AuthCard        from '../components/invoicedetail/AuthCard'
import LifecycleCard   from '../components/invoicedetail/LifecycleCard'
import VoidBanner      from '../components/invoicedetail/VoidBanner'
import InvoiceInfoCard from '../components/invoicedetail/InvoiceInfoCard'
import { HiOutlineDocumentText, HiOutlineDocumentDownload, HiOutlineDocumentDuplicate } from 'react-icons/hi'

const InvoiceDetailTopBar = () => (
  <header className="sticky top-0 z-40 bg-[#f0f4f8] border-b border-[#dce4ef] px-6 py-3 flex items-center gap-3">
    <span className="text-sm text-gray-500 font-medium">Invoices:</span>
    <span className="text-sm font-bold text-[#1e3a5f]">FR-LIST-05-8821</span>
    <button className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white text-xs font-semibold
                       px-4 py-2 rounded-lg transition-colors">
      Verify Invoice
    </button>
    <div className="flex-1" />
    <div className="flex items-center gap-1.5 cursor-pointer">
      <span className="text-lg leading-none">🇳🇴</span>
      <span className="text-sm font-medium text-gray-600">EN</span>
    </div>
    <div className="flex items-center gap-2.5 cursor-pointer">
      <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
        <span className="text-[11px] font-bold text-white">RP</span>
      </div>
      <div className="leading-tight">
        <p className="text-xs font-semibold text-gray-800">Robert Patinson</p>
        <p className="text-[10px] text-gray-400">Super Admin</p>
      </div>
    </div>
  </header>
)

const InvoiceDetailPage = () => (
  <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">

    <Sidebar />

    <div className="flex-1 flex flex-col min-w-0">
      <InvoiceDetailTopBar />

      <main className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-5">

          {/* Status bar */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-green-500 text-white text-[11px] font-bold tracking-wide
                                uppercase px-3 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5"/>
                  </svg>
                  Verified
                </div>
              </div>
              <p className="text-[11px] text-gray-400 pl-1">Last Synced: 20 Oct 2023 14:32</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-3.5 py-2
                                 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <HiOutlineDocumentText className="w-3.5 h-3.5" />
                PDF
              </button>
              <button className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-3.5 py-2
                                 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <HiOutlineDocumentDownload className="w-3.5 h-3.5" />
                Excel
              </button>
              <button className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-3.5 py-2
                                 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <HiOutlineDocumentDuplicate className="w-3.5 h-3.5" />
                Duplicate
              </button>
            </div>
          </div>

          {/* Auth + Lifecycle */}
          <div className="flex gap-5 items-stretch">
            {/* Auth card */}
            <div className="w-64 flex-shrink-0">
              <AuthCard />
            </div>

            {/* Lifecycle + Void stacked */}
            <div className="flex-1 flex flex-col gap-4">
              <LifecycleCard />
              <VoidBanner />
            </div>
          </div>

          {/* Invoice info */}
          <InvoiceInfoCard />

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

export default InvoiceDetailPage
