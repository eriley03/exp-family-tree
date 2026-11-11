import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SetupNotice } from "@/components/setup-notice";
import { requireViewer } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Resource, ResourceWithLink } from "@/lib/types";

export const metadata: Metadata = {
  title: "Resources",
  robots: { index: false, follow: false },
};

export default async function ResourcesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="shell py-14">
        <PageHeader eyebrow="Members" title="Resource library">
          <p>Links and files shared with signed-in members will be listed here.</p>
        </PageHeader>
        <div className="mt-8">
          <SetupNotice />
        </div>
      </div>
    );
  }

  if (!(await requireViewer("/resources"))) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("id, title, description, kind, url, storage_path, category, published, created_by, created_at, updated_at")
    .eq("published", true)
    .order("category", { ascending: true })
    .order("title", { ascending: true });

  const rows = (data ?? []) as Resource[];
  const resources: ResourceWithLink[] = await Promise.all(
    rows.map(async (resource) => {
      if (resource.kind !== "file" || !resource.storage_path) {
        return { ...resource, downloadUrl: null };
      }
      const { data: signed } = await supabase.storage
        .from("resources")
        .createSignedUrl(resource.storage_path, 60 * 60);
      return { ...resource, downloadUrl: signed?.signedUrl ?? null };
    }),
  );

  const groups = new Map<string, ResourceWithLink[]>();
  for (const resource of resources) {
    groups.set(resource.category, [...(groups.get(resource.category) ?? []), resource]);
  }

  return (
    <div className="shell py-14">
      <PageHeader eyebrow="Members" title="Resource library">
        <p>Links and files published by an admin. File links expire after one hour, so refresh the page if a download stops working.</p>
      </PageHeader>
      {error ? <p className="alert mt-8">The library could not be loaded.</p> : null}
      {resources.length === 0 ? (
        <p className="mt-8 text-ink-soft">Nothing has been published yet.</p>
      ) : (
        <div className="mt-10 space-y-10">
          {[...groups.entries()].map(([category, items]) => (
            <section key={category}>
              <h2 className="font-serif text-3xl text-forest">{category}</h2>
              <ul className="mt-4 grid gap-4 md:grid-cols-2">
                {items.map((resource) => {
                  const href = resource.kind === "link" ? resource.url : resource.downloadUrl;
                  return (
                    <li key={resource.id} className="card p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                        {resource.kind === "file" ? "File" : "Link"}
                      </p>
                      <h3 className="mt-1 font-serif text-2xl text-ink">{resource.title}</h3>
                      {resource.description ? (
                        <p className="mt-2 leading-relaxed text-ink-soft">{resource.description}</p>
                      ) : null}
                      {href ? (
                        <a href={href} className="mt-4 inline-flex font-semibold text-forest" target="_blank" rel="noreferrer">
                          {resource.kind === "file" ? "Download" : "Open link"}
                        </a>
                      ) : (
                        <p className="mt-4 text-sm text-clay">This file is missing a download link.</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
