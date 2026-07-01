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

import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: authError?.message || 'Unauthorized' }, { status: 401 })
  }

  // Fetch their profile
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json({ profile: data })
}
