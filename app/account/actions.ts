"use server";

import { revalidatePath } from "next/cache";
import { getViewer } from "@/lib/auth";
import { avatarTypes, contentTypeFor, fileExtension } from "@/lib/files";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { initialFormState, type FormState } from "@/lib/types";
import { checked, multilineText, normalizeUrl, optionalText, requiredText } from "@/lib/validation";

function failure(error: string): FormState {
  return { ...initialFormState, error };
}

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return failure("Supabase is not connected yet.");
  const viewer = await getViewer();
  if (!viewer) return failure("Sign in to update your profile.");

  const name = requiredText(formData.get("full_name"), "Name", 120);
  if (!name.ok) return failure(name.error);
  const websiteInput = optionalText(formData.get("website"), 300);
  const website = normalizeUrl(websiteInput);
  if (website === null) return failure("Enter a valid website, or leave it blank.");

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("profiles")
    .select("avatar_path")
    .eq("id", viewer.id)
    .maybeSingle();
  const previous = existing as { avatar_path: string | null } | null;

  let avatarPath = previous?.avatar_path ?? null;
  const file = formData.get("avatar");
  if (file instanceof File && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) return failure("Use a photo smaller than 5 MB.");
    const extension = fileExtension(file, avatarTypes);
    const contentType = contentTypeFor(file, avatarTypes);
    if (!extension || !contentType) return failure("Use a JPG, PNG, or WebP photo.");
    const path = `${viewer.id}/avatar-${Date.now()}.${extension}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, bytes, {
      contentType,
      upsert: false,
    });
    if (uploadError) return failure("The photo could not be uploaded.");
    avatarPath = path;
  }

  const payload = {
    full_name: name.value,
    city: optionalText(formData.get("city"), 80),
    state: optionalText(formData.get("state"), 80),
    bio: multilineText(formData.get("bio"), 2000),
    website,
    show_email: checked(formData.get("show_email")),
    directory_visible: checked(formData.get("directory_visible")),
    avatar_path: avatarPath,
  };
  const phone = optionalText(formData.get("phone"), 40);

  const profileQuery = previous
    ? supabase.from("profiles").update(payload).eq("id", viewer.id)
    : supabase.from("profiles").insert({ id: viewer.id, email: viewer.email, ...payload });
  const { error } = await profileQuery;
  if (!error) {
    const { error: phoneError } = await supabase
      .from("profile_private")
      .upsert({ profile_id: viewer.id, phone }, { onConflict: "profile_id" });
    if (phoneError) return failure("The profile saved, but the phone number did not.");
  }

  if (error) {
    if (avatarPath && avatarPath !== previous?.avatar_path) {
      await supabase.storage.from("avatars").remove([avatarPath]);
    }
    return failure("The profile could not be saved.");
  }

  if (previous?.avatar_path && avatarPath && previous.avatar_path !== avatarPath) {
    await supabase.storage.from("avatars").remove([previous.avatar_path]);
  }

  revalidatePath("/account");
  revalidatePath("/directory");
  revalidatePath(`/members/${viewer.id}`);
  return { ok: true, error: "", message: "Profile saved.", savedAt: Date.now() };
}
