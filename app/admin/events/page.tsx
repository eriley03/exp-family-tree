import type { Metadata } from "next";
import { deleteEvent } from "@/app/admin/actions";
import { CreateEventForm, EditEventForm } from "@/components/admin-forms";
import { ConfirmDelete } from "@/components/confirm-delete";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { formatCentral } from "@/lib/time";
import type { FamilyEvent } from "@/lib/types";

export const metadata: Metadata = {
  title: "Manage events",
  robots: { index: false, follow: false },
};

export default async function AdminEventsPage() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, starts_at, ends_at, location, event_type, join_url, published, created_by, created_at, updated_at")
    .order("starts_at", { ascending: false });
  const events = (data ?? []) as FamilyEvent[];

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-serif text-4xl text-forest">Events</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Enter times as Central Time. Unpublished events stay off the public calendar.
        </p>
      </div>
      <CreateEventForm />
      {error ? <p className="alert">Events could not be loaded.</p> : null}
      <ul className="space-y-3">
        {events.map((event) => (
          <li key={event.id} className="card p-5">
            <details>
              <summary className="cursor-pointer">
                <span className="font-serif text-2xl text-forest">{event.title}</span>
                <span className="mt-1 block text-sm text-ink-soft">
                  {formatCentral(event.starts_at)} · {event.published ? "Published" : "Draft"}
                </span>
              </summary>
              <EditEventForm event={event} />
              <ConfirmDelete
                action={deleteEvent}
                id={event.id}
                label="Delete event"
                message="Delete this event?"
              />
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
