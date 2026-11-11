export type AppRole = "member" | "admin";

export type Viewer = {
  id: string;
  email: string;
  role: AppRole;
  fullName: string;
};

export type FormState = {
  ok: boolean;
  error: string;
  message: string;
  savedAt?: number;
};

export const initialFormState: FormState = {
  ok: false,
  error: "",
  message: "",
};

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  city: string;
  state: string;
  bio: string;
  phone: string;
  website: string;
  avatar_path: string | null;
  show_email: boolean;
  directory_visible: boolean;
  role: AppRole;
  created_at: string;
  updated_at: string;
};

export type JoinLead = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  current_brokerage: string;
  message: string;
  status: "new" | "contacted" | "closed";
  created_at: string;
};

export type FamilyEvent = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string | null;
  location: string;
  event_type: "call" | "event" | "training";
  join_url: string;
  published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  kind: "link" | "file";
  url: string;
  storage_path: string | null;
  category: string;
  published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ResourceWithLink = Resource & {
  downloadUrl: string | null;
};
