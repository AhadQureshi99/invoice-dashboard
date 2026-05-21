import { useState } from 'react'
import DashboardLayout       from '../components/dashboard/DashboardLayout'
import NotificationStats     from '../components/notifications/NotificationStats'
import NotificationTypes     from '../components/notifications/NotificationTypes'
import NotificationList      from '../components/notifications/NotificationList'
import PageTopBar            from '../components/common/PageTopBar'
import Modal                 from '../components/common/Modal'
import { HiOutlineCheckCircle, HiViewGrid } from 'react-icons/hi'
import { markAllRead, createNotification } from '../services/notifications'

const NotificationsPage = () => {
  const [refreshKey,  setRefreshKey]  = useState(0)
  const [categories,  setCategories]  = useState([])
  const [composeOpen, setComposeOpen] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', severity: 'info', category: 'system' })
  const [busy, setBusy] = useState(false)

  const refresh = () => setRefreshKey(k => k + 1)

  const handleMarkAll = async () => { await markAllRead(); refresh() }

  const compose = async () => {
    if (!form.title) return
    setBusy(true)
    try {
      await createNotification(form)
      setComposeOpen(false)
      setForm({ title: '', body: '', severity: 'info', category: 'system' })
      refresh()
    } finally { setBusy(false) }
  }

  return (
    <DashboardLayout>
        <PageTopBar title="FBR Invoice Manager" subtitle="Notification Center" showSearch />

        <main className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-5">

            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-black text-[#0e5f4f] leading-tight">Notification Center</h1>
                <p className="text-xs text-gray-400 mt-1 max-w-lg">
                  Monitor institutional alerts, batch processing status, and security audit logs.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleMarkAll} className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <HiOutlineCheckCircle className="w-4 h-4" />
                  Mark all as read
                </button>
                <button onClick={refresh} className="border border-gray-300 bg-white rounded-xl p-2.5 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm" title="Refresh">
                  <HiViewGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            <NotificationStats key={`s-${refreshKey}`} />

            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              <NotificationTypes selected={categories} onChange={setCategories} />
              <NotificationList key={`l-${refreshKey}-${categories.join(',')}`} categories={categories} />
            </div>

            <p className="text-[11px] text-gray-400 pb-2">
              © 2026{' '}
              <a href="/" className="text-blue-500 hover:underline">Name</a>
              {' '}All rights reserved.
            </p>

          </div>
        </main>

      <button
        onClick={() => setComposeOpen(true)}
        title="Create notification"
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-2xl flex items-center justify-center shadow-lg transition-colors z-50 text-xl font-light"
      >
        +
      </button>

      <Modal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        title="New Notification"
        footer={
          <>
            <button onClick={() => setComposeOpen(false)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={compose} disabled={busy || !form.title} className="bg-[#0e5f4f] hover:bg-[#083f33] disabled:opacity-60 text-white rounded-lg px-3 py-1.5 text-xs font-semibold">
              {busy ? 'Sending…' : 'Send'}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <textarea rows={3} value={form.body} onChange={(e) => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Body" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.severity} onChange={(e) => setForm(f => ({ ...f, severity: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
            <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="system">System</option>
              <option value="batch">Batch</option>
              <option value="security">Security</option>
              <option value="verification">Verification</option>
            </select>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default NotificationsPage
