import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const firebaseServiceAccountJson = Deno.env.get('FIREBASE_SERVICE_ACCOUNT_JSON');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

if (!supabaseUrl || !serviceRoleKey || !firebaseServiceAccountJson) {
  console.error('Missing required env vars');
}

const encodeBase64Url = (value: string | Uint8Array) => {
  const encoded = typeof value === 'string'
    ? btoa(unescape(encodeURIComponent(value)))
    : btoa(String.fromCharCode(...value));
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const pemToArrayBuffer = (pem: string) => {
  const base64 = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
  const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  return bytes.buffer;
};

const getFcmAccessToken = async (serviceAccount: { client_email: string; private_key: string }) => {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = encodeBase64Url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const unsignedToken = `${header}.${claim}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(serviceAccount.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsignedToken),
  );
  const assertion = `${unsignedToken}.${encodeBase64Url(new Uint8Array(signature))}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const tokenData = await response.json();
  if (!response.ok || !tokenData.access_token) throw new Error('Unable to obtain Firebase access token');
  return tokenData.access_token as string;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const authorization = req.headers.get('Authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: serviceRoleKey, Authorization: authorization },
    });
    if (!userResponse.ok) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const authenticatedUser = await userResponse.json();
    const adminResponse = await fetch(
      `${supabaseUrl}/rest/v1/admins?select=id&user_id=eq.${encodeURIComponent(authenticatedUser.id)}&is_admin=eq.true`,
      { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } },
    );
    const admins = await adminResponse.json();
    if (!Array.isArray(admins) || admins.length === 0) {
      return new Response(JSON.stringify({ error: 'Admin permission required' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (!title || !message || title.length > 80 || message.length > 500) {
      return new Response(JSON.stringify({ error: 'Title and message are required and must be within the allowed length' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const serviceAccount = JSON.parse(firebaseServiceAccountJson || '{}') as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };
    if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
      return new Response(JSON.stringify({ error: 'Firebase service account is not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const accessToken = await getFcmAccessToken({
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key,
    });
    const data = { type: 'admin_announcement' };

    const tokenQuery = 'select=token&is_active=eq.true';
    const tokenResponse = await fetch(`${supabaseUrl}/rest/v1/fcm_tokens?${tokenQuery}`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    const tokenRows = await tokenResponse.json();
    const tokens = [...new Set((Array.isArray(tokenRows) ? tokenRows : []).map((row) => row.token).filter(Boolean))];

    if (!tokens.length) {
      return new Response(JSON.stringify({ sent: 0, message: 'No tokens found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results: Array<{ token: string; status: number; payload: unknown }> = [];
    for (const token of tokens) {
      const response = await fetch(`https://fcm.googleapis.com/v1/projects/${encodeURIComponent(serviceAccount.project_id)}/messages:send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          message: {
            token,
            notification: { title, body: message },
            data,
            android: { priority: 'high', notification: { channel_id: 'laqta_default' } },
          },
        }),
      });
      results.push({ token, status: response.status, payload: await response.json() });
    }

    return new Response(JSON.stringify({
      sent: results.filter((result) => result.status >= 200 && result.status < 300).length,
      attempted: tokens.length,
      failed: results.filter((result) => result.status < 200 || result.status >= 300).length,
    }), {
      status: results.some((result) => result.status >= 200 && result.status < 300) ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('send-push-notification error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
