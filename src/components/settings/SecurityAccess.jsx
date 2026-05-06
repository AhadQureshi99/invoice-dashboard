/* Toggle switch */
const Toggle = ({ on = true }) => (
  <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${on ? 'bg-green-500' : 'bg-gray-200'}`}>
    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
  </div>
)

/* Device icon */
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

const SecurityAccess = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
    <p className="text-sm font-bold text-[#1e3a5f]">Security &amp; Access</p>

    {/* 2FA row */}
    <div className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2L15 5v5c0 4-2.8 7-6 8C5.8 17 3 14 3 10V5L9 2z" fill="#3B82F6" opacity=".2" stroke="#3B82F6" strokeWidth="1.4"/>
          <path d="M6 9l2.5 2.5 4-4" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication</p>
        <p className="text-xs text-gray-400">Protect your account with OTP</p>
      </div>
      <Toggle on={true} />
    </div>

    {/* Active Sessions */}
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-3">Active Sessions</p>
      <div className="flex flex-col gap-2">
        {/* Chrome */}
        <div className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
          <DeviceIcon type="desktop" />
          <div>
            <p className="text-xs font-semibold text-gray-700">Chrome on Windows <span className="text-green-500">(Current)</span></p>
            <p className="text-[11px] text-gray-400">Islamabad, Pakistan · 192.168.1.45</p>
          </div>
        </div>
        {/* iPhone */}
        <div className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
          <DeviceIcon type="mobile" />
          <div>
            <p className="text-xs font-semibold text-gray-700">iPhone 14 Pro</p>
            <p className="text-[11px] text-gray-400">Karachi, Pakistan · 5 mins ago</p>
          </div>
        </div>
      </div>
    </div>

    <button className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors text-center mt-1">
      Log out all other sessions
    </button>
  </div>
)

export default SecurityAccess
