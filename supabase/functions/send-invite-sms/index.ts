// Edge Function: send-invite-sms
//
// Purpose: Send an SMS invite when a business admin adds a new customer.
//
// Trigger: Called from the admin web app when adding a customer manually.
//
// Request body:
//   { phone: string, businessName: string, inviteUrl?: string }
//
// TODO (Phase 2):
//   1. Validate request body
//   2. Format invite message
//   3. Call the SMS provider API (Dialog / Mobitel / Twilio)
//   4. Log the invite in a future invites table
//
// Environment variables required:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   SMS_API_KEY
//   SMS_SENDER_ID

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { phone, businessName } = await req.json()

  // TODO: Replace with actual SMS provider call
  console.log(`send-invite-sms: would send invite to ${phone} for ${businessName}`)

  return new Response(
    JSON.stringify({ message: 'Invite SMS stub — not yet implemented', phone, businessName }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  )
})
