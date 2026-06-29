/**
 * Supabase Server SDK integration for Next.js App Router.
 *
 * Uses the @supabase/server package which automatically reads:
 *   - SUPABASE_URL
 *   - SUPABASE_PUBLISHABLE_KEY
 *   - SUPABASE_SECRET_KEY
 *   - SUPABASE_JWKS_URL
 *
 * Usage in a Route Handler (auth: "user" — requires a valid JWT):
 *   import { withSupabase } from "@/lib/supabase/server"
 *   export const GET = withSupabase({ auth: "user" }, async (_req, ctx) => {
 *     const { data } = await ctx.supabase.from("todos").select()
 *     return Response.json(data)
 *   })
 *
 * Auth modes:
 *   "user"        — validates the Bearer JWT; ctx.supabase is RLS-scoped to that user
 *   "publishable" — uses the publishable key (no user context, RLS applies to anon role)
 *   "secret"      — uses the secret key; ctx.supabaseAdmin bypasses RLS
 *   "none"        — no auth check; both clients available but no user context
 */

export { withSupabase } from "@supabase/server"
export type { SupabaseContext } from "@supabase/server"
