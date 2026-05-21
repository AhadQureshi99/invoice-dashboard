import { useEffect, useState } from 'react'
import { getPrefs, updatePrefs } from '../../services/preferences'

const Toggle = ({ on, onChange, label }) => (
  <div className="flex items-center justify-between text-xs text-white/80">
    <span>{label}</span>
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${on ? 'bg-green-500' : 'bg-white/20'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  </div>
)

const PrivacyGuard = () => {
  const [p, setP] = useState(null)

  useEffect(() => { getPrefs().then(setP).catch(() => {}) }, [])

  const update = (k) => async (v) => {
    setP(prev => ({ ...prev, [k]: v }))
    await updatePrefs({ [k]: v })
  }

  return (
    <div className="bg-[#1e3a5f] rounded-2xl p-5 flex flex-col text-center h-full relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 280 230" fill="none">
          <circle cx="200" cy="40" r="80" stroke="white" strokeWidth="1" fill="none"/>
          <circle cx="200" cy="40" r="60" stroke="white" strokeWidth="1" fill="none"/>
          <circle cx="200" cy="40" r="40" stroke="white" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      <div className="relative z-10 mb-4 mx-auto">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path d="M22 4L38 11v13c0 9-7 16-16 18C7 40 0 33 0 24V11L22 4z" transform="translate(3 2)" fill="#22c55e" opacity=".25"/>
            <path d="M22 4L38 11v13c0 9-7 16-16 18C7 40 0 33 0 24V11L22 4z" transform="translate(3 2)" stroke="#22c55e" strokeWidth="2" fill="none"/>
            <path d="M14 24l6 6 10-12" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <p className="relative z-10 text-base font-bold text-white mb-2">Privacy Guard</p>
      <p className="relative z-10 text-xs text-slate-300 leading-relaxed mb-4">
        Control what we monitor for this session.
      </p>

      {p && (
        <div className="relative z-10 flex flex-col gap-2.5 text-left mt-2">
          <Toggle on={!!p.privacy_guard} onChange={update('privacy_guard')} label="Session monitoring" />
          <Toggle on={!!p.email_alerts}  onChange={update('email_alerts')}  label="Email alerts" />
          <Toggle on={!!p.push_alerts}   onChange={update('push_alerts')}   label="Push notifications" />
        </div>
      )}
    </div>
  )
}

export default PrivacyGuard
