/**
 * Format a date string to a human-readable format.
 * @param date ISO date string or Date object
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a Sri Lankan phone number to E.164 format.
 * Handles formats: 0771234567, 771234567, +94771234567, 0094771234567
 */
export function formatPhoneNumberSL(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('94') && cleaned.length === 11) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('0094') && cleaned.length === 13) {
    return `+${cleaned.slice(2)}`;
  }
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+94${cleaned.slice(1)}`;
  }
  if (cleaned.length === 9) {
    return `+94${cleaned}`;
  }

  return phone; // Return as-is if format is unrecognised
}

/**
 * Validate a Sri Lankan mobile number (basic format check).
 */
export function isValidSLPhone(phone: string): boolean {
  const e164 = formatPhoneNumberSL(phone);
  // Sri Lankan mobile numbers: +94 7x xxxxxxx (10 digits after country code)
  return /^\+94[0-9]{9}$/.test(e164);
}

/**
 * Format a timestamp to a relative time string (e.g. "2 hours ago").
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}
