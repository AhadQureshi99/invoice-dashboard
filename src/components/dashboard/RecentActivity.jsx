const rows = [
  { action: 'Invoice Verification', subject: '#12345',            status: 'Verified',    type: 'verified', time: 'Today, 10:42 AM', operator: 'System Auto' },
  { action: 'Invoice Verification', subject: 'Oct_Batch_Final.csv',status: 'Success',    type: 'success',  time: 'Today, 10:42 AM', operator: 'Ahmed Khan'  },
  { action: 'Invoice Verification', subject: '#12345',            status: 'Invalid TIN', type: 'invalid',  time: 'Today, 10:42 AM', operator: 'System Auto' },
  { action: 'Invoice Verification', subject: '#12345',            status: 'Saved',       type: 'saved',    time: 'Today, 10:42 AM', operator: 'System Auto' },
  { action: 'Invoice Verification', subject: '#12345',            status: 'Updated',     type: 'updated',  time: 'Today, 10:42 AM', operator: 'System Auto' },
]

const badgeClass = {
  verified: 'text-green-500 font-semibold',
  success:  'bg-green-100  text-green-700  text-[11px] font-semibold px-2.5 py-0.5 rounded-full',
  invalid:  'bg-red-100    text-red-500   text-[11px] font-semibold px-2.5 py-0.5 rounded-full',
  saved:    'bg-gray-100   text-gray-600   text-[11px] font-semibold px-2.5 py-0.5 rounded-full',
  updated:  'bg-blue-100   text-blue-700   text-[11px] font-semibold px-2.5 py-0.5 rounded-full',
}

const StatusBadge = ({ status, type }) => (
  <span className={`text-xs ${badgeClass[type]}`}>{status}</span>
)

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-3.5'

const RecentActivity = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    {/* Header */}
    <div className="flex items-start justify-between px-6 pt-5 pb-1">
      <div>
        <p className="text-sm font-bold text-[#1e3a5f]">Recent Activity</p>
        <p className="text-xs text-gray-400 mt-0.5">Recent Activity</p>
      </div>
      <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600
                         hover:bg-gray-50 transition-colors whitespace-nowrap">
        View Audit Trend
      </button>
    </div>

    {/* Table */}
    <div className="px-6 pb-5 overflow-x-auto">
      <table className="w-full min-w-[620px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={thClass}>Action</th>
            <th className={thClass}>Subject</th>
            <th className={thClass}>Status</th>
            <th className={thClass}>Timestamp</th>
            <th className={thClass}>Operator</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className={tdClass}>{row.action}</td>
              <td className={`${tdClass} text-gray-800`}>{row.subject}</td>
              <td className={tdClass}>
                <StatusBadge status={row.status} type={row.type} />
              </td>
              <td className={`${tdClass} text-gray-400`}>{row.time}</td>
              <td className={`${tdClass} font-semibold text-gray-800`}>{row.operator}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default RecentActivity
