import Sidebar              from '../components/dashboard/Sidebar'
import NotificationStats    from '../components/notifications/NotificationStats'
import NotificationTypes    from '../components/notifications/NotificationTypes'
import NotificationList     from '../components/notifications/NotificationList'
import { HiOutlineCheckCircle, HiViewGrid } from 'react-icons/hi'

const NotifTopBar = () => (
  <header className="sticky top-0 z-40 bg-[#f0f4f8] border-b border-[#dce4ef] px-6 py-3 flex items-center gap-4">
    <span className="text-sm font-bold text-[#1e3a5f]">FBR Invoice Manager</span>
    <div className="relative flex-1 max-w-xs">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
        <circle cx="7" cy="7" r="5"/><path d="M12 12l3 3" strokeLinecap="round"/>
      </svg>
      <input
        type="text"
        placeholder="Search Invoices..."
        className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 w-full
                   bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 placeholder:text-gray-300"
      />
    </div>
    <button className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
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

const NotificationsPage = () => (
  <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">

    <Sidebar />

    <div className="flex-1 flex flex-col min-w-0">
      <NotifTopBar />

      <main className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-5">

          {/* Page header */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-black text-[#1e3a5f] leading-tight">Notification Center</h1>
              <p className="text-xs text-gray-400 mt-1 max-w-lg">
                Monitor institutional alerts, batch processing status, and security audit logs for FR-NOT-01/02/03 compliant reporting.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-4 py-2.5
                                 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <HiOutlineCheckCircle className="w-4 h-4" />
                Mark all as read
              </button>
              <button className="border border-gray-300 bg-white rounded-xl p-2.5 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <HiViewGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <NotificationStats />

          {/* Types sidebar + List */}
          <div className="flex gap-4 items-stretch">
            <NotificationTypes />
            <NotificationList />
          </div>

          {/* Footer */}
          <p className="text-[11px] text-gray-400 pb-2">
            © 2026{' '}
            <a href="/" className="text-blue-500 hover:underline">Name</a>
            {' '}All rights reserved.
          </p>

        </div>
      </main>
    </div>

    {/* Floating action button */}
    <button className="fixed bottom-6 right-6 w-12 h-12 bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-2xl
                       flex items-center justify-center shadow-lg transition-colors z-50 text-xl font-light">
      +
    </button>

  </div>
)

export default NotificationsPage
