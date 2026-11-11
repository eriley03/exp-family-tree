import { cache } from "react";
import { redirect } from "next/navigation";
import type { AppRole, Viewer } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function asRole(value: unknown): AppRole {
  return value === "admin" ? "admin" : "member";
}

export const getViewer = cache(async (): Promise<Viewer | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const claims = data?.claims;
    if (error || !claims?.sub) return null;

    const id = claims.sub;
    const claimEmail = typeof claims.email === "string" ? claims.email : "";
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, email")
      .eq("id", id)
      .maybeSingle();

    const row = profile as { role?: string; full_name?: string; email?: string } | null;

    return {
      id,
      email: row?.email || claimEmail,
      role: asRole(row?.role),
      fullName: row?.full_name ?? "",
    };
  } catch {
    return null;
  }
});

export async function requireViewer(nextPath: string) {
  if (!isSupabaseConfigured()) return null;
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return viewer;
}
