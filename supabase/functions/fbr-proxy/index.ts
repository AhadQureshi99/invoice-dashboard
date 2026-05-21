// Supabase Edge Function: FBR sandbox proxy.
// Deploy with: supabase functions deploy fbr-proxy --no-verify-jwt
// Set the secret: supabase secrets set FBR_TOKEN=d9defe7b-a7af-355f-9b8c-95b4e0d487d9
// Optional:     supabase secrets set FBR_BASE=https://gw.fbr.gov.pk

// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

const FBR_BASE  = Deno.env.get('FBR_BASE')  || 'https://gw.fbr.gov.pk'
const FBR_TOKEN = Deno.env.get('FBR_TOKEN') || ''

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { method = 'POST', path = '/di_data/v1/di/postinvoicedata_sb', payload } = await req.json()

    const url = `${FBR_BASE}${path}`
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${FBR_TOKEN}`,
      },
      body: method === 'GET' ? undefined : JSON.stringify(payload || {}),
    })
    const text = await res.text()
    let body: any
    try { body = JSON.parse(text) } catch { body = { raw: text } }

    return new Response(JSON.stringify(body), {
      status:  res.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status:  500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
