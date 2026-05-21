import { useEffect, useState } from 'react'
import { notificationStats } from '../../services/notifications'

const TYPES = [
  { key: 'batch',        label: 'Batch Results' },
  { key: 'security',     label: 'Security Alerts' },
  { key: 'verification', label: 'Verifications' },
  { key: 'system',       label: 'System' },
]

const NotificationTypes = ({ selected = [], onChange }) => {
  const [counts, setCounts] = useState({ batch: 0, security: 0, verification: 0, system: 0 })

  useEffect(() => {
    notificationStats().then(s => setCounts(s.by_category || {})).catch(() => {})
  }, [])

  const toggle = (key) => {
    const next = selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key]
    onChange?.(next)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:w-40 flex-shrink-0">
      <p className="text-[10px] font-black text-[#0e5f4f] tracking-widest uppercase mb-4">Types</p>
      <div className="flex flex-col gap-3">
        {TYPES.map(({ key, label }) => {
          const on = selected.length === 0 || selected.includes(key)
          return (
            <button key={key} onClick={() => toggle(key)} className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${on ? 'bg-[#0e5f4f]' : 'border border-gray-300'}`}>
                {on && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 4.5-4.5"/>
                  </svg>
                )}
              </div>
              <span className="text-xs text-gray-600 font-medium flex-1 text-left">{label}</span>
              <span className="text-[11px] font-bold text-gray-400">{String(counts[key] || 0).padStart(2, '0')}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default NotificationTypes
