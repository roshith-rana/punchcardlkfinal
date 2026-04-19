import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

/**
 * Creates a Supabase client for use in browser/client components.
 * Safe to use in React Client Components.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
