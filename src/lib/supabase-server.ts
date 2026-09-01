import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * Always initialized at request time, never at module evaluation time.
 */
export const getServiceRoleClient = (): SupabaseClient => {
  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const rawServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const supabaseUrl = rawUrl.replace(/\/+$/, "");

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL environment variable is required for Supabase server client."
    );
  }

  if (!rawServiceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY environment variable is required for Supabase server client."
    );
  }

  return createClient(supabaseUrl, rawServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
