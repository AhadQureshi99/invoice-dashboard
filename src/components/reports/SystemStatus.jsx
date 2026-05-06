/* Archive capacity bar-chart icon */
const ArchiveIcon = () => (
  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1"  y="12" width="3" height="7" rx="1" fill="#818cf8"/>
      <rect x="6"  y="8"  width="3" height="11" rx="1" fill="#f59e0b"/>
      <rect x="11" y="10" width="3" height="9"  rx="1" fill="#818cf8"/>
      <rect x="16" y="5"  width="3" height="14" rx="1" fill="#34d399"/>
    </svg>
  </div>
)

/* Clock/auto-purge icon */
const PurgeIcon = () => (
  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="#f97316" strokeWidth="1.8" fill="none"/>
      <path d="M10 5v5l3 3" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  </div>
)

const SystemStatus = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">

    {/* Status header */}
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0 shadow-sm shadow-green-300" />
      <p className="text-sm font-bold text-[#1e3a5f]">System Online: All services operational</p>
    </div>

    <div className="flex flex-col gap-3 mt-1">
      {/* Archive capacity */}
      <div className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
        <ArchiveIcon />
        <div>
          <p className="text-sm font-semibold text-gray-800">Archive Capacity: 42.8 GB / 100 GB</p>
        </div>
      </div>

      {/* Auto-purge */}
      <div className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
        <PurgeIcon />
        <div>
          <p className="text-sm font-semibold text-gray-800 leading-snug">
            Auto-purge enabled for logs older<br />than 365 days
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default SystemStatus
