import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

async function count(table: "join_leads" | "events" | "resources" | "profiles", filter?: { column: string; value: string | boolean }) {
  const supabase = await createClient();
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count: total } = await query;
  return total ?? 0;
}

export default async function AdminHomePage() {
  if (!isSupabaseConfigured()) return null;

  const [newLeads, events, resources, members] = await Promise.all([
    count("join_leads", { column: "status", value: "new" }),
    count("events"),
    count("resources"),
    count("profiles"),
  ]);

  const cards = [
    { href: "/admin/leads", label: "New join requests", value: newLeads },
    { href: "/admin/events", label: "Events on file", value: events },
    { href: "/admin/resources", label: "Resources", value: resources },
    { href: "/directory", label: "Member profiles", value: members },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Organizer desk</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Add calls, publish files and links, and read people who asked about joining eXp. Promoting
        another admin is a SQL step, documented in the README, so it cannot be done from this page.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="card p-5">
            <p className="font-serif text-4xl text-forest">{card.value}</p>
            <p className="mt-1 text-ink-soft">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
