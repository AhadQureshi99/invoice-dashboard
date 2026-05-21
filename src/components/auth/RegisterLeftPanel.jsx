import { HiLockClosed } from 'react-icons/hi'
import { HiGlobeAlt } from 'react-icons/hi2'
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

const BadgeRow = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 bg-[#083f33] rounded-lg px-4 py-3">
    <Icon className="text-slate-400 w-[15px] h-[15px] flex-shrink-0" />
    <span className="text-slate-300 text-xs">{text}</span>
  </div>
)

const RegisterLeftPanel = () => (
  <div className="relative w-[42%] bg-navy-900 p-9 flex flex-col overflow-hidden min-h-[580px]">
    <DecorativeRings />

    {/* Header */}
    <div className="relative z-10 flex flex-col gap-6">
      <Logo />
      <div>
        <h1 className="text-white text-[1.15rem] font-semibold leading-snug">
          Secure Integrated Compliance
        </h1>
        <p className="mt-3 text-slate-400 text-sm leading-relaxed">
          Access the official FBR Invoice Management gateway. Our platform ensures
          state-level encryption for all institutional tax filing and verification
          processes.
        </p>
      </div>
    </div>

    {/* Push badges to bottom */}
    <div className="flex-1" />

    <div className="relative z-10 flex flex-col gap-2">
      <BadgeRow icon={HiLockClosed} text="ISO 27001 Certified Infrastructure" />
      <BadgeRow icon={HiGlobeAlt}   text="Data Sovereignty Compliant" />
    </div>
  </div>
)

export default RegisterLeftPanel
