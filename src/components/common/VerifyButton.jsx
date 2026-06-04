import { useState } from 'react'
import { HiOutlineShieldCheck } from 'react-icons/hi'
import { verifyAndRecord } from '../../services/fbr'
import { logActivity } from '../../services/activity'

/**
 * Reusable "Verify with FBR" button. Submits a normalized invoice to the FBR
 * sandbox via verifyAndRecord, logs the activity, and hands the result back to
 * the parent through onVerified so it can persist status / show feedback.
 *
 * @param {object}   invoice    normalized invoice (seller_ntn, buyer_ntn, items[…], …)
 * @param {function} onVerified async (result) => void  — result.status is 'verified' | 'invalid'
 */
const VerifyButton = ({ invoice, onVerified, label = 'Verify with FBR', className }) => {
  const [busy, setBusy] = useState(false)

  const handleVerify = async () => {
    if (!invoice || busy) return
    setBusy(true)
    try {
      const result = await verifyAndRecord(invoice)
      await logActivity({
        action:   'Invoice Verification',
        subject:  invoice.invoice_number || invoice.invoice_ref_no || 'Invoice',
        status:   result.status === 'verified' ? 'Verified' : 'Invalid',
        type:     result.status === 'verified' ? 'verified' : 'invalid',
        metadata: { duration_ms: result.durationMs },
      })
      await onVerified?.(result)
    } catch (err) {
      await onVerified?.({ status: 'invalid', ok: false, error: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleVerify}
      disabled={busy}
      className={className || 'flex items-center justify-center gap-1.5 bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-xl px-4 py-2 text-xs font-semibold transition-colors shadow-sm disabled:opacity-60'}
    >
      <HiOutlineShieldCheck className="w-3.5 h-3.5" />
      {busy ? 'Verifying…' : label}
    </button>
  )
}

export default VerifyButton
