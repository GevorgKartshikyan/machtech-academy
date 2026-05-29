import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Public client — uses anon key, respects RLS. Use for read-only operations. */
export const supabasePublic = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: false }
});

/**
 * Server-only client — bypasses RLS via service role key.
 * NEVER import this in client components. Only use in:
 *   - API routes (/app/api/...)
 *   - Server actions
 *   - Server components (sparingly, only when needed)
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
});
