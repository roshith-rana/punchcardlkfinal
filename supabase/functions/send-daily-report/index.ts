// Edge Function: send-daily-report
//
// Purpose: Generate and email daily activity reports to business report recipients.
//
// Trigger: Call from a cron job (e.g. every day at 08:00 Sri Lanka time, UTC+5:30 → 02:30 UTC)
//   Schedule: "30 2 * * *"
//
// TODO (Phase 2):
//   1. Query daily_reports for report_date = yesterday
//   2. If no report exists, generate it from transactions table
//   3. Fetch report_recipients for each business
//   4. Send email via Resend / SendGrid / SES
//   5. Update daily_reports.sent_at
//
// Environment variables required:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   EMAIL_API_KEY (Resend/SendGrid key)
//   EMAIL_FROM_ADDRESS (e.g. reports@punchcardlk.com)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // TODO: Implement daily report generation and email dispatch
  console.log('send-daily-report: function invoked (stub)')

  return new Response(
    JSON.stringify({ message: 'Daily report function stub — not yet implemented' }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  )
})
