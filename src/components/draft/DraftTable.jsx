import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'

const rows = Array(9).fill({
  invoice: 'DFT-2023-0891',
  ntn: '7261543-9 (TechFlow Solutions)',
})

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-3.5'

const DraftTable = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

    {/* Header */}
    <div className="flex items-center justify-between px-6 pt-5 pb-1">
      <div>
        <p className="text-sm font-bold text-[#1e3a5f]">Recent Drafts</p>
        <p className="text-xs text-gray-400 mt-0.5">Recent Drafts</p>
      </div>
      <span className="text-xs font-semibold text-gray-500 tracking-wide">5 ITEMS PENDING</span>
    </div>

    {/* Table */}
    <div className="px-6 pb-5 overflow-x-auto">
      <table className="w-full min-w-[480px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={thClass}>Invoice#</th>
            <th className={thClass}>Recipient NTN</th>
            <th className={thClass}>Status</th>
            <th className={`${thClass} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className={`${tdClass} font-medium text-gray-800`}>{row.invoice}</td>
              <td className={tdClass}>{row.ntn}</td>
              <td className={tdClass}>
                <span className="bg-green-50 text-green-500 text-[11px] font-semibold px-3 py-0.5 rounded-full border border-green-100">
                  AUTO-SAVED
                </span>
              </td>
              <td className={`${tdClass} text-right`}>
                <div className="flex items-center justify-end gap-2">
                  <button className="p-1 text-gray-400 hover:text-[#1e3a5f] transition-colors">
                    <HiOutlinePencil className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-[#1e3a5f] transition-colors">
                    <HiOutlineDocumentDuplicate className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default DraftTable
