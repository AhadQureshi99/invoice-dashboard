import { useRef, useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { uploadCompanyAsset, removeCompanyAsset } from '../../services/profile'

const AssetSlot = ({ kind, label, hint, url, onChange }) => {
  const { user } = useAuth()
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err,  setErr]  = useState(null)

  const onPick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user) return
    if (!file.type.startsWith('image/')) { setErr('Please choose an image file.'); return }
    if (file.size > 2 * 1024 * 1024)     { setErr(`${label} must be under 2 MB.`); return }
    setBusy(true); setErr(null)
    try {
      await uploadCompanyAsset(user.id, file, kind)
      await onChange?.()
    } catch (e2) { setErr(e2.message) } finally { setBusy(false) }
  }

  const onRemove = async () => {
    if (!user) return
    setBusy(true); setErr(null)
    try {
      await removeCompanyAsset(user.id, kind)
      await onChange?.()
    } catch (e2) { setErr(e2.message) } finally { setBusy(false) }
  }

  return (
    <div className="flex items-center gap-4 border border-gray-100 rounded-xl p-3 bg-[#fafbfc]">
      <div className="h-16 w-16 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
        {url
          ? <img src={url} alt={label} className="h-full w-full object-contain" />
          : <span className="text-[10px] text-gray-300 text-center px-1">No {kind}</span>}
      </div>
      <div className="flex flex-col gap-1.5 min-w-0">
        <p className="text-xs font-semibold text-gray-600">{label}</p>
        <p className="text-[11px] text-gray-400">{hint}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {busy ? 'Uploading…' : (url ? 'Replace' : 'Upload')}
          </button>
          {url && (
            <button type="button" onClick={onRemove} disabled={busy} className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-60">
              Remove
            </button>
          )}
        </div>
        {err && <p className="text-[11px] text-red-500">{err}</p>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
    </div>
  )
}

const BrandingAssets = ({ title = 'Invoice Branding' }) => {
  const { profile, refreshProfile } = useAuth()
  return (
    <div className="flex flex-col gap-3">
      {title && <p className="text-xs font-semibold text-gray-700">{title}</p>}
      <AssetSlot
        kind="logo"
        label="Company Logo"
        hint="Shown on every invoice. PNG or JPG, under 2 MB."
        url={profile?.logo_url}
        onChange={refreshProfile}
      />
      <AssetSlot
        kind="barcode"
        label="Barcode"
        hint="Shown on every invoice. PNG or JPG, under 2 MB."
        url={profile?.barcode_url}
        onChange={refreshProfile}
      />
    </div>
  )
}

export default BrandingAssets
