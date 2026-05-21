import { HiShieldCheck } from 'react-icons/hi'
import Logo from '../common/Logo'

const DecorativeRings = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
    <div className="w-96 h-96 rounded-full border border-white/[0.08]" />
    <div className="absolute inset-8  rounded-full border border-white/[0.08]" />
    <div className="absolute inset-16 rounded-full border border-white/[0.08]" />
    <div className="absolute inset-24 rounded-full border border-white/[0.08]" />
    <div className="absolute inset-32 rounded-full border border-white/[0.08]" />
  </div>
)

const StatusCard = () => (
  <div className="relative z-10 bg-[#083f33] rounded-xl p-4">
    <div className="flex items-center gap-3 mb-2.5">
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
        <HiShieldCheck className="text-green-500 w-[18px] h-[18px]" />
      </div>
      <span className="text-white text-sm font-medium">System Status: Operational</span>
    </div>
    <p className="text-slate-400 text-xs italic leading-relaxed">
      "Trust through precision. We safeguard your financial data with multi-layered authentication."
    </p>
  </div>
)

const LeftPanel = () => (
  <div className="relative w-[42%] bg-navy-900 p-9 flex flex-col overflow-hidden min-h-[520px]">
    <DecorativeRings />

    {/* Header */}
    <div className="relative z-10 flex flex-col gap-6">
      <Logo />
      <div>
        <h1 className="text-white text-[1.15rem] font-semibold leading-snug">
          Secure Access to Government Tax Portal
        </h1>
        <p className="mt-3 text-slate-400 text-sm leading-relaxed">
          Managing enterprise compliance with official security standards and encrypted
          verification protocols.
        </p>
      </div>
    </div>

    {/* Push status card to bottom */}
    <div className="flex-1" />

    <StatusCard />
  </div>
)

export default LeftPanel
