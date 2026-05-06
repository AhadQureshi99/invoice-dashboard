const rows = [
  { date: 'Oct 24, 2023', invoice: 'INV-2023-00981', ntn: '7234912-8', name: 'Global Logistics SolutionsPVT', type: 'Sales Tax', amount: '1,240,500.00', status: 'Verified', st: 'verified' },
  { date: 'Oct 24, 2023', invoice: 'INV-2023-00981', ntn: '7234912-8', name: 'Global Logistics SolutionsPVT', type: 'Sales Tax', amount: '1,240,500.00', status: 'Invalid',  st: 'invalid'  },
  { date: 'Oct 24, 2023', invoice: 'INV-2023-00981', ntn: '7234912-8', name: 'Global Logistics SolutionsPVT', type: 'Sales Tax', amount: '1,240,500.00', status: 'Pending',  st: 'pending'  },
  { date: 'Oct 24, 2023', invoice: 'INV-2023-00981', ntn: '7234912-8', name: 'Global Logistics SolutionsPVT', type: 'Sales Tax', amount: '1,240,500.00', status: 'Verified', st: 'verified' },
  { date: 'Oct 24, 2023', invoice: 'INV-2023-00981', ntn: '7234912-8', name: 'Global Logistics SolutionsPVT', type: 'Sales Tax', amount: '1,240,500.00', status: 'Verified', st: 'verified' },
]

const badgeClass = {
  verified: 'text-green-500',
  invalid:  'text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full',
  pending:  'text-orange-400 bg-orange-50 px-2.5 py-0.5 rounded-full',
}

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-4'

const InvoiceTable = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-6 overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={thClass}>Date</th>
            <th className={thClass}>Invoice #</th>
            <th className={thClass}>Buyer NTN / Name</th>
            <th className={thClass}>Type</th>
            <th className={thClass}>Amount (PKR)</th>
            <th className={thClass}>Status</th>
            <th className={thClass}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className={`${tdClass} text-gray-500`}>{row.date}</td>
              <td className={`${tdClass} font-semibold text-gray-800`}>{row.invoice}</td>
              <td className={tdClass}>
                <p className="text-gray-800 font-medium">{row.ntn}</p>
                <p className="text-xs text-gray-400">{row.name}</p>
              </td>
              <td className={tdClass}>{row.type}</td>
              <td className={`${tdClass} font-medium text-gray-800`}>{row.amount}</td>
              <td className={tdClass}>
                <span className={`text-xs font-semibold ${badgeClass[row.st]}`}>{row.status}</span>
              </td>
              <td className={tdClass}>
                <button className="text-xs font-medium text-gray-400 hover:text-[#1e3a5f] transition-colors">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Table footer */}
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400">Showing 1-50 of 1,248 items</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rows per page:</span>
          <select className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600
                             focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]/20 bg-white">
            <option>50</option>
            <option>25</option>
            <option>100</option>
          </select>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-1">
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
  </div>
)

export default InvoiceTable
