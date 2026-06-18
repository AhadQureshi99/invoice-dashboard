// Supabase Edge Function: FBR proxy (sandbox or production).
// Deploy with: supabase functions deploy fbr-proxy --no-verify-jwt
// Set the secret: supabase secrets set FBR_TOKEN=<your-fbr-token>
// Optional:      supabase secrets set FBR_BASE=https://gw.fbr.gov.pk
// NOTE: the production/sandbox endpoint (…postinvoicedata vs …_sb) is chosen
// by the frontend via VITE_FBR_MODE and passed in as `path`.

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
    // `token` lets each seller file with their own FBR token (multi-company).
    // Falls back to the FBR_TOKEN secret when no per-seller token is supplied.
    const { method = 'POST', path = '/di_data/v1/di/postinvoicedata_sb', payload, token } = await req.json()
    const authToken = token || FBR_TOKEN

    const url = `${FBR_BASE}${path}`
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${authToken}`,
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
