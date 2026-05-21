import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import VerificationTopBar  from '../components/verification/VerificationTopBar'
import VerificationForm    from '../components/verification/VerificationForm'
import VerificationSidecards from '../components/verification/VerificationSidecards'
import VerificationHistory from '../components/verification/VerificationHistory'
import VerificationStats   from '../components/verification/VerificationStats'

const VerificationPage = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <DashboardLayout>
        <VerificationTopBar />

        <main className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-5">

            <div>
              <h1 className="text-2xl font-bold text-[#0e5f4f] leading-tight">Invoice Verification</h1>
              <p className="text-xs text-gray-400 mt-1">Verify invoice authenticity through FBR database in real-time</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-5 items-stretch">
              <VerificationForm onResult={() => setRefreshKey(k => k + 1)} />
              <VerificationSidecards />
            </div>

            <VerificationHistory refreshKey={refreshKey} />
            <VerificationStats   refreshKey={refreshKey} />

            <p className="text-[11px] text-gray-400 pb-2">
              Â© 2026{' '}
              <a href="/" className="text-[#0e5f4f] hover:underline">Name</a>
              {' '}All rights reserved.
            </p>

          </div>
        </main>
    </DashboardLayout>
  )
}

export default VerificationPage