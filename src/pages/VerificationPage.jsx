import Sidebar              from '../components/dashboard/Sidebar'
import VerificationTopBar  from '../components/verification/VerificationTopBar'
import VerificationForm    from '../components/verification/VerificationForm'
import VerificationSidecards from '../components/verification/VerificationSidecards'
import VerificationHistory from '../components/verification/VerificationHistory'
import VerificationStats   from '../components/verification/VerificationStats'

const VerificationPage = () => (
  <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">

    <Sidebar />

    <div className="flex-1 flex flex-col min-w-0">
      <VerificationTopBar />

      <main className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-5">

          {/* Page title */}
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f] leading-tight">Invoice Verification</h1>
            <p className="text-xs text-gray-400 mt-1">Verify invoice authenticity through FBR database in real-time</p>
          </div>

          {/* Form + Sidecards */}
          <div className="flex gap-5 items-stretch">
            <VerificationForm />
            <VerificationSidecards />
          </div>

          {/* History table */}
          <VerificationHistory />

          {/* Stats */}
          <VerificationStats />

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

export default VerificationPage
