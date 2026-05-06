import { HiOutlineRefresh, HiOutlinePlusCircle } from 'react-icons/hi'
import Sidebar         from '../components/dashboard/Sidebar'
import InvoiceTopBar   from '../components/invoices/InvoiceTopBar'
import ProfileDetails  from '../components/settings/ProfileDetails'
import SecurityAccess  from '../components/settings/SecurityAccess'
import PrivacyGuard    from '../components/settings/PrivacyGuard'
import TeamManagement  from '../components/settings/TeamManagement'
import RolesLegend     from '../components/settings/RolesLegend'

const SettingsTopBar = () => (
  <header className="sticky top-0 z-40 bg-[#f0f4f8] border-b border-[#dce4ef] px-6 py-3 flex items-center gap-4">
    <span className="text-sm font-bold text-[#1e3a5f]">FBR Invoice Manager</span>
    <span className="text-gray-300 text-sm">|</span>
    <span className="text-sm text-gray-500">Security &amp; Roles</span>
    <button className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white text-xs font-semibold
                       px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
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

const SettingsPage = () => (
  <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">

    <Sidebar />

    <div className="flex-1 flex flex-col min-w-0">
      <SettingsTopBar />

      <main className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-5">

          {/* Page title */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f] leading-tight">Account &amp; Team Governance</h1>
              <p className="text-xs text-gray-400 mt-1">Manage organizational access controls and individual profile compliance.</p>
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

          {/* Profile + Security + Privacy row */}
          <div className="grid grid-cols-3 gap-5">
            <ProfileDetails />
            <SecurityAccess />
            <PrivacyGuard />
          </div>

          {/* Team management table */}
          <TeamManagement />

          {/* Roles legend */}
          <RolesLegend />

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

export default SettingsPage
