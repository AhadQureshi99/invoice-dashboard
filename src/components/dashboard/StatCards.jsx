import { useEffect, useState } from 'react'
import { getStats } from '../../services/invoices'

const Sparkline = ({ id, linePath, areaExtra, color }) => (
  <svg viewBox="0 0 90 38" className="w-[86px] h-[38px]" fill="none">
    <defs>
      <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor={color} stopOpacity="0.35" />
        <stop offset="100%" stopColor={color} stopOpacity="0"    />
      </linearGradient>
    </defs>
    <path d={`${linePath} ${areaExtra}`} fill={`url(#sg-${id})`} />
    <path d={linePath} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const baseStats = [
  { id: 'total',    key: 'total',    label: 'Total Invoices',     changeColor: 'text-orange-500', sparkColor: '#f97316', linePath: 'M0,32 C8,30 14,24 24,20 C34,16 40,22 50,17 C60,12 68,9 78,5 C82,4 85,3 90,2', areaExtra: 'L90,38 L0,38 Z' },
  { id: 'verified', key: 'verified', label: 'Verified',           changeColor: 'text-green-500',  sparkColor: '#22c55e', linePath: 'M0,34 C10,30 18,32 28,26 C38,20 46,16 58,11 C68,7 78,5 90,3',                  areaExtra: 'L90,38 L0,38 Z' },
  { id: 'pending',  key: 'pending',  label: 'Pending Drafts',     changeColor: 'text-yellow-500', sparkColor: '#f59e0b', linePath: 'M0,28 C12,26 22,24 34,25 C46,26 54,22 64,20 C74,18 81,17 90,15',              areaExtra: 'L90,38 L0,38 Z' },
  { id: 'failed',   key: 'failed',   label: 'Failed Verification',changeColor: 'text-red-500',    sparkColor: '#ef4444', linePath: 'M0,5 C8,8 16,12 26,16 C36,20 44,22 54,26 C64,30 74,32 82,34 C85,35 87,35 90,36', areaExtra: 'L90,38 L0,38 Z' },
]

const StatCard = ({ id, label, value, changeColor, sparkColor, linePath, areaExtra }) => (
  <div className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm min-w-0">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 mb-2 truncate">{label}</p>
        <p className="text-2xl font-bold text-[#0e5f4f] leading-none">{value}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className={`text-xs font-semibold ${changeColor}`}>•</span>
        <div className="hidden sm:block">
          <Sparkline id={id} linePath={linePath} areaExtra={areaExtra} color={sparkColor} />
        </div>
      </div>
    </div>
  </div>
)

const StatCards = () => {
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, failed: 0 })

  useEffect(() => {
    getStats().then(setStats).catch(() => {})
  }, [])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {baseStats.map((s) => (
        <StatCard key={s.id} {...s} value={(stats[s.key] || 0).toLocaleString()} />
      ))}
    </div>
  )
}

export default StatCards
