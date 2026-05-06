import { useState } from 'react'

const notifications = [
  {
    id: 1,
    icon: (
      <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
    ),
    title: 'Batch Processing Completed: B-8021-X',
    body:  'The verification batch for 452 corporate invoices has been successfully processed.',
    meta:  null,
    actions: (
      <div className="flex items-center gap-3 flex-wrap">
        <button className="bg-[#1e3a5f] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#0f2040] transition-colors">
          View Report
        </button>
        <span className="text-[11px] text-gray-400">Docs: <span className="text-gray-500">res</span></span>
      </div>
    ),
    badge: <span className="text-[11px] font-bold whitespace-nowrap"><span className="text-green-500">448 Verified</span> · <span className="text-red-500">4 Flagged</span></span>,
    time:  '2 MINS AGO',
  },
  {
    id: 2,
    icon: (
      <div className="w-10 h-10 rounded-xl bg-[#7f1d1d] flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-9a2 2 0 012 2v1a4 4 0 01-4 4H8a2 2 0 01-2-2V9a2 2 0 012-2h1m5 0V6a3 3 0 10-6 0v1" />
        </svg>
      </div>
    ),
    title: 'Security Alert: Unauthorized API Access Attempt',
    body:  'Multiple failed authentication attempts detected from IP: 192.16.0.4. Critical security protocol triggered. Account access restricted for 30 minutes.',
    meta:  null,
    actions: (
      <div className="flex items-center gap-3 flex-wrap">
        <button className="bg-[#1e3a5f] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#0f2040] transition-colors">
          Review Logs
        </button>
        <button className="text-[11px] font-semibold text-gray-500 hover:text-[#1e3a5f] transition-colors">
          Verify Identity
        </button>
      </div>
    ),
    badge: null,
    time:  '2 MINS AGO',
  },
  {
    id: 3,
    icon: (
      <div className="w-10 h-10 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    title: 'Invoice #INV-2023-991 Verified',
    body:  'Tax compliance check passed for Al-Mubeen Global Enterprises. Transaction ID: TX-00129-ZB.',
    meta:  null,
    actions: (
      <button className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline">
        <span className="text-xs">↓</span> Download Digital Signature Certificate
      </button>
    ),
    badge: null,
    time:  '2 MINS AGO',
  },
  {
    id: 4,
    icon: (
      <div className="w-10 h-10 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </div>
    ),
    title: 'Scheduled Backup Delayed',
    body:  'System backup for historical ledger FY22-23 delayed due to server maintenance. Next attempt scheduled for 02:00 UTC.',
    meta:  null,
    actions: (
      <button className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline">
        <span className="text-xs">↓</span> Download Digital Signature Certificate
      </button>
    ),
    badge: null,
    time:  '2 MINS AGO',
  },
]

const tabs = ['All Activity', 'Unread (12)', 'Archived']

const NotificationList = () => {
  const [activeTab, setActiveTab] = useState('All Activity')

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

      {/* Tabs + Search */}
      <div className="flex items-center justify-between px-5 pt-4 pb-0 gap-4 flex-wrap border-b border-gray-100">
        <div className="flex items-center gap-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold pb-3 border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#1e3a5f] text-[#1e3a5f]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
            <circle cx="7" cy="7" r="5"/><path d="M12 12l3 3" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search alerts..."
            className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 w-48
                       focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Notification rows */}
      <div className="flex-1 divide-y divide-gray-50 overflow-y-auto">
        {notifications.map(({ id, icon, title, body, actions, badge, time }) => (
          <div key={id} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50/60 transition-colors">
            {/* Icon */}
            {icon}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 leading-tight">{title}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{body}</p>
              <div className="mt-2">{actions}</div>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-[10px] font-semibold text-gray-400 tracking-wide whitespace-nowrap">{time}</span>
              {badge && badge}
            </div>
          </div>
        ))}
      </div>

      {/* Footer pagination */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 flex-shrink-0">
        <span className="text-xs text-gray-400">Showing 1-15 of 284 logs</span>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs">‹</button>
          {[1,2,3,4,5].map(n => (
            <button key={n}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                n === 1 ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}>
              {n}
            </button>
          ))}
          <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 text-xs">›</button>
        </div>
      </div>

    </div>
  )
}

export default NotificationList
