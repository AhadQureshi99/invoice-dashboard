const roles = [
  { title: 'ADMINISTRATOR', color: 'text-[#1e3a5f]', desc: 'Full control over users, settings, and financial records.' },
  { title: 'ACCOUNTANT',    color: 'text-[#1e3a5f]', desc: 'Can create, edit, and verify invoices. No user management.' },
  { title: 'VIEWER',        color: 'text-[#1e3a5f]', desc: 'Read-only access to records for audit purposes.' },
]

const RolesLegend = () => (
  <div className="grid grid-cols-3 gap-4">
    {roles.map(({ title, color, desc }) => (
      <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className={`text-lg font-black tracking-wide mb-2 ${color}`}>{title}</p>
        <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
      </div>
    ))}
  </div>
)

export default RolesLegend
