import { useEffect, useState } from 'react'
import { listTeam } from '../../services/team'

const roles = [
  { key: 'admin',      title: 'ADMINISTRATOR', desc: 'Full control over users, settings, and financial records.' },
  { key: 'accountant', title: 'ACCOUNTANT',    desc: 'Can create, edit, and verify invoices. No user management.' },
  { key: 'viewer',     title: 'VIEWER',        desc: 'Read-only access to records for audit purposes.' },
]

const RolesLegend = () => {
  const [counts, setCounts] = useState({ admin: 0, accountant: 0, viewer: 0 })

  useEffect(() => {
    listTeam().then((rows) => {
      const c = { admin: 0, accountant: 0, viewer: 0 }
      for (const r of rows || []) if (c[r.role] != null) c[r.role] += 1
      setCounts(c)
    }).catch(() => {})
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {roles.map(({ key, title, desc }) => (
        <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-black tracking-wide text-[#1e3a5f]">{title}</p>
            <span className="text-xs font-bold text-gray-400">{counts[key] || 0} members</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  )
}

export default RolesLegend
