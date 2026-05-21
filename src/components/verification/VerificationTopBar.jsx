import { useEffect, useState } from 'react'
import { getSystemStatus } from '../../services/system'
import PageTopBar from '../common/PageTopBar'

const ago = (iso) => {
  if (!iso) return '—'
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60) return `${sec}s ago`
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`
  return `${Math.floor(sec / 3600)} h ago`
}

const VerificationTopBar = () => {
  const [last, setLast] = useState(null)
  useEffect(() => { getSystemStatus().then(s => setLast(s?.last_sync_at)).catch(() => {}) }, [])
  return <PageTopBar title="Verification Center" lastSync={`Last Sync: ${ago(last)}`} showSearch />
}

export default VerificationTopBar
