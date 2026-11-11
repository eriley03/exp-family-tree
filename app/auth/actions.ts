"use server";

import { redirect } from "next/navigation";
import { getRequestOrigin } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { initialFormState, type FormState } from "@/lib/types";
import { isEmail, requiredText, safeNextPath } from "@/lib/validation";

function failure(error: string): FormState {
  return { ...initialFormState, error };
}

export async function signInWithPassword(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured()) return failure("Supabase is not connected yet.");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? ""));
  if (!isEmail(email) || password.length < 8) {
    return failure("Enter a valid email and a password of at least 8 characters.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return failure(error.message);
  redirect(next);
}

export async function signUpWithPassword(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured()) return failure("Supabase is not connected yet.");

  const name = requiredText(formData.get("full_name"), "Name", 120);
  if (!name.ok) return failure(name.error);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? ""));
  if (!isEmail(email)) return failure("Enter a valid email address.");
  if (password.length < 8) return failure("Use a password of at least 8 characters.");
  if (password !== confirm) return failure("Those passwords do not match.");

  const origin = await getRequestOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      data: { full_name: name.value },
    },
  });
  if (error) return failure(error.message);
  if (data.session) redirect(next);
  return {
    ok: true,
    error: "",
    message: "Check your email to confirm the account. Then come back and sign in.",
  };
}

export async function sendMagicLink(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured()) return failure("Supabase is not connected yet.");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("full_name") ?? "").trim();
  const next = safeNextPath(String(formData.get("next") ?? ""));
  if (!isEmail(email)) return failure("Enter the email address to send the link to.");

  const origin = await getRequestOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      shouldCreateUser: true,
      data: name ? { full_name: name.slice(0, 120) } : undefined,
    },
  });
  if (error) return failure(error.message);
  return {
    ok: true,
    error: "",
    message: "Check your email for a sign-in link. It expires after a short time.",
  };
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
