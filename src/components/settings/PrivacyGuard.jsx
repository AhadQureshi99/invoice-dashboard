const PrivacyGuard = () => (
  <div className="bg-[#1e3a5f] rounded-2xl p-5 flex flex-col items-center justify-center text-center h-full relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 opacity-10">
      <svg width="100%" height="100%" viewBox="0 0 280 230" fill="none">
        <circle cx="200" cy="40"  r="80" stroke="white" strokeWidth="1" fill="none"/>
        <circle cx="200" cy="40"  r="60" stroke="white" strokeWidth="1" fill="none"/>
        <circle cx="200" cy="40"  r="40" stroke="white" strokeWidth="1" fill="none"/>
      </svg>
    </div>

    {/* Shield icon */}
    <div className="relative z-10 mb-4">
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M22 4L38 11v13c0 9-7 16-16 18C7 40 0 33 0 24V11L22 4z"
                transform="translate(3 2)" fill="#22c55e" opacity=".25"/>
          <path d="M22 4L38 11v13c0 9-7 16-16 18C7 40 0 33 0 24V11L22 4z"
                transform="translate(3 2)" stroke="#22c55e" strokeWidth="2" fill="none"/>
          <path d="M14 24l6 6 10-12" stroke="#22c55e" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>

    <p className="relative z-10 text-base font-bold text-white mb-2">Privacy Guard Active</p>
    <p className="relative z-10 text-xs text-slate-300 leading-relaxed">
      This session is being monitored for security compliance.
    </p>
  </div>
)

export default PrivacyGuard
