import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PlaceholderNote } from "@/components/placeholder-note";

export const metadata: Metadata = {
  title: "Mission",
  description:
    "Why eXp Family Tree exists: eXp agents winning together, regardless of upline.",
};

export default function AboutPage() {
  return (
    <article className="shell py-14">
      <PageHeader eyebrow="About" title="Win together, regardless of upline.">
        <p>
          eXp Family Tree was co-founded by Elizabeth Riley so agents at eXp Realty would have a
          community that is bigger than one sponsorship line. Brian Copland is building it with her.
        </p>
      </PageHeader>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            At eXp, agents sponsor other agents. Those lines are often called uplines. Family Tree
            is organized around a different invitation: show up for each other even when you are
            not in the same line.
          </p>
          <p>
            This website is the public door and the member home base. People considering a move to
            eXp can say they are interested. People who already belong can keep a profile, find
            other members, see upcoming calls, and use a shared library.
          </p>
          <p>
            Elizabeth is based in Austin, Texas. She founded Luxe Property Group at eXp Realty, was
            early eXp agent #466, has received 11 ICON Awards, and leads an organization of more
            than 10,000 agents.
          </p>
        </div>
        <aside className="card h-fit p-6">
          <p className="eyebrow">What this site is for</p>
          <ul className="mt-4 space-y-3 text-ink-soft">
            <li>Explain Family Tree in plain language.</li>
            <li>Collect interest from agents who may join eXp.</li>
            <li>Give members a directory, a calendar, and resources.</li>
            <li>Give Elizabeth and Brian a simple admin desk.</li>
          </ul>
        </aside>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <PlaceholderNote title="How joining through Family Tree works">
          <p>
            Elizabeth and Brian still need to write the plain-language explanation of what happens
            after someone raises a hand: who follows up, how sponsorship is attributed, and what an
            agent should know before changing brokerages.
          </p>
          <p>
            Do not publish compensation figures, revenue-share promises, or program rules until
            that copy is approved.
          </p>
        </PlaceholderNote>
        <PlaceholderNote title="Brian Copland">
          <p>
            Brian is a collaborator building Family Tree with Elizabeth. A short bio, city, role,
            and photo should be added by him. Nothing else about Brian is filled in on purpose.
          </p>
        </PlaceholderNote>
      </div>

      <div className="mt-10">
        <Link href="/join" className="btn btn-primary">
          I want to talk about joining eXp
        </Link>
      </div>
    </article>
  );
}
