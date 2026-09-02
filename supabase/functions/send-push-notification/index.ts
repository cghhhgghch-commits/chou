import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');

if (!supabaseUrl || !serviceRoleKey || !fcmServerKey) {
  console.error('Missing required env vars');
}

serve(async (req) => {
  try {
    const { user_id, title, body, data = {} } = await req.json();

    if (!user_id || !title || !body) {
      return new Response(JSON.stringify({ error: 'Missing required payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tokenResponse = await fetch(`${supabaseUrl}/rest/v1/fcm_tokens?select=token&user_id=eq.${user_id}&is_active=eq.true`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    const tokenRows = await tokenResponse.json();
    const tokens = (Array.isArray(tokenRows) ? tokenRows : []).map((row) => row.token).filter(Boolean);

    if (!tokens.length) {
      return new Response(JSON.stringify({ sent: 0, message: 'No tokens found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${fcmServerKey}`,
      },
      body: JSON.stringify({
        registration_ids: tokens,
        notification: {
          title,
          body,
        },
        data: {
          ...data,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
        android: {
          priority: 'high',
          notification: {
            channel_id: 'laqta_default'
          }
        },
      }),
    });

    const payload = await response.json();

    return new Response(JSON.stringify({
      sent: tokens.length,
      status: response.status,
      payload,
    }), {
      status: response.ok ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('send-push-notification error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
