import { LeftPanel, LoginForm, Footer } from '../imports'

const LoginPage = () => (
  <div className="min-h-screen bg-navy-50 flex flex-col">
    {/* Main card — vertically + horizontally centered */}
    <div className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[980px] flex rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <LeftPanel />
        <LoginForm />
      </div>
    </div>

    {/* Footer — full page width, pinned to bottom */}
    <Footer />
  </div>
)

export default LoginPage
