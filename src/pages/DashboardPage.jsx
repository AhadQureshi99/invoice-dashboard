import Sidebar        from '../components/dashboard/Sidebar'
import TopBar         from '../components/dashboard/TopBar'
import StatCards      from '../components/dashboard/StatCards'
import InvoiceChart   from '../components/dashboard/InvoiceChart'
import QuickActions   from '../components/dashboard/QuickActions'
import SystemSecurity from '../components/dashboard/SystemSecurity'
import RecentActivity from '../components/dashboard/RecentActivity'

const DashboardPage = () => (
  <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">

    <Sidebar />

    {/* Main */}
    <div className="flex-1 flex flex-col min-w-0">
      <TopBar />

      <main className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-5">

        {/* Page title */}
        <div>
          <h1 className="text-[1.5rem] font-bold text-[#1e3a5f] leading-tight">
            Operational Overview
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Last updated: Oct 24, 2023 | 10:45 AM
          </p>
        </div>

        {/* Stat cards row */}
        <StatCards />

        {/* Chart + Right panel */}
        <div className="flex gap-5 items-start">
          <div className="flex-[1.75] min-w-0">
            <InvoiceChart />
          </div>
          <div className="flex-[1] min-w-0 flex flex-col gap-4">
            <QuickActions />
            <SystemSecurity />
          </div>
        </div>

        {/* Recent activity */}
        <RecentActivity />

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-400 pb-2">
          © 2026{' '}
          <a href="/" className="text-blue-500 hover:underline">Name</a>
          {' '}All rights reserved.
        </p>
        </div>{/* end flex col gap-5 */}
      </main>
    </div>
  </div>
)

export default DashboardPage
