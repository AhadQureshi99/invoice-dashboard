const InvoiceTopBar = () => (
  <header className="sticky top-0 z-40 bg-[#f0f4f8] border-b border-[#dce4ef] px-6 py-3 hidden lg:flex items-center gap-4">
    <span className="text-sm font-bold text-[#1e3a5f]">Invoice Upload &amp; Validation</span>

    <button className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white text-xs font-semibold
                       px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
      Verify Invoice
    </button>

    <div className="flex-1" />

    <div className="flex items-center gap-1.5 cursor-pointer">
      <span className="text-lg leading-none">🇳🇴</span>
      <span className="text-sm font-medium text-gray-600">EN</span>
    </div>

    <div className="flex items-center gap-2.5 cursor-pointer">
      <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
        <span className="text-[11px] font-bold text-white">RP</span>
      </div>
      <div className="leading-tight">
        <p className="text-xs font-semibold text-gray-800">Robert Patinson</p>
        <p className="text-[10px] text-gray-400">Super Admin</p>
      </div>
    </div>
  </header>
)

export default InvoiceTopBar
