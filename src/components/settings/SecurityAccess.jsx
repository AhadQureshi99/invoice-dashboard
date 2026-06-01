import { useEffect, useState } from 'react'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { listSessions, logoutOtherSessions } from '../../services/system'
import { getPrefs, updatePrefs, changePassword } from '../../services/preferences'
import Modal from '../common/Modal'

const PasswordField = ({ value, onChange, placeholder }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
      </button>
    </div>
  )
}

const Toggle = ({ on, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!on)}
    className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${on ? 'bg-green-500' : 'bg-gray-300'}`}
  >
    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
)

const DeviceIcon = ({ type }) => (
  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
    {type === 'desktop' ? (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="14" height="9" rx="1.5" stroke="#6b7280" strokeWidth="1.4" fill="none"/>
        <path d="M5 14h6M8 11v3" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="4" y="1" width="8" height="14" rx="1.5" stroke="#6b7280" strokeWidth="1.4" fill="none"/>
        <circle cx="8" cy="12.5" r="0.8" fill="#6b7280"/>
      </svg>
    )}
  </div>
)

const ago = (iso) => {
  if (!iso) return ''
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`
  return `${Math.floor(diff / 86400)} d ago`
}

const SecurityAccess = () => {
  const [prefs,    setPrefs]    = useState(null)
  const [sessions, setSessions] = useState([])
  const [pwOpen,   setPwOpen]   = useState(false)
  const [pw,       setPw]       = useState({ a: '', b: '', err: null, busy: false })

  const reload = async () => {
    setPrefs(await getPrefs())
    setSessions(await listSessions())
  }

  useEffect(() => { reload() }, [])

  const toggle2FA = async () => {
    const next = !prefs.two_factor_enabled
    setPrefs(p => ({ ...p, two_factor_enabled: next }))
    await updatePrefs({ two_factor_enabled: next })
  }

  const logoutOthers = async () => {
    if (!confirm('Log out all other sessions?')) return
    await logoutOtherSessions()
    reload()
  }

  const savePassword = async () => {
    if (pw.a !== pw.b) { setPw(s => ({ ...s, err: 'Passwords do not match' })); return }
    if (pw.a.length < 6) { setPw(s => ({ ...s, err: 'At least 6 characters' })); return }
    setPw(s => ({ ...s, busy: true, err: null }))
    try {
      await changePassword(pw.a)
      setPwOpen(false)
      setPw({ a: '', b: '', err: null, busy: false })
      alert('Password updated.')
    } catch (e) {
      setPw(s => ({ ...s, err: e.message, busy: false }))
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <p className="text-sm font-bold text-[#0e5f4f]">Security &amp; Access</p>

      <div className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
        <div className="w-9 h-9 rounded-xl bg-[#4eaa88]/15 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L15 5v5c0 4-2.8 7-6 8C5.8 17 3 14 3 10V5L9 2z" fill="#3B82F6" opacity=".2" stroke="#3B82F6" strokeWidth="1.4"/>
            <path d="M6 9l2.5 2.5 4-4" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication</p>
          <p className="text-xs text-gray-400">Protect your account with OTP</p>
        </div>
        <Toggle on={!!prefs?.two_factor_enabled} onChange={toggle2FA} />
      </div>

      <button onClick={() => setPwOpen(true)} className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
        Change Password
      </button>

      <div>
        <p className="text-xs font-semibold text-gray-500 mb-3">Active Sessions ({sessions.length})</p>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {sessions.length === 0 && <p className="text-xs text-gray-400">No active sessions recorded.</p>}
          {sessions.map(s => (
            <div key={s.id} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
              <DeviceIcon type={/iPhone|iPad|Android/i.test(s.device || '') ? 'mobile' : 'desktop'} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">
                  {s.browser || 'Browser'} on {s.device || 'Device'}
                  {s.is_current && <span className="text-green-500 ml-1">(Current)</span>}
                </p>
                <p className="text-[11px] text-gray-400 truncate">{s.location || '—'} · {ago(s.last_active_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={logoutOthers} className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors text-center mt-1">
        Log out all other sessions
      </button>

      <Modal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        title="Change Password"
        footer={
          <>
            <button onClick={() => setPwOpen(false)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={savePassword} disabled={pw.busy} className="bg-[#0e5f4f] hover:bg-[#083f33] disabled:opacity-60 text-white rounded-lg px-3 py-1.5 text-xs font-semibold">
              {pw.busy ? 'Saving…' : 'Update Password'}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <PasswordField value={pw.a} onChange={(e) => setPw(s => ({ ...s, a: e.target.value }))} placeholder="New password" />
          <PasswordField value={pw.b} onChange={(e) => setPw(s => ({ ...s, b: e.target.value }))} placeholder="Confirm new password" />
          {pw.err && <div className="text-xs text-red-600">{pw.err}</div>}
        </div>
      </Modal>
    </div>
  )
}

export default SecurityAccess