import { supabase } from '../lib/supabase'

export async function getProfile(id) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function updateProfile(id, patch) {
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

// Branding assets (logo / barcode) are stored in the public `logos` bucket,
// keyed by user id so each upload overwrites the previous one, and their public
// URL is saved on the matching profile column.
const ASSET = {
  logo:    { file: 'logo',    column: 'logo_url' },
  barcode: { file: 'barcode', column: 'barcode_url' },
}

export async function uploadCompanyAsset(userId, file, kind = 'logo') {
  const cfg = ASSET[kind]
  if (!cfg) throw new Error(`Unknown branding asset: ${kind}`)
  const ext  = (file.name.split('.').pop() || 'png').toLowerCase()
  const path = `${userId}/${cfg.file}.${ext}`
  const { error: upErr } = await supabase.storage
    .from('logos')
    .upload(path, file, { upsert: true, contentType: file.type })
  if (upErr) throw upErr
  const { data } = supabase.storage.from('logos').getPublicUrl(path)
  // Cache-bust so a replaced asset (same path) refreshes immediately.
  const url = `${data.publicUrl}?v=${Date.now()}`
  await updateProfile(userId, { [cfg.column]: url })
  return url
}

export async function removeCompanyAsset(userId, kind = 'logo') {
  const cfg = ASSET[kind]
  if (!cfg) throw new Error(`Unknown branding asset: ${kind}`)
  await updateProfile(userId, { [cfg.column]: null })
}
