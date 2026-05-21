import { useEffect, useState } from 'react'
import { verificationStats } from '../../services/verifications'

const MedalIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="24" r="12" fill="#FCD34D" />
    <circle cx="20" cy="24" r="8" fill="#F59E0B" />
    <path d="M20 18l1.5 4h4l-3 2.5 1 4-3.5-2.5-3.5 2.5 1-4-3-2.5h4L20 18z" fill="#FFF"/>
    <rect x="15" y="6" width="10" height="12" rx="2" fill="#3B82F6" />
    <rect x="15" y="6" width="4" height="12" rx="2" fill="#60A5FA" />
  </svg>
)
const FolderXIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M6 14a3 3 0 013-3h8l3 3h10a3 3 0 013 3v12a3 3 0 01-3 3H9a3 3 0 01-3-3V14z" fill="#FDBA74" />
    <path d="M6 17h28" stroke="#F97316" strokeWidth="1.5" />
    <circle cx="28" cy="14" r="7" fill="#EF4444" />
    <path d="M25 11l6 6M31 11l-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
const ChartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="4" y="20" width="6" height="16" rx="2" fill="#93C5FD" />
    <rect x="13" y="12" width="6" height="24" rx="2" fill="#3B82F6" />
    <rect x="22" y="16" width="6" height="20" rx="2" fill="#60A5FA" />
    <rect x="31" y="8" width="6" height="28" rx="2" fill="#2563EB" />
  </svg>
)
const ShieldCheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M20 4l14 6v10c0 8-6 14-14 16C6 34 0 28 0 20V10l14-6h6z" transform="translate(3 2)" fill="#34D399" />
    <path d="M11 21l5 5 9-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const VerificationStats = ({ refreshKey = 0 }) => {
  const [s, setS] = useState({ verified: 0, invalid: 0, avgSeconds: 0, compliance: 0 })

  useEffect(() => {
    verificationStats().then(setS).catch(() => {})
  }, [refreshKey])

  const items = [
    { icon: MedalIcon,       value: String(s.verified).padStart(2, '0'),    label: 'Total Verified' },
    { icon: FolderXIcon,     value: String(s.invalid).padStart(2, '0'),     label: 'Invalid Detected' },
    { icon: ChartIcon,       value: `${s.avgSeconds.toFixed(1)}s`,           label: 'AVG. Response' },
    { icon: ShieldCheckIcon, value: `${s.compliance.toFixed(1)}%`,           label: 'Compliance Rate' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(({ icon: Icon, value, label }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0"><Icon /></div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-0.5">
              <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
              <p className="text-[10px] text-gray-400 font-medium leading-tight truncate">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VerificationStats
