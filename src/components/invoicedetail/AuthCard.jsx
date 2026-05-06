const AuthCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">

    {/* Authenticated badge */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-bold text-green-600">Authenticated</p>
        <p className="text-[11px] text-gray-400">FBR Clearance System</p>
      </div>
    </div>

    {/* QR code block */}
    <div className="flex items-start gap-4">
      {/* QR placeholder */}
      <div className="w-20 h-20 rounded-xl border-2 border-gray-200 bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
        {/* Minimal QR SVG pattern */}
        <svg viewBox="0 0 40 40" className="w-16 h-16" fill="none">
          {/* Top-left finder */}
          <rect x="2" y="2" width="12" height="12" rx="1" fill="#1e3a5f"/>
          <rect x="4" y="4" width="8"  height="8"  rx="0.5" fill="white"/>
          <rect x="5.5" y="5.5" width="5" height="5" rx="0.3" fill="#1e3a5f"/>
          {/* Top-right finder */}
          <rect x="26" y="2" width="12" height="12" rx="1" fill="#1e3a5f"/>
          <rect x="28" y="4" width="8"  height="8"  rx="0.5" fill="white"/>
          <rect x="29.5" y="5.5" width="5" height="5" rx="0.3" fill="#1e3a5f"/>
          {/* Bottom-left finder */}
          <rect x="2" y="26" width="12" height="12" rx="1" fill="#1e3a5f"/>
          <rect x="4" y="28" width="8"  height="8"  rx="0.5" fill="white"/>
          <rect x="5.5" y="29.5" width="5" height="5" rx="0.3" fill="#1e3a5f"/>
          {/* Data dots */}
          {[16,18,20,22,24,16,20,24,17,21,16,18,22,24,19,23].map((x, i) => (
            <rect key={i} x={x} y={16 + (i % 8) * 2.2} width="1.5" height="1.5" rx="0.3" fill="#1e3a5f"/>
          ))}
        </svg>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">QR Verification Link</p>
        <p className="text-sm font-mono text-[#1e3a5f] font-bold leading-snug break-all">
          fbr-v-auth-0x88219<br/>92
        </p>
      </div>
    </div>

    <div className="border-t border-gray-100 pt-4 flex flex-col gap-2.5">
      <div className="flex justify-between">
        <span className="text-xs text-gray-400">Hash Checksum</span>
        <span className="text-xs font-mono font-semibold text-gray-700">e9f2 . . . a11c</span>
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-gray-400">Signed By</span>
        <span className="text-xs font-semibold text-blue-600">Digital Signature V4.1</span>
      </div>
    </div>
  </div>
)

export default AuthCard
