/**
 * Example Route Handler: GET /api/me
 *
 * Demonstrates all three @supabase/server auth modes.
 *
 * - auth: "user"        — requires a valid Bearer JWT; returns the signed-in user's profile
 * - auth: "publishable" — no auth check; RLS-scoped to the anon role
 * - auth: "secret"      — admin access, bypasses RLS via ctx.supabaseAdmin
 *
 * To protect this route remove the examples you don't need and keep only
 * the auth mode appropriate for your use case.
 */

import { withSupabase } from "@/lib/supabase/server"

// ── 1. Auth-protected route (most common) ─────────────────────────────────────
// Reads the calling user's own profile. If the JWT is missing or invalid,
// @supabase/server automatically returns a 401.
export const GET = withSupabase({ auth: "user" }, async (_req, ctx) => {
  const { data, error } = await ctx.supabase
    .from("profiles")
    .select("*")
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json({ profile: data })
})

// ── 2. Public route using publishable key ─────────────────────────────────────
// Uncomment to use instead of the route above.
// export const GET = withSupabase({ auth: "publishable" }, async (_req, ctx) => {
//   const { data } = await ctx.supabase.from("public_table").select()
//   return Response.json(data)
// })

// ── 3. Admin / service-role route ─────────────────────────────────────────────
// Uncomment to use instead of the route above.
// export const GET = withSupabase({ auth: "secret" }, async (_req, ctx) => {
//   // ctx.supabaseAdmin bypasses RLS — use only in trusted server contexts.
//   const { data } = await ctx.supabaseAdmin.from("any_table").select()
//   return Response.json(data)
// })
