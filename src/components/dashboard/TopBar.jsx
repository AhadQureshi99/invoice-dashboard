import { HiOutlineSearch } from 'react-icons/hi'

const TopBar = () => (
  <header className="sticky top-0 z-40 bg-[#f0f4f8] border-b border-[#dce4ef] px-6 py-3 flex items-center gap-4">

    {/* Search */}
    <div className="relative w-72">
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search Invoices Tax IDs..."
        className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg
                   placeholder:text-gray-400 text-gray-700
                   focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]
                   transition-colors"
      />
    </div>

    {/* Verify Invoice */}
    <button className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white text-xs font-semibold
                       px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
      Verify Invoice
    </button>

    <div className="flex-1" />

    {/* Language */}
    <div className="flex items-center gap-1.5 cursor-pointer">
      <span className="text-lg leading-none">🇬🇧</span>
      <span className="text-sm font-medium text-gray-600">EN</span>
    </div>

    {/* Divider */}
    <div className="w-px h-6 bg-gray-200" />

    {/* User */}
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

export default TopBar
