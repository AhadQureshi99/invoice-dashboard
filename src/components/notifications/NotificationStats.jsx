const stats = [
  {
    icon: (
      <svg viewBox="0 0 36 36" className="w-9 h-9">
        <circle cx="18" cy="18" r="18" fill="#fef9c3"/>
        <text x="18" y="23" textAnchor="middle" fontSize="18">🏆</text>
      </svg>
    ),
    value: '99.4% Successful',
    label: 'VERIFICATION RATE',
  },
  {
    icon: (
      <svg viewBox="0 0 36 36" className="w-9 h-9">
        <circle cx="18" cy="18" r="18" fill="#dbeafe"/>
        <text x="18" y="23" textAnchor="middle" fontSize="16">⚡</text>
      </svg>
    ),
    value: '1.2s Per Invoice',
    label: 'AVG. PROCESSING TIME',
  },
  {
    icon: (
      <div className="relative w-9 h-9">
        <svg viewBox="0 0 36 36" className="w-9 h-9">
          <circle cx="18" cy="18" r="18" fill="#fef9c3"/>
          <text x="18" y="23" textAnchor="middle" fontSize="16">🔔</text>
        </svg>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[8px] text-white font-bold flex items-center justify-center">2</span>
      </div>
    ),
    value: '02 Priority One',
    label: 'ACTIVE ALERTS',
  },
]

const NotificationStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {stats.map(({ icon, value, label }, i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <p className="text-lg font-black text-gray-800 leading-tight">{value}</p>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">{label}</p>
        </div>
      </div>
    ))}
  </div>
)

export default NotificationStats
