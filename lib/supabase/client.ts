/**
 * Supabase browser client — safe for use in Client Components ('use client').
 *
 * Uses the legacy @supabase/supabase-js NEXT_PUBLIC_ vars since
 * @supabase/server handles server-side auth automatically.
 *
 * Usage:
 *   import { supabase } from "@/lib/supabase/client"
 *   const { data } = await supabase.from("todos").select()
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local"
  )
}

// Singleton — reuse the same client across the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
