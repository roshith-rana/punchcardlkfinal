/**
 * Notification service abstraction layer.
 *
 * This module provides a provider-agnostic interface for sending OTPs and SMS
 * messages. The concrete implementation is intentionally stubbed — swap the
 * provider by replacing the body of `sendOTP` and `sendSMS` below.
 *
 * Supported providers (choose one):
 *   - Dialog Axiata (https://www.dialog.lk/business/messaging)
 *   - Mobitel (https://www.mobitel.lk/business-solutions/sms)
 *   - Twilio (https://www.twilio.com/sms)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO ADD A NEW PROVIDER
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Add provider credentials to your .env file:
 *      SMS_PROVIDER=dialog|mobitel|twilio
 *      SMS_API_KEY=<your-api-key>
 *      SMS_SENDER_ID=<your-sender-id>   // e.g. "PUNCHCARD"
 *
 * 2. Install the provider's SDK or use fetch() against their REST API.
 *
 * 3. Replace the TODO block in `sendSMS` with the actual API call.
 *
 * 4. For OTP flows: Supabase phone auth generates and verifies OTPs natively.
 *    `sendOTP` here is only used if you later route OTP delivery through a
 *    custom SMS provider instead of Supabase's built-in Twilio integration.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send a one-time password to a mobile number.
 *
 * NOTE: When using Supabase phone auth, OTP delivery is handled by Supabase
 * (via its configured SMS provider). This function is provided as an escape
 * hatch for cases where you need to route OTP delivery through a custom
 * provider (e.g. Dialog or Mobitel for Sri Lanka local delivery).
 *
 * @param phone  E.164 formatted phone number, e.g. "+94771234567"
 * @param otp    6-digit OTP string
 */
export async function sendOTP(phone: string, otp: string): Promise<SMSResult> {
  const message = `Your PunchCard verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;
  return sendSMS(phone, message);
}

/**
 * Send an arbitrary SMS message.
 *
 * @param phone    E.164 formatted phone number, e.g. "+94771234567"
 * @param message  Message body (max 160 chars for single SMS)
 */
export async function sendSMS(phone: string, message: string): Promise<SMSResult> {
  // TODO: Replace this stub with your chosen provider's API call.
  //
  // Example (Twilio):
  //   const client = twilio(process.env.SMS_API_KEY!, process.env.SMS_API_SECRET!);
  //   const msg = await client.messages.create({
  //     body: message,
  //     from: process.env.SMS_SENDER_ID!,
  //     to: phone,
  //   });
  //   return { success: true, messageId: msg.sid };
  //
  // Example (Dialog REST API — hypothetical):
  //   const res = await fetch('https://api.dialog.lk/sms/send', {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${process.env.SMS_API_KEY}` },
  //     body: JSON.stringify({ to: phone, message, senderId: process.env.SMS_SENDER_ID }),
  //   });
  //   const data = await res.json();
  //   return { success: res.ok, messageId: data.id };

  console.warn('[notifications] SMS provider not configured. Message not sent.', { phone, message });
  return { success: false, error: 'SMS provider not configured' };
}
