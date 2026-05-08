import { RegisterLeftPanel, RegisterForm, Footer, ServiceStatusBadge } from '../imports'

const RegisterPage = () => (
  <div className="min-h-screen bg-navy-50 flex flex-col">
    {/* Main card */}
    <div className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[980px] flex rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="hidden md:flex">
          <RegisterLeftPanel />
        </div>
        <RegisterForm />
      </div>
    </div>

    {/* Footer — full width */}
    <Footer />

    {/* Floating status badge */}
    <ServiceStatusBadge />
  </div>
)

export default RegisterPage

