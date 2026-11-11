import type { Metadata } from "next";
import { PersonCard } from "@/components/person-card";
import { PageHeader } from "@/components/page-header";
import { SetupNotice } from "@/components/setup-notice";
import { requireViewer } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { sanitizeSearch } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Directory",
  robots: { index: false, follow: false },
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = sanitizeSearch(params.q ?? "");

  if (!isSupabaseConfigured()) {
    return (
      <div className="shell py-14">
        <PageHeader eyebrow="Members" title="Directory">
          <p>Signed-in members will be able to find each other here.</p>
        </PageHeader>
        <div className="mt-8">
          <SetupNotice />
        </div>
      </div>
    );
  }

  if (!(await requireViewer("/directory"))) return null;
  const supabase = await createClient();
  let request = supabase
    .from("profiles")
    .select("id, full_name, city, state, bio, website, avatar_path, show_email, email, directory_visible, role, created_at, updated_at")
    .eq("directory_visible", true)
    .order("full_name", { ascending: true })
    .limit(300);

  if (query) {
    request = request.or(`full_name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`);
  }

  const { data, error } = await request;
  const profiles = (data ?? []) as Profile[];

  return (
    <div className="shell py-14">
      <PageHeader eyebrow="Members" title="Directory">
        <p>
          People who chose to be listed. Phone numbers stay on each person&apos;s private account
          page. Email shows only if they opted in.
        </p>
      </PageHeader>

      <form action="/directory" className="mt-8 flex max-w-xl gap-2">
        <label className="field flex-1">
          <span className="sr-only">Search members</span>
          <input className="input" name="q" defaultValue={query} placeholder="Search by name or place" />
        </label>
        <button type="submit" className="btn btn-primary self-end">
          Search
        </button>
      </form>

      {error ? <p className="alert mt-6">The directory could not be loaded.</p> : null}

      {profiles.length === 0 ? (
        <p className="mt-8 text-ink-soft">
          {query ? "No visible members match that search." : "No members are listed yet."}
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {profiles.map((profile) => (
            <PersonCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
