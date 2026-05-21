import { useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { updateProfile } from '../../services/profile'

const Row = ({ label, value, onChange, editing }) => (
  <div>
    <p className="text-xs font-semibold text-gray-500 mb-1.5">{label}</p>
    {editing ? (
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20"
      />
    ) : (
      <div className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-[#fafbfc]">
        {value || '—'}
      </div>
    )}
  </div>
)

const ProfileDetails = () => {
  const { user, profile, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [busy,    setBusy]    = useState(false)
  const [form,    setForm]    = useState({
    entity_name:   profile?.entity_name   || '',
    email:         profile?.email         || user?.email || '',
    credential_no: profile?.credential_no || '',
  })

  const save = async () => {
    if (!user) return
    setBusy(true)
    try {
      await updateProfile(user.id, {
        entity_name:   form.entity_name,
        credential_no: form.credential_no,
      })
      await refreshProfile()
      setEditing(false)
    } finally { setBusy(false) }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#0e5f4f]">Profile Details</p>
        {editing ? (
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(false)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={save} disabled={busy} className="bg-[#0e5f4f] text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-[#083f33] disabled:opacity-60">
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="border border-gray-300 rounded-lg px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Edit
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Row label="Full Name / Legal Entity"  value={form.entity_name}   editing={editing} onChange={(v) => setForm(f => ({ ...f, entity_name: v }))} />
        <Row label="Email Address"             value={form.email}         editing={false} />
        <Row label="NTN (National Tax Number)" value={form.credential_no} editing={editing} onChange={(v) => setForm(f => ({ ...f, credential_no: v }))} />
      </div>
    </div>
  )
}

export default ProfileDetails
