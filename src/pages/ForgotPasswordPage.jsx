import { LeftPanel, Footer } from '../imports'
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm'

const ForgotPasswordPage = () => (
  <div className="min-h-screen bg-navy-50 flex flex-col">
    <div className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[980px] flex rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="hidden md:flex">
          <LeftPanel />
        </div>
        <ForgotPasswordForm />
      </div>
    </div>

    <Footer />
  </div>
)

export default ForgotPasswordPage
