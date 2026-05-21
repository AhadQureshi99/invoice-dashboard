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
