import { createClient, SupabaseClient } from "@supabase/supabase-js";

let browserClientInstance: SupabaseClient | null = null;

/**
 * Returns a Supabase client for browser/client-side use.
 * Evaluates environment variables at call time, avoiding build-time initialization errors.
 */
export const getSupabaseBrowserClient = (): SupabaseClient => {
  if (browserClientInstance) {
    return browserClientInstance;
  }

  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const rawAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  const supabaseUrl = rawUrl.replace(/\/+$/, "");
  const supabaseAnonKey = rawAnonKey;

  // Use fallback values during build/SSR if env is not yet populated to prevent createClient from throwing
  const url = supabaseUrl || "https://placeholder.supabase.co";
  const key = supabaseAnonKey || "placeholder-anon-key";

  browserClientInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClientInstance;
};

/**
 * Proxy wrapper so existing `import { supabase } from "@/lib/supabase"` continues
 * to work without executing createClient() at module load time.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseBrowserClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export { getServiceRoleClient } from "./supabase-server";
