const types = [
  { label: 'Batch Results',    count: '08' },
  { label: 'Security Alerts',  count: '03' },
  { label: 'Verifications',    count: '13' },
]

const NotificationTypes = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:w-40 flex-shrink-0">
    <p className="text-[10px] font-black text-[#1e3a5f] tracking-widest uppercase mb-4">Types</p>
    <div className="flex flex-col gap-3">
      {types.map(({ label, count }) => (
        <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-4 h-4 rounded bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 4.5-4.5"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600 font-medium flex-1">{label}</span>
          <span className="text-[11px] font-bold text-gray-400">{count}</span>
        </label>
      ))}
    </div>
  </div>
)

export default NotificationTypes
