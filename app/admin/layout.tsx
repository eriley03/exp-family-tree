import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { SetupNotice } from "@/components/setup-notice";
import { getViewer } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/leads", label: "Join requests" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/resources", label: "Resources" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="shell py-14">
        <PageHeader eyebrow="Admin" title="Organizer desk">
          <p>Events, resources, and join-form leads will be managed here.</p>
        </PageHeader>
        <div className="mt-8">
          <SetupNotice />
        </div>
      </div>
    );
  }

  const viewer = await getViewer();
  if (!viewer) redirect("/login?next=/admin");
  if (viewer.role !== "admin") {
    return (
      <div className="shell max-w-2xl py-14">
        <PageHeader eyebrow="Admin" title="Admins only">
          <p>
            {viewer.fullName || viewer.email} is signed in as a member. An existing admin, or the
            Supabase SQL editor, can promote this account. The steps are in the README.
          </p>
        </PageHeader>
      </div>
    );
  }

  return (
    <div className="shell py-14">
      <p className="eyebrow">Admin</p>
      <nav className="mt-4 flex flex-wrap gap-2" aria-label="Admin">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="btn btn-secondary">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}
