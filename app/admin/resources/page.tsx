import type { Metadata } from "next";
import { deleteResource } from "@/app/admin/actions";
import { CreateResourceForm, EditResourceForm } from "@/components/admin-forms";
import { ConfirmDelete } from "@/components/confirm-delete";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Resource } from "@/lib/types";

export const metadata: Metadata = {
  title: "Manage resources",
  robots: { index: false, follow: false },
};

export default async function AdminResourcesPage() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("id, title, description, kind, url, storage_path, category, published, created_by, created_at, updated_at")
    .order("created_at", { ascending: false });
  const resources = (data ?? []) as Resource[];

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-serif text-4xl text-forest">Resources</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Links open as entered. Files are stored in the private resources bucket and downloaded
          by signed-in members through a temporary link.
        </p>
      </div>
      <CreateResourceForm />
      {error ? <p className="alert">Resources could not be loaded.</p> : null}
      <ul className="space-y-3">
        {resources.map((resource) => (
          <li key={resource.id} className="card p-5">
            <details>
              <summary className="cursor-pointer">
                <span className="font-serif text-2xl text-forest">{resource.title}</span>
                <span className="mt-1 block text-sm text-ink-soft">
                  {resource.category} · {resource.kind} · {resource.published ? "Visible" : "Hidden"}
                </span>
              </summary>
              <EditResourceForm resource={resource} />
              <ConfirmDelete
                action={deleteResource}
                id={resource.id}
                label="Delete resource"
                message="Delete this resource and its file, if it has one?"
              />
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
