import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SetupNotice } from "@/components/setup-notice";
import { formatCentralTime, formatCentralDate, formatCentralMonth } from "@/lib/time";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { FamilyEvent } from "@/lib/types";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Upcoming Family Tree calls, trainings, and gatherings.",
};

const TYPE_LABELS: Record<FamilyEvent["event_type"], string> = {
  call: "Call",
  event: "Gathering",
  training: "Training",
};

export default async function EventsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="shell py-14">
        <PageHeader eyebrow="Calendar" title="Calls and gatherings">
          <p>Published events will be listed here, in Central Time, once Supabase is connected.</p>
        </PageHeader>
        <div className="mt-8">
          <SetupNotice />
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, starts_at, ends_at, location, event_type, join_url, published")
    .eq("published", true)
    .order("starts_at", { ascending: true });

  const events = (data ?? []) as FamilyEvent[];
  // Upcoming versus earlier is decided when the request is served.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const upcoming = events.filter((event) => Date.parse(event.ends_at ?? event.starts_at) >= now);
  const earlier = events
    .filter((event) => Date.parse(event.ends_at ?? event.starts_at) < now)
    .slice(-8)
    .reverse();

  return (
    <div className="shell py-14">
      <PageHeader eyebrow="Calendar" title="Calls and gatherings">
        <p>
          Times are shown in Central Time, where Elizabeth is based in Austin. Anyone can read the
          published list. Admins add and edit it.
        </p>
      </PageHeader>

      {error ? (
        <p className="alert mt-8">The calendar could not be loaded. Check the Supabase connection.</p>
      ) : null}

      <section className="mt-10">
        <h2 className="font-serif text-3xl text-forest">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="mt-4 max-w-xl text-ink-soft">
            Nothing is on the calendar yet. When an admin publishes a call or gathering, it will
            show up here.
          </p>
        ) : (
          <EventList events={upcoming} />
        )}
      </section>

      {earlier.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-serif text-3xl text-forest">Earlier</h2>
          <EventList events={earlier} muted />
        </section>
      ) : null}
    </div>
  );
}

function EventList({ events, muted = false }: { events: FamilyEvent[]; muted?: boolean }) {
  const groups = new Map<string, FamilyEvent[]>();
  for (const event of events) {
    const key = formatCentralMonth(event.starts_at);
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }

  return (
    <div className="mt-6 space-y-8">
      {[...groups.entries()].map(([month, items]) => (
        <section key={month}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">{month}</h3>
          <ol className="mt-3 space-y-3">
            {items.map((event) => (
              <li key={event.id} className={`card grid gap-4 p-5 sm:grid-cols-[8.5rem_1fr] ${muted ? "opacity-80" : ""}`}>
                <div>
                  <p className="font-serif text-2xl text-forest">{formatCentralDate(event.starts_at)}</p>
                  <p className="mt-1 text-sm text-ink-soft">{formatCentralTime(event.starts_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                    {TYPE_LABELS[event.event_type] ?? "Event"}
                  </p>
                  <h4 className="mt-1 font-serif text-2xl text-ink">{event.title}</h4>
                  {event.description ? (
                    <p className="mt-2 whitespace-pre-wrap leading-relaxed text-ink-soft">{event.description}</p>
                  ) : null}
                  <p className="mt-3 text-sm text-ink-soft">
                    {event.location || "Location to be announced"}
                    {event.ends_at ? ` · until ${formatCentralTime(event.ends_at)}` : ""}
                  </p>
                  {event.join_url ? (
                    <a href={event.join_url} className="mt-3 inline-flex font-semibold text-forest" target="_blank" rel="noreferrer">
                      Join link
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
