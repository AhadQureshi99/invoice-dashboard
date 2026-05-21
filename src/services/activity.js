import { supabase } from '../lib/supabase'

export async function logActivity({ action, subject, status, type, metadata = {} }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('activity_log').insert({
    user_id: user?.id,
    action,
    subject,
    status,
    type,
    metadata,
  })
  if (error) console.warn('activity log failed', error.message)
}

export async function listActivity({ limit = 10 } = {}) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}
