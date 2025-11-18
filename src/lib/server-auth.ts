import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { cache } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Server-side Supabase instance with auth headers
export async function createSupabaseServerClient() {
  // Check if environment variables are available during runtime
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build time when env vars are not available
    return {
      from: (table: string) => ({
        select: () => ({ data: null, error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
      auth: {
        getUser: () => ({ data: { user: null }, error: null }),
      }
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          cache: "no-store",
        });
      },
    },
  });
}

// Server-side Supabase instance for admin functions (with service role key)
export async function createSupabaseAdminClient() {
  // In a real implementation, you would use the service role key
  // which allows bypassing RLS policies
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey || !supabaseUrl) {
    // Create a mock client for build time when env vars are not available
    return {
      from: (table: string) => ({
        select: () => ({ data: null, error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
      rpc: (fn: string) => ({ data: null, error: null }),
      auth: {
        getUser: () => ({ data: { user: null }, error: null }),
      }
    };
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    global: {
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  });
}