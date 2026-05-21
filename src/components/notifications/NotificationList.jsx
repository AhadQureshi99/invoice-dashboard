import { useEffect, useState } from 'react'
import { listNotifications, markAllRead, markRead, archive } from '../../services/notifications'

const severityIcon = (severity) => {
  if (severity === 'critical') return (
    <div className="w-10 h-10 rounded-xl bg-[#7f1d1d] flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  )
  if (severity === 'success') return (
    <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  )
  return (
    <div className="w-10 h-10 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  )
}

const ago = (iso) => {
  if (!iso) return ''
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'JUST NOW'
  if (diff < 3600) return `${Math.floor(diff / 60)} MINS AGO`
  if (diff < 86400) return `${Math.floor(diff / 3600)} HRS AGO`
  return `${Math.floor(diff / 86400)} D AGO`
}

const tabs = [
  { key: 'all',      label: 'All Activity' },
  { key: 'unread',   label: 'Unread' },
  { key: 'archived', label: 'Archived' },
]

const NotificationList = ({ categories = [] }) => {
  const [activeTab, setActiveTab] = useState('all')
  const [search,    setSearch]    = useState('')
  const [rows,      setRows]      = useState([])
  const [count,     setCount]     = useState(0)
  const [loading,   setLoading]   = useState(true)

  const load = () => {
    setLoading(true)
    listNotifications({ filter: activeTab, search, categories })
      .then(({ rows, count }) => { setRows(rows); setCount(count) })
      .finally(() => setLoading(false))
  }

  useEffect(load, [activeTab, search, categories.join(',')])

  const handleMarkAll = async () => { await markAllRead(); load() }

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

      <div className="flex items-center justify-between px-5 pt-4 pb-0 gap-4 flex-wrap border-b border-gray-100">
        <div className="flex items-center gap-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`text-xs font-semibold pb-3 border-b-2 transition-colors ${
                activeTab === t.key
                  ? 'border-[#1e3a5f] text-[#1e3a5f]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}{t.key === 'unread' && count > 0 && activeTab === 'unread' ? ` (${count})` : ''}
            </button>
          ))}
          <button onClick={handleMarkAll} className="ml-3 text-[11px] font-semibold text-blue-600 hover:underline">
            Mark all as read
          </button>
        </div>
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
            <circle cx="7" cy="7" r="5"/><path d="M12 12l3 3" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts..."
            className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 w-48
                       focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 placeholder:text-gray-300"
          />
        </div>
      </div>

      <div className="flex-1 divide-y divide-gray-50 overflow-y-auto">
        {loading && <div className="p-8 text-center text-xs text-gray-400">Loading…</div>}
        {!loading && rows.length === 0 && <div className="p-8 text-center text-xs text-gray-400">No notifications.</div>}
        {rows.map((n) => (
          <div key={n.id} className={`px-5 py-4 flex items-start gap-4 hover:bg-gray-50/60 transition-colors ${n.is_read ? '' : 'bg-blue-50/30'}`}>
            {severityIcon(n.severity)}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 leading-tight">{n.title}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.body}</p>
              <div className="mt-2 flex items-center gap-3">
                {!n.is_read && (
                  <button onClick={async () => { await markRead(n.id); load() }} className="text-[11px] font-semibold text-blue-600 hover:underline">
                    Mark as read
                  </button>
                )}
                {!n.is_archived && (
                  <button onClick={async () => { await archive(n.id); load() }} className="text-[11px] font-semibold text-gray-500 hover:underline">
                    Archive
                  </button>
                )}
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-[10px] font-semibold text-gray-400 tracking-wide whitespace-nowrap">{ago(n.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 flex-shrink-0">
        <span className="text-xs text-gray-400">Showing {rows.length} of {count} logs</span>
      </div>

    </div>
  )
}

export default NotificationList
