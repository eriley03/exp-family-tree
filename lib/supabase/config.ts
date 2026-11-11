const PLACEHOLDER_URL = "your-project-ref";
const PLACEHOLDER_KEY = "your-anon-key";

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

export function getSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    ""
  );
}

export function isSupabaseConfigured() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  if (!url || !key) return false;
  if (url.includes(PLACEHOLDER_URL) || key.includes(PLACEHOLDER_KEY)) return false;
  if (key.length < 20) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function publicAvatarUrl(path: string | null) {
  if (!path || !isSupabaseConfigured()) return null;
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${getSupabaseUrl().replace(/\/$/, "")}/storage/v1/object/public/avatars/${encoded}`;
}
