const AVATAR_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const RESOURCE_TYPES: Record<string, string> = {
  ...AVATAR_TYPES,
  pdf: "application/pdf",
  txt: "text/plain",
  csv: "text/csv",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export function fileExtension(file: File, allowed: Record<string, string>) {
  const fromName = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (allowed[fromName]) return fromName === "jpeg" ? "jpg" : fromName;
  const fromType = Object.entries(allowed).find(([, mime]) => mime === file.type)?.[0];
  if (!fromType) return "";
  return fromType === "jpeg" ? "jpg" : fromType;
}

export function contentTypeFor(file: File, allowed: Record<string, string>) {
  if (file.type && Object.values(allowed).includes(file.type)) return file.type;
  const extension = fileExtension(file, allowed);
  return extension ? allowed[extension] ?? allowed[extension === "jpg" ? "jpeg" : extension] : "";
}

export const avatarTypes = AVATAR_TYPES;
export const resourceTypes = RESOURCE_TYPES;
