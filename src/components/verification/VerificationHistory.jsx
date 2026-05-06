const rows = [
  { date: '24 Oct 2023, 11:20 AM', invoice: 'INV-9478791', seller: '9478791-2', amount: '1,233,000', status: 'Verified',   type: 'verified'   },
  { date: '24 Oct 2023, 11:20 AM', invoice: 'INV-9478791', seller: '9478791-2', amount: '1,233,000', status: 'Invalid',    type: 'invalid'    },
  { date: '24 Oct 2023, 11:20 AM', invoice: 'INV-9478791', seller: '9478791-2', amount: '1,233,000', status: 'Verified',   type: 'verified'   },
  { date: '24 Oct 2023, 11:20 AM', invoice: 'INV-9478791', seller: '9478791-2', amount: '1,233,000', status: 'Duplicate',  type: 'duplicate'  },
  { date: '24 Oct 2023, 11:20 AM', invoice: 'INV-9478791', seller: '9478791-2', amount: '1,233,000', status: 'Verified',   type: 'verified'   },
]

const badgeClass = {
  verified:  'bg-green-50  text-green-600',
  invalid:   'bg-red-50    text-red-500',
  duplicate: 'bg-orange-100 text-orange-500',
}

const StatusBadge = ({ status, type }) => (
  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badgeClass[type]}`}>
    {status}
  </span>
)

/* Excel / PDF icons */
const ExcelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect width="14" height="14" rx="2" fill="#1D6F42" />
    <text x="2" y="11" fontSize="8" fontWeight="bold" fill="white">X</text>
  </svg>
)
const PdfIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect width="14" height="14" rx="2" fill="#E5251A" />
    <text x="1" y="11" fontSize="6.5" fontWeight="bold" fill="white">PDF</text>
  </svg>
)

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-3.5'

const VerificationHistory = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

    {/* Header */}
    <div className="flex items-start justify-between px-6 pt-5 pb-1">
      <div>
        <p className="text-sm font-bold text-[#1e3a5f]">Verification History</p>
        <p className="text-xs text-gray-400 mt-0.5">Overview of recent status checks and verification results.</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5
                           text-xs text-gray-600 hover:bg-gray-50 transition-colors">
          <ExcelIcon /> Excel
        </button>
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5
                           text-xs text-gray-600 hover:bg-gray-50 transition-colors">
          <PdfIcon /> PDF
        </button>
      </div>
    </div>

    {/* Table */}
    <div className="px-6 overflow-x-auto">
      <table className="w-full min-w-[680px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={thClass}>Date &amp; Time</th>
            <th className={thClass}>Invoice No.</th>
            <th className={thClass}>Seller NTS</th>
            <th className={thClass}>Amount PKR</th>
            <th className={thClass}>Status</th>
            <th className={thClass}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className={`${tdClass} text-gray-500`}>{row.date}</td>
              <td className={`${tdClass} text-gray-800 font-medium`}>{row.invoice}</td>
              <td className={tdClass}>{row.seller}</td>
              <td className={tdClass}>{row.amount}</td>
              <td className={tdClass}>
                <StatusBadge status={row.status} type={row.type} />
              </td>
              <td className={tdClass}>
                <button className="text-xs font-medium text-gray-500 hover:text-[#1e3a5f] transition-colors">
                  View Log
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div className="flex items-center justify-end gap-1 px-6 py-4">
      <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs">‹</button>
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
            n === 1
              ? 'bg-[#1e3a5f] text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {n}
        </button>
      ))}
      <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs">›</button>
    </div>
  </div>
)

export default VerificationHistory
