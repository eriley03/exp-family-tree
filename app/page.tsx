import Link from "next/link";
import { PlaceholderNote } from "@/components/placeholder-note";

const PILLARS = [
  {
    title: "A community past the upline",
    copy: "Family Tree starts from one idea: eXp agents should be able to win together, whether or not they sit in the same sponsorship line.",
  },
  {
    title: "A front door into eXp",
    copy: "Agents who want to join eXp Realty with this community can raise a hand. The interest form is a conversation starter, not a brokerage contract.",
  },
  {
    title: "A home base for members",
    copy: "Signed-in members get a directory, a calendar of calls and gatherings, and a library of shared resources.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="shell grid items-end gap-10 py-16 lg:grid-cols-[1.3fr_0.7fr] lg:py-24">
        <div>
          <p className="eyebrow">Austin and beyond</p>
          <h1 className="mt-3 max-w-xl font-serif text-5xl leading-[1.05] text-forest sm:text-6xl">
            Every agent wins together.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            eXp Family Tree is a community for eXp Realty agents, co-founded by Elizabeth Riley.
            The bet is simple: support should not stop at whoever happens to be upline.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/join" className="btn btn-primary">
              Join eXp through Family Tree
            </Link>
            <Link href="/about" className="btn btn-secondary">
              Read the mission
            </Link>
          </div>
        </div>
        <aside className="card p-6 sm:p-8">
          <p className="eyebrow">Co-founder</p>
          <p className="mt-3 font-serif text-3xl text-forest">Elizabeth Riley</p>
          <dl className="mt-5 space-y-3 text-sm leading-relaxed text-ink-soft">
            <div>
              <dt className="font-semibold text-ink">Based in</dt>
              <dd>Austin, Texas</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Also</dt>
              <dd>Founder of Luxe Property Group at eXp Realty</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">At eXp</dt>
              <dd>Early agent #466, 11 ICON Awards, leads an organization of more than 10,000 agents</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-ink-soft">
            Brian Copland is building Family Tree alongside Elizabeth.
          </p>
        </aside>
      </section>

      <section className="shell pb-6">
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <article key={pillar.title} className="card p-6">
              <p className="font-serif text-3xl text-gold">0{index + 1}</p>
              <h2 className="mt-3 font-serif text-2xl text-forest">{pillar.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{pillar.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell grid gap-6 py-12 lg:grid-cols-2">
        <PlaceholderNote title="Agent stories">
          <p>
            This block is waiting for real stories from Family Tree agents. Add quotes, photos, and
            outcomes only when the person has agreed to be featured.
          </p>
          <p>Do not invent testimonials, production numbers, or before-and-after claims.</p>
        </PlaceholderNote>
        <PlaceholderNote title="Photos">
          <p>
            A portrait of Elizabeth, a portrait of Brian, and photos from real calls or gatherings
            belong here. Use images the team has rights to publish.
          </p>
        </PlaceholderNote>
      </section>

      <section className="shell pb-4">
        <div className="rounded-[2rem] bg-forest px-6 py-10 text-paper sm:px-10">
          <p className="eyebrow text-gold-soft">Two different doors</p>
          <h2 className="mt-3 max-w-xl font-serif text-4xl">Joining eXp and creating a login are not the same step.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/8 p-5">
              <h3 className="font-semibold">New to eXp</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/85">
                Tell Family Tree you are interested. Someone will follow up. This site does not
                enroll you with the brokerage.
              </p>
              <Link href="/join" className="btn btn-primary mt-4 bg-paper text-forest hover:bg-white">
                Share your interest
              </Link>
            </div>
            <div className="rounded-2xl bg-white/8 p-5">
              <h3 className="font-semibold">Already a member</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/85">
                Sign in to see the directory, the resource library, and your profile. The calendar
                of published calls is open to everyone.
              </p>
              <Link href="/login" className="btn btn-secondary mt-4 border-paper text-paper hover:bg-white/10">
                Member sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
