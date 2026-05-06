import { HiOutlineDownload, HiOutlineRefresh } from 'react-icons/hi'

const GreenCheck = () => (
  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l4 4 6-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
)

const ProcessingIcon = () => (
  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="10 8"/>
    </svg>
  </div>
)

const reports = [
  { icon: GreenCheck,     name: 'Audit Compliance 2023',  sub: 'Last updated: 2h ago',   action: 'download' },
  { icon: GreenCheck,     name: 'Tax Liability Summary',  sub: 'Last updated: 1d ago',   action: 'download' },
  { icon: ProcessingIcon, name: 'Annual Reconciliation',  sub: 'Processing... (88%)',     action: 'refresh'  },
]

const VerificationReports = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
    <p className="text-sm font-bold text-[#1e3a5f]">Verification Reports</p>

    <div className="flex flex-col gap-1">
      {reports.map(({ icon: Icon, name, sub, action }) => (
        <div key={name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
          <div className="flex items-center gap-3">
            <Icon />
            <div>
              <p className="text-sm font-semibold text-gray-800">{name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-[#1e3a5f] transition-colors p-1">
            {action === 'download'
              ? <HiOutlineDownload className="w-4 h-4" />
              : <HiOutlineRefresh  className="w-4 h-4" />
            }
          </button>
        </div>
      ))}
    </div>
  </div>
)

export default VerificationReports
