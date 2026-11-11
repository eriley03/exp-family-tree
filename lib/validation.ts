const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requiredText(
  value: FormDataEntryValue | null,
  label: string,
  max: number,
): { ok: true; value: string } | { ok: false; error: string } {
  const text = String(value ?? "").trim().replace(/\s+/g, " ");
  if (!text) return { ok: false, error: `${label} is required.` };
  if (text.length > max) {
    return { ok: false, error: `${label} must be ${max} characters or fewer.` };
  }
  return { ok: true, value: text };
}

export function optionalText(value: FormDataEntryValue | null, max: number) {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

export function multilineText(value: FormDataEntryValue | null, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export function isEmail(value: string) {
  return value.length <= 320 && EMAIL_PATTERN.test(value);
}

export function safeNextPath(value: string | null | undefined, fallback = "/account") {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  if (value.startsWith("/login") || value.startsWith("/signup") || value.startsWith("/auth")) {
    return fallback;
  }
  return value;
}

export function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function sanitizeSearch(value: string) {
  return value.replace(/[%_,().*\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

export function checked(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}
