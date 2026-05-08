import {
  HiOutlineChartBar,
  HiOutlineCloud,
  HiOutlineUsers,
  HiOutlineDocumentText,
} from 'react-icons/hi'

const tiles = [
  { icon: HiOutlineChartBar,    label: 'Live Reporting',   wide: false },
  { icon: HiOutlineCloud,       label: 'Cloud Storage',    wide: false },
  { icon: HiOutlineUsers,       label: 'Multi-User Access',wide: false },
  { icon: HiOutlineDocumentText,label: 'Auto-Drafting',    wide: false },
]

const FeatureTile = ({ icon: Icon, label }) => (
  <div className="bg-[#1e3a5f] rounded-xl px-5 py-4 flex items-center gap-3">
    <Icon className="text-slate-300 w-5 h-5 flex-shrink-0" />
    <span className="text-white text-sm font-medium">{label}</span>
  </div>
)

const WhySection = () => (
  <section className="w-full bg-[#0f2040] py-16">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 md:gap-16">

      {/* Left */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
          Why TaxGuard?
        </p>
        <h2 className="text-white text-[2rem] font-bold leading-tight max-w-xs">
          Eliminate Manual Filing Errors
        </h2>
        <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-sm">
          Our automated reconciliation engine matches your ledger with FBR records in
          seconds, reducing audit risks by 99.4%.
        </p>

        {/* Stats */}
        <div className="mt-10 flex items-center gap-12">
          <div>
            <p className="text-white text-4xl font-bold">100M+</p>
            <p className="text-slate-400 text-sm mt-1">Invoices Processed</p>
          </div>
          <div>
            <p className="text-white text-4xl font-bold">99.9%</p>
            <p className="text-slate-400 text-sm mt-1">Uptime Reliability</p>
          </div>
        </div>
      </div>

      {/* Right — 2x2 tile grid */}
      <div className="flex-1 grid grid-cols-2 gap-3 min-w-0">
        {tiles.map((t) => (
          <FeatureTile key={t.label} {...t} />
        ))}
      </div>
    </div>
  </section>
)

export default WhySection
