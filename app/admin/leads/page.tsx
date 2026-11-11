import type { Metadata } from "next";
import { LeadStatusForm } from "@/components/admin-forms";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { formatCentral } from "@/lib/time";
import type { JoinLead } from "@/lib/types";

export const metadata: Metadata = {
  title: "Join requests",
  robots: { index: false, follow: false },
};

export default async function LeadsPage() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("join_leads")
    .select("id, full_name, email, phone, city, state, current_brokerage, message, status, created_at")
    .order("created_at", { ascending: false });
  const leads = (data ?? []) as JoinLead[];

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Join requests</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        People who filled out the Join eXp form. This is not the member directory.
      </p>
      {error ? <p className="alert mt-6">The requests could not be loaded.</p> : null}
      {leads.length === 0 ? (
        <p className="mt-8 text-ink-soft">No one has sent an interest form yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {leads.map((lead) => (
            <li key={lead.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl text-forest">{lead.full_name}</h2>
                  <p className="text-sm text-ink-soft">{formatCentral(lead.created_at)}</p>
                </div>
                <LeadStatusForm lead={lead} />
              </div>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold">Email</dt>
                  <dd>
                    <a className="text-forest" href={`mailto:${lead.email}`}>
                      {lead.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Phone</dt>
                  <dd>{lead.phone || "—"}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Place</dt>
                  <dd>{[lead.city, lead.state].filter(Boolean).join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Brokerage</dt>
                  <dd>{lead.current_brokerage || "—"}</dd>
                </div>
              </dl>
              {lead.message ? <p className="mt-4 whitespace-pre-wrap leading-relaxed text-ink-soft">{lead.message}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
