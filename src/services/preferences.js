import { supabase } from '../lib/supabase'

export async function getPrefs() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('user_preferences').select('*').eq('user_id', user.id).maybeSingle()
  if (data) return data
  // create defaults on first read
  const { data: created } = await supabase
    .from('user_preferences')
    .insert({ user_id: user.id })
    .select()
    .single()
  return created
}

export async function updatePrefs(patch) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({ user_id: user.id, ...patch })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function changePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}
