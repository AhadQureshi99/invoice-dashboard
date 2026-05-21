import { useEffect, useState } from 'react'
import { HiOutlinePencil, HiOutlineMail, HiOutlineClock, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi'
import { listTeam, inviteMember, updateMember, removeMember, resendInvite } from '../../services/team'
import Modal from '../common/Modal'

const initials = (s) => (s || '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '·'

const roleColor = {
  admin:      'bg-[#4eaa88]/25 text-[#0e5f4f]',
  accountant: 'bg-purple-100 text-purple-600',
  viewer:     'bg-gray-100 text-gray-600',
}
const statusColor = { active: 'text-green-500', pending: 'text-orange-400', disabled: 'text-gray-400' }

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'
const tdClass = 'text-sm text-gray-600 py-3'

const TeamManagement = () => {
  const [rows,    setRows]   = useState([])
  const [search,  setSearch] = useState('')
  const [role,    setRole]   = useState('')
  const [open,    setOpen]   = useState(false)
  const [form,    setForm]   = useState({ name: '', email: '', role: 'viewer' })
  const [editing, setEditing] = useState(null)
  const [busy,    setBusy]   = useState(false)

  const load = () => listTeam({ search, role }).then(setRows).catch(() => {})
  useEffect(load, [search, role])

  const handleInvite = async () => {
    if (!form.name || !form.email) return
    setBusy(true)
    try { await inviteMember(form); setOpen(false); setForm({ name: '', email: '', role: 'viewer' }); load() }
    finally { setBusy(false) }
  }

  const saveEdit = async () => {
    await updateMember(editing.id, { name: editing.name, role: editing.role, status: editing.status })
    setEditing(null); load()
  }

  const handleRemove = async (id) => {
    if (!confirm('Remove this member?')) return
    await removeMember(id); load()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4 flex-wrap border-b border-gray-50">
        <div>
          <p className="text-sm font-bold text-[#0e5f4f]">Team Management</p>
          <p className="text-xs text-gray-400 mt-0.5">Authorize and manage roles for organization members.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
              <circle cx="7" cy="7" r="5"/><path d="M12 12l3 3" strokeLinecap="round"/>
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..." className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 w-44 focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Filter by Role:</span>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20">
              <option value="">All Members</option>
              <option value="admin">Admin</option>
              <option value="accountant">Accountant</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap">
            <HiOutlinePlus className="w-3.5 h-3.5" />
            ADD MEMBER
          </button>
        </div>
      </div>

      <div className="px-6 overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className={thClass}>Member</th>
              <th className={thClass}>Email</th>
              <th className={thClass}>Role</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="text-center py-6 text-xs text-gray-400">No team members yet — invite your first one.</td></tr>}
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-gray-50 last:border-0">
                <td className={`${tdClass} font-medium text-gray-800`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#0e5f4f] flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-white">{initials(m.name)}</span>
                    </div>
                    {m.name}
                  </div>
                </td>
                <td className={`${tdClass} text-gray-500`}>{m.email}</td>
                <td className={tdClass}>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${roleColor[m.role] || roleColor.viewer}`}>{m.role.toUpperCase()}</span>
                </td>
                <td className={tdClass}>
                  <span className={`text-xs font-semibold flex items-center gap-1 ${statusColor[m.status]}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                    {m.status}
                  </span>
                </td>
                <td className={tdClass}>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setEditing({ ...m })} className="p-1 text-gray-400 hover:text-[#0e5f4f] transition-colors" title="Edit">
                      <HiOutlinePencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => resendInvite(m.id).then(load)} className="p-1 text-gray-400 hover:text-[#0e5f4f] transition-colors" title="Resend invite">
                      {m.status === 'pending' ? <HiOutlineMail className="w-3.5 h-3.5" /> : <HiOutlineClock className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleRemove(m.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                      <HiOutlineTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invite Team Member"
        footer={
          <>
            <button onClick={() => setOpen(false)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleInvite} disabled={busy} className="bg-[#0e5f4f] hover:bg-[#083f33] disabled:opacity-60 text-white rounded-lg px-3 py-1.5 text-xs font-semibold">
              {busy ? 'Inviting…' : 'Send Invite'}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <input value={form.name}  onChange={(e) => setForm(f => ({ ...f, name:  e.target.value }))} placeholder="Full name"     className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <input value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@org.pk"  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <select value={form.role} onChange={(e) => setForm(f => ({ ...f, role:  e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="admin">Admin</option>
            <option value="accountant">Accountant</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Member"
        footer={
          <>
            <button onClick={() => setEditing(null)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={saveEdit} className="bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-lg px-3 py-1.5 text-xs font-semibold">Save</button>
          </>
        }
      >
        {editing && (
          <div className="flex flex-col gap-3">
            <input value={editing.name} onChange={(e) => setEditing(s => ({ ...s, name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <select value={editing.role} onChange={(e) => setEditing(s => ({ ...s, role: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="admin">Admin</option>
              <option value="accountant">Accountant</option>
              <option value="viewer">Viewer</option>
            </select>
            <select value={editing.status} onChange={(e) => setEditing(s => ({ ...s, status: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TeamManagement