import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSystemStatus } from '../../services/system'

const SystemSecurity = () => {
  const [s, setS] = useState(null)

  useEffect(() => {
    getSystemStatus().then(setS).catch(() => {})
  }, [])

  const used  = Number(s?.archive_used_gb || 0)
  const total = Number(s?.archive_total_gb || 100)
  const pct   = Math.min(100, Math.round((used / total) * 100))

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-[#0e5f4f]">System Security</p>
        {s?.online
          ? <span className="text-[10px] font-semibold text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />ONLINE</span>
          : <span className="text-[10px] font-semibold text-red-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full" />OFFLINE</span>}
      </div>
      <p className="text-xs text-gray-500 leading-relaxed mb-3">
        All API endpoints are operating. Archive usage: <span className="font-semibold text-gray-700">{used.toFixed(1)} / {total.toFixed(0)} GB</span>.
      </p>
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
        <div className="bg-[#0e5f4f] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <Link to="/dashboard/settings" className="text-xs font-bold text-[#0e5f4f] underline hover:text-[#083f33] transition-colors">
        View Security Settings
      </Link>
    </div>
  )
}

export default SystemSecurity
