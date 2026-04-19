import { createServerClient } from '@supabase/ssr'
import type { Database } from './database.types'

type CookieOptions = {
  name: string
  value: string
  options: Record<string, unknown>
}

/**
 * Creates a Supabase client for use in Next.js Server Components, Route Handlers,
 * and Server Actions. Requires cookie functions to be passed in for SSR compatibility.
 */
export function createSupabaseServerClient(
  cookieStore: {
    get: (name: string) => { value: string } | undefined
    set: (opts: CookieOptions) => void
  }
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // The cookie store API varies between Next.js versions; this works for Next 14+
        return []
      },
      setAll(cookiesToSet: CookieOptions[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set({ name, value, options })
          )
        } catch {
          // Ignore errors in Server Components (cookies can only be set in Server Actions / Route Handlers)
        }
      },
    },
  })
}

/**
 * Creates a Supabase admin client using the service role key.
 * NEVER expose this client to the browser.
 */
export function createSupabaseAdminClient() {
  // Dynamic import to avoid bundling service-role client into browser bundles
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient } = require('@supabase/supabase-js') as typeof import('@supabase/supabase-js')
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
