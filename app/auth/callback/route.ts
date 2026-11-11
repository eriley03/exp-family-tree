import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/validation";

const OTP_TYPES = ["email", "signup", "magiclink", "recovery", "invite"] as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeNextPath(url.searchParams.get("next"));

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/login?error=setup", url.origin));
  }

  const supabase = await createClient();
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }

  if (tokenHash && type && OTP_TYPES.includes(type as (typeof OTP_TYPES)[number])) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as (typeof OTP_TYPES)[number],
      token_hash: tokenHash,
    });
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }

  return NextResponse.redirect(new URL("/login?error=link", url.origin));
}
