"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { initialFormState, type FormState } from "@/lib/types";
import { isEmail, optionalText, requiredText } from "@/lib/validation";

export async function submitJoinLead(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (String(formData.get("company_website") ?? "").trim()) {
    return { ok: true, error: "", message: "Thanks. Your note was received." };
  }

  if (!isSupabaseConfigured()) {
    return {
      ...initialFormState,
      error: "Supabase is not connected yet, so this interest form cannot be saved.",
    };
  }

  const name = requiredText(formData.get("full_name"), "Name", 120);
  if (!name.ok) return { ...initialFormState, error: name.error };
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isEmail(email)) return { ...initialFormState, error: "Enter a valid email address." };

  const supabase = await createClient();
  const { error } = await supabase.from("join_leads").insert({
    full_name: name.value,
    email,
    phone: optionalText(formData.get("phone"), 40),
    city: optionalText(formData.get("city"), 80),
    state: optionalText(formData.get("state"), 80),
    current_brokerage: optionalText(formData.get("current_brokerage"), 160),
    message: String(formData.get("message") ?? "").trim().slice(0, 4000),
    status: "new",
  });

  if (error) {
    const friendly = error.message.includes("already saved")
      ? error.message
      : "The form could not be saved. Please try again in a moment.";
    return { ...initialFormState, error: friendly };
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return {
    ok: true,
    error: "",
    message: "Thank you. Your interest is saved, and someone from Family Tree will follow up.",
    savedAt: Date.now(),
  };
}
