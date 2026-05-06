import { HiOutlineRefresh } from 'react-icons/hi'

const AdvancedFilters = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
    <p className="text-sm font-bold text-[#1e3a5f] mb-4">Advanced Filters</p>

    <div className="flex items-end gap-4 flex-wrap">
      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600">Status</label>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600
                           focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]
                           bg-white cursor-pointer min-w-[130px]">
          <option>All Statuses</option>
          <option>Verified</option>
          <option>Invalid</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Date Range */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600">Date Range</label>
        <div className="relative">
          <select className="border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-600
                             focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]
                             bg-white cursor-pointer min-w-[130px]">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
            <option>Custom Range</option>
          </select>
          {/* calendar icon inside */}
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
               fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="2" width="14" height="13" rx="2"/>
            <path d="M1 6h14M5 1v2M11 1v2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600">Type</label>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600
                           focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]
                           bg-white cursor-pointer min-w-[120px]">
          <option>All Types</option>
          <option>Sales Tax</option>
          <option>Income Tax</option>
          <option>Custom Duty</option>
        </select>
      </div>

      {/* Amount Range */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600">Amount Range</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Min"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 w-20
                       placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
                       focus:border-[#1e3a5f]"
          />
          <input
            type="text"
            placeholder="Max"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 w-20
                       placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
                       focus:border-[#1e3a5f]"
          />
        </div>
      </div>

      {/* Apply + Reset */}
      <div className="flex items-center gap-2 ml-auto">
        <button className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-lg px-5 py-2 text-sm font-semibold transition-colors">
          Apply Filters
        </button>
        <button className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg
                           text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
          <HiOutlineRefresh className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
)

export default AdvancedFilters
