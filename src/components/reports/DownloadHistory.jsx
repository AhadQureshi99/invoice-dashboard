const formats = ['ZIP', 'CSV', 'ZIP', 'ZIP', 'ZIP']
const fmtColor = { ZIP: 'text-blue-500', CSV: 'text-green-500' }

const rows = formats.map((fmt, i) => ({
  name: 'Q2_Sales_Invoices_Bulk.zip',
  timestamp: 'Oct 24, 2023 | 09:42 AM',
  user: 'Arslan Malik',
  format: fmt,
  key: i,
}))

/* Excel / PDF icon buttons */
const ExcelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect width="14" height="14" rx="2" fill="#1D6F42"/>
    <text x="2" y="11" fontSize="8" fontWeight="bold" fill="white">X</text>
  </svg>
)
const PdfIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect width="14" height="14" rx="2" fill="#E5251A"/>
    <text x="1" y="11" fontSize="6.5" fontWeight="bold" fill="white">PDF</text>
  </svg>
)

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-3.5'

const DownloadHistory = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

    {/* Header */}
    <div className="flex items-start justify-between px-6 pt-5 pb-1">
      <div>
        <p className="text-sm font-bold text-[#1e3a5f]">Recent Download History</p>
        <p className="text-xs text-gray-400 mt-0.5">Recent Download History</p>
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
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={thClass}>Document Name</th>
            <th className={thClass}>Timestamp</th>
            <th className={thClass}>User</th>
            <th className={thClass}>Format</th>
            <th className={thClass}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-gray-50 last:border-0">
              <td className={`${tdClass} font-medium text-gray-800`}>{row.name}</td>
              <td className={`${tdClass} text-gray-500`}>{row.timestamp}</td>
              <td className={tdClass}>{row.user}</td>
              <td className={tdClass}>
                <span className={`text-xs font-bold ${fmtColor[row.format]}`}>{row.format}</span>
              </td>
              <td className={tdClass}>
                <button className="text-xs font-semibold text-gray-500 hover:text-[#1e3a5f] transition-colors">
                  Re-download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
      <span className="text-xs text-gray-400">Showing 1-15 of 284 logs</span>
      <div className="flex items-center gap-1">
        <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs">‹</button>
        {[1,2,3,4,5].map(n => (
          <button key={n}
            className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
              n === 1 ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}>
            {n}
          </button>
        ))}
        <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs">›</button>
      </div>
    </div>
  </div>
)

export default DownloadHistory
