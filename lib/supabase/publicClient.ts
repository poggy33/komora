import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const PUBLIC_STORAGE_KEY = "komora-public-supabase-client";

const noopStorage = {
  getItem() {
    return null;
  },
  setItem() {},
  removeItem() {},
};

declare global {
  var __komoraPublicSupabaseClient:
    | SupabaseClient<Database>
    | undefined;
}

export function createPublicClient() {
  if (globalThis.__komoraPublicSupabaseClient) {
    return globalThis.__komoraPublicSupabaseClient;
  }

  globalThis.__komoraPublicSupabaseClient = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: PUBLIC_STORAGE_KEY,
        storage: noopStorage,
      },
    },
  );

  return globalThis.__komoraPublicSupabaseClient;
}