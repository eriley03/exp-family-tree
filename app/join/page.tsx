import type { Metadata } from "next";
import Link from "next/link";
import { JoinForm } from "@/components/join-form";
import { PageHeader } from "@/components/page-header";
import { PlaceholderNote } from "@/components/placeholder-note";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Join eXp",
  description: "Tell eXp Family Tree you are interested in joining eXp Realty with this community.",
};

export default function JoinPage() {
  return (
    <div className="shell grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <PageHeader eyebrow="Join eXp" title="Raise your hand.">
          <p>
            If you are considering eXp Realty and want to do it with Family Tree, send a note.
            A Family Tree organizer will follow up. There is no promised response time yet.
          </p>
        </PageHeader>
        <ol className="mt-8 space-y-4 text-ink-soft">
          <li>
            <span className="font-semibold text-ink">1. Tell us who you are.</span> Name and email
            are enough to start.
          </li>
          <li>
            <span className="font-semibold text-ink">2. We save it for the organizers.</span>{" "}
            Elizabeth, Brian, and other admins can read the list.
          </li>
          <li>
            <span className="font-semibold text-ink">3. Joining the brokerage is a later step.</span>{" "}
            This form is not an eXp application.
          </li>
        </ol>
        <div className="mt-8">
          <PlaceholderNote title="Why agents choose this path">
            <p>
              Replace this box with the approved explanation of what is different about joining
              through Family Tree. Leave compensation and sponsorship rules out until they are
              written and approved.
            </p>
          </PlaceholderNote>
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          Already with the community?{" "}
          <Link href="/signup" className="font-semibold text-forest">
            Create a member account
          </Link>
          .
        </p>
      </div>
      <div className="card p-6 sm:p-8">
        <JoinForm configured={isSupabaseConfigured()} />
      </div>
    </div>
  );
}
