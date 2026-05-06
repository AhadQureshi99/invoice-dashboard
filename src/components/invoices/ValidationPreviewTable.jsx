import { HiOutlineFilter, HiOutlineCheck } from 'react-icons/hi'

const rows = [
  { id: 'INV-2023-8902', ntn: '7291034-5',  date: 'Oct 24, 2023', amount: '1,250,000.00', status: 'Ready',         statusType: 'ready',    reason: '—'         },
  { id: 'INV-2023-8902', ntn: 'Missing',     date: '9478791-2',    amount: '1,233,000',    status: 'Missing Field', statusType: 'missing',  reason: 'Edit Row'  },
  { id: 'INV-2023-8902', ntn: '7291034-5',  date: 'Oct 24, 2023', amount: '1,250,000.00', status: 'Ready',         statusType: 'ready',    reason: '—'         },
  { id: 'INV-2023-8902', ntn: 'Missing',     date: '9478791-2',    amount: '1,233,000',    status: 'Duplicate',     statusType: 'duplicate',reason: 'Re-Verify' },
  { id: 'INV-2023-8902', ntn: '7291034-5',  date: 'Oct 24, 2023', amount: '1,250,000.00', status: 'Ready',         statusType: 'ready',    reason: '—'         },
]

const badgeClass = {
  ready:     'bg-green-50 text-green-500',
  missing:   'bg-red-50   text-red-500',
  duplicate: 'bg-blue-100 text-blue-500',
}

const StatusBadge = ({ status, type }) => (
  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badgeClass[type]}`}>{status}</span>
)

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-3.5'

const ValidationPreviewTable = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

    {/* Header */}
    <div className="flex items-start justify-between px-6 pt-5 pb-1">
      <div>
        <p className="text-sm font-bold text-[#1e3a5f]">Pre-upload Validation Preview</p>
        <p className="text-xs text-gray-400 mt-0.5">Pre-upload Validation Preview</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5
                           text-xs text-gray-600 hover:bg-gray-50 transition-colors">
          <HiOutlineFilter className="w-3 h-3" />
          FILTER
        </button>
        <button className="flex items-center gap-1.5 bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-lg px-3 py-1.5
                           text-xs font-semibold transition-colors">
          <HiOutlineCheck className="w-3.5 h-3.5" />
          AUTHORIZE ALL READY
        </button>
      </div>
    </div>

    {/* Table */}
    <div className="px-6 overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={thClass}>Invoice ID</th>
            <th className={thClass}>Recipient NTN</th>
            <th className={thClass}>Date</th>
            <th className={thClass}>Total Amount (PKR)</th>
            <th className={thClass}>Status</th>
            <th className={thClass}>Reason / Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className={`${tdClass} font-medium text-gray-800`}>{row.id}</td>
              <td className={`${tdClass} ${row.ntn === 'Missing' ? 'text-red-500 font-semibold' : ''}`}>{row.ntn}</td>
              <td className={tdClass}>{row.date}</td>
              <td className={tdClass}>{row.amount}</td>
              <td className={tdClass}>
                <StatusBadge status={row.status} type={row.statusType} />
              </td>
              <td className={tdClass}>
                {row.reason === '—' ? (
                  <span className="text-gray-300">—</span>
                ) : (
                  <button className="text-xs font-semibold text-gray-500 hover:text-[#1e3a5f] transition-colors">
                    {row.reason}
                  </button>
                )}
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
            n === 1 ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {n}
        </button>
      ))}
      <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs">›</button>
    </div>
  </div>
)

export default ValidationPreviewTable
