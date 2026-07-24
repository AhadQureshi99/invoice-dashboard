import { useState } from 'react'
import { HiOutlineRefresh, HiOutlinePlusCircle } from 'react-icons/hi'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import PageTopBar      from '../components/common/PageTopBar'
import ProfileDetails  from '../components/settings/ProfileDetails'
import SecurityAccess  from '../components/settings/SecurityAccess'
import PrivacyGuard    from '../components/settings/PrivacyGuard'
import TeamManagement  from '../components/settings/TeamManagement'
import SellerManagement from '../components/settings/SellerManagement'
import ProductCatalog  from '../components/settings/ProductCatalog'
import RolesLegend     from '../components/settings/RolesLegend'

const SettingsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey(k => k + 1)
  return (
    <DashboardLayout>
        <PageTopBar title="FBR Invoice Manager" subtitle="Security & Roles" />

        <main className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-5">

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-[#0e5f4f] leading-tight">Account &amp; Team Governance</h1>
                <p className="text-xs text-gray-400 mt-1">Manage organizational access controls and individual profile compliance.</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={refresh} className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <HiOutlineRefresh className="w-4 h-4" />
                  Refresh Data
                </button>
                <a href="/dashboard/reports" className="flex items-center gap-1.5 bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm">
                  <HiOutlinePlusCircle className="w-4 h-4" />
                  Generate New Report
                </a>
              </div>
            </div>

            <div key={refreshKey} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <ProfileDetails />
              <SecurityAccess />
              <PrivacyGuard />
            </div>

            <SellerManagement key={`sm-${refreshKey}`} />
            <ProductCatalog key={`pc-${refreshKey}`} />
            <TeamManagement key={`tm-${refreshKey}`} />
            <RolesLegend    key={`rl-${refreshKey}`} />

            <p className="text-[11px] text-gray-400 pb-2">
              © 2026{' '}
              <a href="/" className="text-[#0e5f4f] hover:underline">Name</a>
              {' '}All rights reserved.
            </p>

          </div>
        </main>
    </DashboardLayout>
  )
}

export default SettingsPage