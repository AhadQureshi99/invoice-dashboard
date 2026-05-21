import { useEffect, useState } from 'react'
import { getSystemStatus } from '../../services/system'

const ArchiveIcon = () => (
  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1"  y="12" width="3" height="7" rx="1" fill="#818cf8"/>
      <rect x="6"  y="8"  width="3" height="11" rx="1" fill="#f59e0b"/>
      <rect x="11" y="10" width="3" height="9"  rx="1" fill="#818cf8"/>
      <rect x="16" y="5"  width="3" height="14" rx="1" fill="#34d399"/>
    </svg>
  </div>
)
const PurgeIcon = () => (
  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="#f97316" strokeWidth="1.8" fill="none"/>
      <path d="M10 5v5l3 3" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  </div>
)

const SystemStatus = () => {
  const [s, setS] = useState(null)
  useEffect(() => { getSystemStatus().then(setS).catch(() => {}) }, [])

  const used  = Number(s?.archive_used_gb || 0)
  const total = Number(s?.archive_total_gb || 100)
  const pct   = total ? Math.min(100, Math.round((used / total) * 100)) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s?.online ? 'bg-green-500' : 'bg-red-500'}`} />
        <p className="text-sm font-bold text-[#0e5f4f]">
          {s?.online ? 'System Online: All services operational' : 'System Offline'}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-1">
        <div className="border border-gray-100 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <ArchiveIcon />
            <p className="text-sm font-semibold text-gray-800">Archive Capacity: {used.toFixed(1)} GB / {total.toFixed(0)} GB</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div className="bg-[#0e5f4f] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
          <PurgeIcon />
          <p className="text-sm font-semibold text-gray-800 leading-snug">
            Auto-purge enabled for logs older<br />than {s?.auto_purge_days || 365} days
          </p>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus
