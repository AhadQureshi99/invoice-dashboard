import { useRef, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { updateProfile, uploadCompanyLogo, removeCompanyLogo } from '../../services/profile'

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

  const fileRef = useRef(null)
  const [logoBusy, setLogoBusy] = useState(false)
  const [logoErr,  setLogoErr]  = useState(null)

  const onPickLogo = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user) return
    if (!file.type.startsWith('image/')) { setLogoErr('Please choose an image file.'); return }
    if (file.size > 2 * 1024 * 1024)     { setLogoErr('Logo must be under 2 MB.');     return }
    setLogoBusy(true); setLogoErr(null)
    try {
      await uploadCompanyLogo(user.id, file)
      await refreshProfile()
    } catch (err) { setLogoErr(err.message) } finally { setLogoBusy(false) }
  }

  const onRemoveLogo = async () => {
    if (!user) return
    setLogoBusy(true); setLogoErr(null)
    try {
      await removeCompanyLogo(user.id)
      await refreshProfile()
    } catch (err) { setLogoErr(err.message) } finally { setLogoBusy(false) }
  }

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

      <div className="flex items-center gap-4 border border-gray-100 rounded-xl p-3 bg-[#fafbfc]">
        <div className="h-16 w-16 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
          {profile?.logo_url
            ? <img src={profile.logo_url} alt="Company logo" className="h-full w-full object-contain" />
            : <span className="text-[10px] text-gray-300 text-center px-1">No logo</span>}
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <p className="text-xs font-semibold text-gray-600">Company Logo</p>
          <p className="text-[11px] text-gray-400">Shown on your invoices. PNG or JPG, under 2 MB.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={logoBusy}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {logoBusy ? 'Uploading…' : (profile?.logo_url ? 'Replace' : 'Upload')}
            </button>
            {profile?.logo_url && (
              <button onClick={onRemoveLogo} disabled={logoBusy} className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-60">
                Remove
              </button>
            )}
          </div>
          {logoErr && <p className="text-[11px] text-red-500">{logoErr}</p>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickLogo} />
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
