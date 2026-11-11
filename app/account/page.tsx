import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { PageHeader } from "@/components/page-header";
import { ProfileForm } from "@/components/profile-form";
import { SetupNotice } from "@/components/setup-notice";
import { isSupabaseConfigured, publicAvatarUrl } from "@/lib/supabase/config";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

const PROFILE_COLUMNS =
  "id, email, full_name, city, state, bio, website, avatar_path, show_email, directory_visible, role, created_at, updated_at";

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="shell max-w-3xl py-14">
        <PageHeader eyebrow="Account" title="Your profile">
          <p>Members will edit their directory listing here.</p>
        </PageHeader>
        <div className="mt-8">
          <SetupNotice />
        </div>
      </div>
    );
  }

  const viewer = await requireViewer("/account");
  if (!viewer) return null;
  const supabase = await createClient();
  const [{ data }, { data: privateRow }] = await Promise.all([
    supabase.from("profiles").select(PROFILE_COLUMNS).eq("id", viewer.id).maybeSingle(),
    supabase.from("profile_private").select("phone").eq("profile_id", viewer.id).maybeSingle(),
  ]);
  const phone = (privateRow as { phone?: string } | null)?.phone ?? "";
  const row = data as Omit<Profile, "phone"> | null;
  const profile: Profile = row
    ? { ...row, phone }
    : {
        id: viewer.id,
        email: viewer.email,
        full_name: viewer.fullName,
        city: "",
        state: "",
        bio: "",
        phone,
        website: "",
        avatar_path: null,
        show_email: false,
        directory_visible: true,
        role: viewer.role,
        created_at: "",
        updated_at: "",
      };
  const photo = publicAvatarUrl(profile.avatar_path);

  return (
    <div className="shell grid max-w-5xl gap-8 py-14 lg:grid-cols-[1fr_16rem]">
      <div>
        <PageHeader eyebrow="Account" title="Your profile">
          <p>
            Signed in as {profile.email || "your account"}.
            {profile.role === "admin" ? " This account is an admin." : ""}
          </p>
        </PageHeader>
        <div className="card mt-8 p-6">
          <ProfileForm profile={profile} />
        </div>
      </div>
      <aside className="space-y-4">
        <div className="card p-5">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="mb-4 h-24 w-24 rounded-full object-cover" />
          ) : null}
          <p className="text-sm leading-relaxed text-ink-soft">
            Phone numbers are not shown in the directory. Email is hidden unless you opt in.
          </p>
          {profile.directory_visible ? (
            <Link href={`/members/${profile.id}`} className="mt-4 inline-flex font-semibold text-forest">
              View public profile
            </Link>
          ) : null}
        </div>
        <form action={signOut}>
          <button type="submit" className="btn btn-secondary w-full">
            Sign out
          </button>
        </form>
      </aside>
    </div>
  );
}
