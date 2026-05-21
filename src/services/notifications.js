import { supabase } from '../lib/supabase'

export async function listNotifications({ filter = 'all', search = '', categories = [], limit = 50 } = {}) {
  let q = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (filter === 'unread')   q = q.eq('is_read', false).eq('is_archived', false)
  if (filter === 'archived') q = q.eq('is_archived', true)
  if (filter === 'all')      q = q.eq('is_archived', false)
  if (search)                q = q.or(`title.ilike.%${search}%,body.ilike.%${search}%`)
  if (categories?.length)    q = q.in('category', categories)

  const { data, error, count } = await q
  if (error) throw error
  return { rows: data || [], count: count || 0 }
}

export async function notificationStats() {
  const { data, error } = await supabase
    .from('notifications')
    .select('is_read,is_archived,severity,category')
  if (error) throw error
  const rows = data || []
  return {
    total:    rows.length,
    unread:   rows.filter(r => !r.is_read && !r.is_archived).length,
    archived: rows.filter(r => r.is_archived).length,
    critical: rows.filter(r => r.severity === 'critical' && !r.is_archived).length,
    by_category: {
      batch:        rows.filter(r => r.category === 'batch').length,
      security:     rows.filter(r => r.category === 'security').length,
      verification: rows.filter(r => r.category === 'verification').length,
      system:       rows.filter(r => r.category === 'system').length,
    },
  }
}

export async function markAllRead() {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('is_read', false)
  if (error) throw error
}

export async function markRead(id) {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  if (error) throw error
}

export async function archive(id) {
  const { error } = await supabase.from('notifications').update({ is_archived: true }).eq('id', id)
  if (error) throw error
}

export async function createNotification({ title, body, severity = 'info', category = 'system' }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('notifications')
    .insert({ user_id: user?.id, title, body, severity, category })
    .select()
    .single()
  if (error) throw error
  return data
}
