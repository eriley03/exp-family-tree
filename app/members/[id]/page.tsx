import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { initials } from "@/components/person-card";
import { SetupNotice } from "@/components/setup-notice";
import { requireViewer } from "@/lib/auth";
import { isSupabaseConfigured, publicAvatarUrl } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { isUuid } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Member",
  robots: { index: false, follow: false },
};

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();

  if (!isSupabaseConfigured()) {
    return (
      <div className="shell py-14">
        <SetupNotice>Member profiles appear here after Supabase is connected.</SetupNotice>
      </div>
    );
  }

  if (!(await requireViewer(`/members/${id}`))) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, city, state, bio, website, avatar_path, show_email, email, directory_visible, role, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  const profile = data as Profile | null;
  if (!profile) notFound();

  const photo = publicAvatarUrl(profile.avatar_path);
  const place = [profile.city, profile.state].filter(Boolean).join(", ");

  return (
    <article className="shell max-w-3xl py-14">
      <Link href="/directory" className="text-sm font-semibold text-forest">
        Back to the directory
      </Link>
      <div className="mt-6 flex items-center gap-5">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="h-24 w-24 rounded-full object-cover" />
        ) : (
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-sage font-serif text-3xl text-forest">
            {initials(profile.full_name)}
          </span>
        )}
        <div>
          <h1 className="font-serif text-4xl text-forest">{profile.full_name || "Name not added yet"}</h1>
          <p className="mt-1 text-ink-soft">{place || "Location not added yet"}</p>
        </div>
      </div>
      {profile.bio ? (
        <p className="mt-8 whitespace-pre-wrap text-lg leading-relaxed text-ink-soft">{profile.bio}</p>
      ) : (
        <p className="mt-8 text-ink-soft">This member has not written a bio yet.</p>
      )}
      <dl className="mt-8 space-y-3">
        {profile.website ? (
          <div>
            <dt className="text-sm font-semibold text-ink">Website</dt>
            <dd>
              <a href={profile.website} className="text-forest" target="_blank" rel="noreferrer">
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            </dd>
          </div>
        ) : null}
        {profile.show_email && profile.email ? (
          <div>
            <dt className="text-sm font-semibold text-ink">Email</dt>
            <dd>
              <a href={`mailto:${profile.email}`} className="text-forest">
                {profile.email}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
