import { useEffect, useState } from 'react'
import { notificationStats } from '../../services/notifications'

const NotificationStats = () => {
  const [s, setS] = useState({ total: 0, unread: 0, archived: 0, critical: 0 })

  useEffect(() => {
    notificationStats().then(setS).catch(() => {})
  }, [])

  const cards = [
    {
      icon: (
        <svg viewBox="0 0 36 36" className="w-9 h-9">
          <circle cx="18" cy="18" r="18" fill="#fef9c3"/>
          <text x="18" y="23" textAnchor="middle" fontSize="18">🏆</text>
        </svg>
      ),
      value: `${s.total - s.critical} / ${s.total || 0}`,
      label: 'NON-CRITICAL / TOTAL',
    },
    {
      icon: (
        <svg viewBox="0 0 36 36" className="w-9 h-9">
          <circle cx="18" cy="18" r="18" fill="#dbeafe"/>
          <text x="18" y="23" textAnchor="middle" fontSize="16">⚡</text>
        </svg>
      ),
      value: `${s.archived}`,
      label: 'ARCHIVED ALERTS',
    },
    {
      icon: (
        <div className="relative w-9 h-9">
          <svg viewBox="0 0 36 36" className="w-9 h-9">
            <circle cx="18" cy="18" r="18" fill="#fef9c3"/>
            <text x="18" y="23" textAnchor="middle" fontSize="16">🔔</text>
          </svg>
          {s.critical > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white font-bold flex items-center justify-center">{s.critical}</span>
          )}
        </div>
      ),
      value: `${String(s.critical).padStart(2, '0')} Critical`,
      label: 'ACTIVE ALERTS',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map(({ icon, value, label }, i) => (
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
}

export default NotificationStats
