import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Singleton instance (client-side)
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

// Factory function (kept for existing pages)
export function createClient() {
  if (typeof window === 'undefined') {
    // Server-side: always create a new client
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  // Client-side: reuse singleton
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  return supabaseInstance
}

// ✅ Named export for files that import { supabase }
export const supabase = createClient()