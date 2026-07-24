import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { updateInvoice } from '../../services/invoices'
import { logActivity } from '../../services/activity'
import { createNotification } from '../../services/notifications'
import Modal from '../common/Modal'

const VoidBanner = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [open,    setOpen]    = useState(false)
  const [reason,  setReason]  = useState('')
  const [busy,    setBusy]    = useState(false)

  const handleVoid = async () => {
    setBusy(true)
    try {
      const updated = await updateInvoice(id, { status: 'void' })
      await logActivity({ action: 'Invoice Voided', subject: updated.invoice_number, status: 'Void', type: 'updated', metadata: { reason } })
      await createNotification({ title: `Invoice ${updated.invoice_number} voided`, body: reason || 'No reason provided', severity: 'warning', category: 'system' })
      setOpen(false)
      navigate('/dashboard/invoices')
    } finally { setBusy(false) }
  }

  return (
    <>
      <div className="no-print bg-[#0e5f4f] rounded-2xl px-7 py-6 flex items-center justify-between gap-6">
        <div>
          <p className="text-white font-bold text-lg">Need to Void?</p>
          <p className="text-[#4eaa88] text-xs mt-1">Request a credit note for this invoice if corrections are required.</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex-shrink-0 border border-white/40 text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
          Initiate Void
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Void this invoice?"
        footer={
          <>
            <button onClick={() => setOpen(false)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleVoid} disabled={busy} className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-lg px-3 py-1.5 text-xs font-semibold">
              {busy ? 'Voiding…' : 'Confirm Void'}
            </button>
          </>
        }
      >
        <p className="text-xs text-gray-500 mb-3">
          Voiding marks the invoice as <strong>void</strong>. This is recorded to your activity log and creates a notification.
        </p>
        <label className="text-xs font-semibold text-gray-700">Reason</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="mt-1.5 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Why is this invoice being voided?" />
      </Modal>
    </>
  )
}

export default VoidBanner