import { Link } from 'react-router-dom'

/* Monitor mockup with a dark dashboard UI inside */
const DashboardMockup = () => (
  <div className="relative w-full max-w-[460px] ml-auto">
    {/* Monitor bezel */}
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-800">
      {/* Screen top bar */}
      <div className="bg-[#1a2a45] px-3 py-1.5 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        <div className="flex-1 mx-3 bg-[#0f2040] rounded text-[9px] text-slate-500 px-2 py-0.5 text-center">
          taxguard.gov.pk/dashboard
        </div>
      </div>

      {/* Dashboard content */}
      <div className="bg-[#0d1829] flex" style={{ height: '240px' }}>
        {/* Sidebar */}
        <div className="w-[56px] bg-[#0a1520] flex flex-col items-center py-3 gap-3 flex-shrink-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`w-6 h-1.5 rounded ${i === 1 ? 'bg-blue-400' : 'bg-slate-700'}`} />
          ))}
        </div>

        {/* Main area */}
        <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
          {/* Top stat row */}
          <div className="flex gap-2">
            {['#1e3a5f', '#0f2040', '#162a42'].map((bg, i) => (
              <div key={i} className="flex-1 rounded-lg p-2" style={{ background: bg }}>
                <div className="w-8 h-1 bg-slate-600 rounded mb-1" />
                <div className="w-12 h-2 bg-blue-400/60 rounded" />
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div className="flex-1 bg-[#1e3a5f]/40 rounded-lg p-2 relative overflow-hidden">
            <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path
                d="M0,80 C30,65 60,30 90,40 C120,50 150,20 180,25 C210,30 240,50 270,35 L300,30 L300,100 L0,100Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M0,80 C30,65 60,30 90,40 C120,50 150,20 180,25 C210,30 240,50 270,35 L300,30"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Bottom row */}
          <div className="flex gap-2">
            <div className="flex-1 bg-[#1e3a5f]/30 rounded-lg p-2">
              <div className="w-10 h-1.5 bg-slate-600 rounded mb-1" />
              <div className="w-16 h-2 bg-blue-300/50 rounded" />
            </div>
            <div className="flex-1 bg-[#1e3a5f]/30 rounded-lg p-2">
              <div className="w-10 h-1.5 bg-slate-600 rounded mb-1" />
              <div className="w-12 h-2 bg-slate-500/50 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Monitor stand */}
    <div className="flex flex-col items-center mt-0">
      <div className="w-16 h-4 bg-gray-300 rounded-b-lg" />
      <div className="w-28 h-2 bg-gray-300 rounded-full" />
    </div>
  </div>
)

const HeroSection = () => (
  <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 flex items-center gap-12">
    {/* Left */}
    <div className="flex-1 min-w-0">
      <h1 className="text-[2.1rem] font-bold text-[#1e3a5f] leading-[1.2] max-w-sm">
        Secure Integrated Tax Compliance for Enterprise
      </h1>
      <p className="mt-4 text-gray-500 text-[0.95rem] leading-relaxed max-w-md">
        The official gateway for FBR invoice management, verification, and automated
        reporting. Built for institutional trust and seamless government integration.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link
          to="/register"
          className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white text-sm font-semibold
                     px-5 py-2.5 rounded-lg transition-colors"
        >
          Request Demo
        </Link>
        <Link
          to="/login"
          className="border border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f]/5
                     text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Login to Dashboard
        </Link>
      </div>
    </div>

    {/* Right — dashboard mockup */}
    <div className="flex-1 min-w-0">
      <DashboardMockup />
    </div>
  </section>
)

export default HeroSection
