/**
 * Supabase lib barrel — import from "@/lib/supabase"
 *
 * Server Components / Route Handlers  →  use `withSupabase` from "@/lib/supabase/server"
 * Client Components                   →  use `supabase`      from "@/lib/supabase/client"
 *
 * We intentionally do NOT re-export both from this barrel to prevent
 * accidentally importing server-only code into client bundles.
 */

export { supabase } from "./client"
// Server exports live in ./server — import those directly in server-only files.
