import { supabase } from '../lib/supabase'

export async function getSystemStatus() {
  const { data } = await supabase.from('system_status').select('*').eq('id', 1).maybeSingle()
  return data || { online: true, archive_used_gb: 0, archive_total_gb: 100, auto_purge_days: 365 }
}

export async function listSessions() {
  const { data } = await supabase
    .from('user_sessions')
    .select('*')
    .order('last_active_at', { ascending: false })
  return data || []
}

export async function recordCurrentSession() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const ua = navigator.userAgent
  const browser = /Edg/.test(ua) ? 'Edge' : /Chrome/.test(ua) ? 'Chrome' : /Firefox/.test(ua) ? 'Firefox' : /Safari/.test(ua) ? 'Safari' : 'Browser'
  const platform = navigator.platform || 'Unknown'

  // mark all other sessions non-current
  await supabase.from('user_sessions').update({ is_current: false }).eq('user_id', user.id)

  await supabase.from('user_sessions').insert({
    user_id: user.id,
    device: platform,
    browser,
    location: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
    ip: null,
    is_current: true,
  })
}

export async function logoutOtherSessions() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('user_sessions').delete().eq('user_id', user.id).eq('is_current', false)
}
