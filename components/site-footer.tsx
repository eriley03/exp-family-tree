import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="shell grid gap-8 py-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl text-forest">eXp Family Tree</p>
          <p className="mt-2 max-w-sm leading-relaxed text-ink-soft">
            A community for eXp Realty agents. Every agent wins together, regardless of upline.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">Explore</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/about" className="hover:text-forest">
                Mission
              </Link>
            </li>
            <li>
              <Link href="/join" className="hover:text-forest">
                Join eXp
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-forest">
                Calendar
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-forest">
                Member sign in
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">For members</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/directory" className="hover:text-forest">
                Directory
              </Link>
            </li>
            <li>
              <Link href="/resources" className="hover:text-forest">
                Resource library
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-forest">
                Your profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="shell border-t border-line py-5 text-sm leading-relaxed text-ink-soft">
        <p>
          Family Tree is an agent community at eXp Realty, co-founded by Elizabeth Riley. This
          website is not the corporate eXp Realty site.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} eXp Family Tree</p>
      </div>
    </footer>
  );
}
