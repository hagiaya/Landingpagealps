import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a mock supabase client during build time when env vars are not available
let clientInstance: any = null;

if (supabaseUrl && supabaseAnonKey) {
  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          cache: "no-store",
        });
      },
    },
  });
} else {
  // Create a mock client for build time when env vars are not available
  clientInstance = {
    from: (table: string) => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null }),
    }),
    rpc: (fn: string) => ({ data: [], error: null }),
    auth: {
      getUser: () => ({ data: { user: null }, error: null }),
    }
  };
}

export const supabase = clientInstance;