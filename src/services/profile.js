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

// Uploads a company logo to the public `logos` bucket and stores its URL on the
// profile. The file is keyed by user id so it overwrites any previous logo.
export async function uploadCompanyLogo(userId, file) {
  const ext  = (file.name.split('.').pop() || 'png').toLowerCase()
  const path = `${userId}/logo.${ext}`
  const { error: upErr } = await supabase.storage
    .from('logos')
    .upload(path, file, { upsert: true, contentType: file.type })
  if (upErr) throw upErr
  const { data } = supabase.storage.from('logos').getPublicUrl(path)
  // Cache-bust so a replaced logo (same path) refreshes immediately.
  const url = `${data.publicUrl}?v=${Date.now()}`
  await updateProfile(userId, { logo_url: url })
  return url
}

export async function removeCompanyLogo(userId) {
  await updateProfile(userId, { logo_url: null })
}
