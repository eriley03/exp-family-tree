"use server";

import { revalidatePath } from "next/cache";
import { getViewer } from "@/lib/auth";
import { contentTypeFor, fileExtension, resourceTypes } from "@/lib/files";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { initialFormState, type FormState } from "@/lib/types";
import { centralInputToIso } from "@/lib/time";
import {
  checked,
  isUuid,
  multilineText,
  normalizeUrl,
  optionalText,
  requiredText,
} from "@/lib/validation";

function failure(error: string): FormState {
  return { ...initialFormState, error };
}

async function adminClient() {
  if (!isSupabaseConfigured()) return { error: "Supabase is not connected yet.", supabase: null, userId: "" };
  const viewer = await getViewer();
  if (!viewer) return { error: "Sign in required.", supabase: null, userId: "" };
  if (viewer.role !== "admin") return { error: "Admin access is required.", supabase: null, userId: "" };
  const supabase = await createClient();
  return { error: "", supabase, userId: viewer.id };
}

function refreshContent() {
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/events");
  revalidatePath("/admin/resources");
  revalidatePath("/events");
  revalidatePath("/resources");
}

function readEvent(formData: FormData) {
  const title = requiredText(formData.get("title"), "Title", 160);
  if (!title.ok) return title;
  const starts = centralInputToIso(String(formData.get("starts_at") ?? ""));
  if (!starts) return { ok: false as const, error: "Choose a start date and time." };
  const endRaw = String(formData.get("ends_at") ?? "");
  const ends = endRaw ? centralInputToIso(endRaw) : null;
  if (endRaw && !ends) return { ok: false as const, error: "The end time is not valid." };
  if (ends && Date.parse(ends) < Date.parse(starts)) {
    return { ok: false as const, error: "The end time has to be after the start." };
  }
  const eventType = String(formData.get("event_type") ?? "call");
  if (eventType !== "call" && eventType !== "event" && eventType !== "training") {
    return { ok: false as const, error: "Choose a type." };
  }
  const joinInput = optionalText(formData.get("join_url"), 500);
  const joinUrl = joinInput ? normalizeUrl(joinInput) : "";
  if (joinUrl === null) return { ok: false as const, error: "The join link needs to be a valid web address." };

  return {
    ok: true as const,
    value: {
      title: title.value,
      description: multilineText(formData.get("description"), 4000),
      starts_at: starts,
      ends_at: ends,
      location: optionalText(formData.get("location"), 200),
      event_type: eventType,
      join_url: joinUrl,
      published: checked(formData.get("published")),
    },
  };
}

export async function createEvent(_prev: FormState, formData: FormData): Promise<FormState> {
  const gate = await adminClient();
  if (!gate.supabase) return failure(gate.error);
  const parsed = readEvent(formData);
  if (!parsed.ok) return failure(parsed.error);
  const { error } = await gate.supabase.from("events").insert({
    ...parsed.value,
    created_by: gate.userId,
  });
  if (error) return failure("The event could not be saved.");
  refreshContent();
  return { ok: true, error: "", message: "Event saved.", savedAt: Date.now() };
}

export async function updateEvent(_prev: FormState, formData: FormData): Promise<FormState> {
  const gate = await adminClient();
  if (!gate.supabase) return failure(gate.error);
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) return failure("That event could not be found.");
  const parsed = readEvent(formData);
  if (!parsed.ok) return failure(parsed.error);
  const { error } = await gate.supabase.from("events").update(parsed.value).eq("id", id);
  if (error) return failure("The event could not be updated.");
  refreshContent();
  return { ok: true, error: "", message: "Event updated.", savedAt: Date.now() };
}

export async function deleteEvent(formData: FormData) {
  const gate = await adminClient();
  if (!gate.supabase) return;
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) return;
  await gate.supabase.from("events").delete().eq("id", id);
  refreshContent();
}

export async function updateLeadStatus(_prev: FormState, formData: FormData): Promise<FormState> {
  const gate = await adminClient();
  if (!gate.supabase) return failure(gate.error);
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!isUuid(id) || !["new", "contacted", "closed"].includes(status)) {
    return failure("Choose a valid status.");
  }
  const { error } = await gate.supabase.from("join_leads").update({ status }).eq("id", id);
  if (error) return failure("The lead could not be updated.");
  refreshContent();
  return { ok: true, error: "", message: "Status saved.", savedAt: Date.now() };
}

async function uploadResourceFile(
  supabase: NonNullable<Awaited<ReturnType<typeof adminClient>>["supabase"]>,
  file: File,
) {
  if (file.size > 20 * 1024 * 1024) return { error: "Files need to be 20 MB or smaller.", path: "" };
  const extension = fileExtension(file, resourceTypes);
  const contentType = contentTypeFor(file, resourceTypes);
  if (!extension || !contentType) {
    return { error: "Use a PDF, Office file, text file, CSV, or image.", path: "" };
  }
  const path = `${crypto.randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage.from("resources").upload(path, bytes, {
    contentType,
    upsert: false,
  });
  if (error) return { error: "The file could not be uploaded.", path: "" };
  return { error: "", path };
}

function readResourceMeta(formData: FormData) {
  const title = requiredText(formData.get("title"), "Title", 160);
  if (!title.ok) return title;
  const category = requiredText(formData.get("category"), "Category", 80);
  if (!category.ok) return category;
  const kind = String(formData.get("kind") ?? "");
  if (kind !== "link" && kind !== "file") return { ok: false as const, error: "Choose a link or a file." };
  const urlInput = optionalText(formData.get("url"), 500);
  const url = kind === "link" ? normalizeUrl(urlInput) : "";
  if (kind === "link" && !url) return { ok: false as const, error: "Add the link address." };
  return {
    ok: true as const,
    value: {
      title: title.value,
      description: multilineText(formData.get("description"), 2000),
      category: category.value,
      kind,
      url: url || "",
      published: checked(formData.get("published")),
    },
  };
}

export async function createResource(_prev: FormState, formData: FormData): Promise<FormState> {
  const gate = await adminClient();
  if (!gate.supabase) return failure(gate.error);
  const parsed = readResourceMeta(formData);
  if (!parsed.ok) return failure(parsed.error);

  let storagePath: string | null = null;
  if (parsed.value.kind === "file") {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) return failure("Choose a file to upload.");
    const uploaded = await uploadResourceFile(gate.supabase, file);
    if (uploaded.error) return failure(uploaded.error);
    storagePath = uploaded.path;
  }

  const { error } = await gate.supabase.from("resources").insert({
    ...parsed.value,
    url: parsed.value.kind === "link" ? parsed.value.url : "",
    storage_path: storagePath,
    created_by: gate.userId,
  });
  if (error) {
    if (storagePath) await gate.supabase.storage.from("resources").remove([storagePath]);
    return failure("The resource could not be saved.");
  }
  refreshContent();
  return { ok: true, error: "", message: "Resource saved.", savedAt: Date.now() };
}

export async function updateResource(_prev: FormState, formData: FormData): Promise<FormState> {
  const gate = await adminClient();
  if (!gate.supabase) return failure(gate.error);
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) return failure("That resource could not be found.");
  const parsed = readResourceMeta(formData);
  if (!parsed.ok) return failure(parsed.error);

  const { data: existing } = await gate.supabase
    .from("resources")
    .select("storage_path, kind")
    .eq("id", id)
    .maybeSingle();
  const current = existing as { storage_path: string | null; kind: string } | null;
  if (!current) return failure("That resource could not be found.");

  let storagePath = parsed.value.kind === "file" ? current.storage_path : null;
  const file = formData.get("file");
  if (parsed.value.kind === "file" && file instanceof File && file.size > 0) {
    const uploaded = await uploadResourceFile(gate.supabase, file);
    if (uploaded.error) return failure(uploaded.error);
    storagePath = uploaded.path;
  }
  if (parsed.value.kind === "file" && !storagePath) return failure("Choose a file to upload.");

  const { error } = await gate.supabase
    .from("resources")
    .update({
      ...parsed.value,
      url: parsed.value.kind === "link" ? parsed.value.url : "",
      storage_path: storagePath,
    })
    .eq("id", id);
  if (error) {
    if (storagePath && storagePath !== current.storage_path) {
      await gate.supabase.storage.from("resources").remove([storagePath]);
    }
    return failure("The resource could not be updated.");
  }
  if (current.storage_path && current.storage_path !== storagePath) {
    await gate.supabase.storage.from("resources").remove([current.storage_path]);
  }
  refreshContent();
  return { ok: true, error: "", message: "Resource updated.", savedAt: Date.now() };
}

export async function deleteResource(formData: FormData) {
  const gate = await adminClient();
  if (!gate.supabase) return;
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) return;
  const { data } = await gate.supabase.from("resources").select("storage_path").eq("id", id).maybeSingle();
  const row = data as { storage_path: string | null } | null;
  await gate.supabase.from("resources").delete().eq("id", id);
  if (row?.storage_path) await gate.supabase.storage.from("resources").remove([row.storage_path]);
  refreshContent();
}
