import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }

  return createBrowserClient(getSupabaseUrl(), getSupabaseKey());
}
