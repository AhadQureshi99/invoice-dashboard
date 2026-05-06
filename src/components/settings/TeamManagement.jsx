import { HiOutlinePencil, HiOutlineMail, HiOutlineClock, HiOutlineTrash } from 'react-icons/hi'

const members = [
  { name: 'Zinab Ahmed', email: 'z.ahmed@fbr-portal.pk', role: 'ADMIN',       roleColor: 'bg-blue-100 text-blue-600',   status: 'ACTIVE',         statusColor: 'text-green-500',  actions: ['edit', 'clock'] },
  { name: 'Zinab Ahmed', email: 'z.ahmed@fbr-portal.pk', role: 'ACCOUNTANT',  roleColor: 'bg-purple-100 text-purple-600', status: 'ACTIVE',       statusColor: 'text-green-500',  actions: ['edit', 'clock'] },
  { name: 'Zinab Ahmed', email: 'z.ahmed@fbr-portal.pk', role: 'ADMIN',       roleColor: 'bg-blue-100 text-blue-600',   status: 'ACTIVE',         statusColor: 'text-green-500',  actions: ['edit', 'clock'] },
  { name: 'Zinab Ahmed', email: 'z.ahmed@fbr-portal.pk', role: 'VIEWER',      roleColor: 'bg-gray-100 text-gray-600',   status: 'Pending Invite', statusColor: 'text-orange-400', actions: ['mail', 'trash'] },
  { name: 'Zinab Ahmed', email: 'z.ahmed@fbr-portal.pk', role: 'ADMIN',       roleColor: 'bg-blue-100 text-blue-600',   status: 'ACTIVE',         statusColor: 'text-green-500',  actions: ['edit', 'clock'] },
]

const actionIcons = {
  edit:  HiOutlinePencil,
  clock: HiOutlineClock,
  mail:  HiOutlineMail,
  trash: HiOutlineTrash,
}

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-3'

const TeamManagement = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

    {/* Header */}
    <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4 flex-wrap border-b border-gray-50">
      <div>
        <p className="text-sm font-bold text-[#1e3a5f]">Team Management</p>
        <p className="text-xs text-gray-400 mt-0.5">Authorize and manage roles for organization members.</p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
            <circle cx="7" cy="7" r="5"/><path d="M12 12l3 3" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search members..."
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 w-44
                       focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]
                       placeholder:text-gray-300"
          />
        </div>
        {/* Filter by role */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Filter by Role:</span>
          <select className="border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-600 bg-white
                             focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20">
            <option>All Members</option>
            <option>Admin</option>
            <option>Accountant</option>
            <option>Viewer</option>
          </select>
        </div>
        {/* Add member */}
        <button className="flex items-center gap-1.5 bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-lg px-3.5 py-2
                           text-xs font-semibold transition-colors whitespace-nowrap">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M9 7v4M7 9h4M5.5 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1 12c0-2 2-3.5 4.5-3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          ADD MEMBER
        </button>
      </div>
    </div>

    {/* Table */}
    <div className="px-6 overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={thClass}>Member</th>
            <th className={thClass}>Email Address</th>
            <th className={thClass}>Assigned Role</th>
            <th className={thClass}>Status</th>
            <th className={thClass}>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className={`${tdClass} font-medium text-gray-800`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-white">ZA</span>
                  </div>
                  {m.name}
                </div>
              </td>
              <td className={`${tdClass} text-gray-500`}>{m.email}</td>
              <td className={tdClass}>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${m.roleColor}`}>{m.role}</span>
              </td>
              <td className={tdClass}>
                <span className={`text-xs font-semibold flex items-center gap-1 ${m.statusColor}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                  {m.status}
                </span>
              </td>
              <td className={tdClass}>
                <div className="flex items-center gap-1.5">
                  {m.actions.map(a => {
                    const Icon = actionIcons[a]
                    return (
                      <button key={a} className="p-1 text-gray-400 hover:text-[#1e3a5f] transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    )
                  })}
                </div>
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

export default TeamManagement
