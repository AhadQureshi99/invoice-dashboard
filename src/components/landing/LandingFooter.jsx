const LandingFooter = () => (
  <footer className="w-full bg-[#f0f2f5] border-t border-gray-200">
    <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">

      {/* Logo + copyright */}
      <div>
        <div className="flex items-center gap-0 mb-1.5 select-none">
          <span className="text-[#1e3a5f] font-bold text-xl tracking-tight">uds</span>
          <span className="text-green-500 font-bold text-xl tracking-tight">pak</span>
        </div>
        <p className="text-xs text-gray-400">
          © 2024 UDS PAK. Government Integrated &amp; SOC2 Compliant.
        </p>
      </div>

      {/* Links */}
      <div className="flex items-center gap-6 text-sm text-gray-500">
        {['Privacy Policy', 'Terms of Service', 'Security Standards', 'Contact Support'].map((l) => (
          <a key={l} href="#" className="hover:text-gray-800 transition-colors">{l}</a>
        ))}
      </div>
    </div>
  </footer>
)

export default LandingFooter
