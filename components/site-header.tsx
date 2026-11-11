"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/auth/actions";
import { TreeMark } from "@/components/tree-mark";
import type { Viewer } from "@/lib/types";

const PUBLIC_LINKS = [
  { href: "/about", label: "Mission" },
  { href: "/join", label: "Join eXp" },
  { href: "/events", label: "Calendar" },
];

export function SiteHeader({ viewer }: { viewer: Viewer | null }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  const memberLinks = viewer
    ? [
        { href: "/directory", label: "Directory" },
        { href: "/resources", label: "Resources" },
        { href: "/account", label: "Account" },
        ...(viewer.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
      ]
    : [];

  const links = [...PUBLIC_LINKS, ...memberLinks];

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-forest">
          <TreeMark className="h-9 w-9" />
          <span className="leading-tight">
            eXp Family Tree
            <span className="block text-xs font-medium tracking-normal text-ink-soft">
              Agents winning together
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`text-sm font-semibold ${
                pathname === link.href ? "text-forest" : "text-ink-soft hover:text-forest"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {viewer ? (
            <form action={signOut}>
              <button type="submit" className="btn btn-secondary">
                Sign out
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className="btn btn-quiet">
                Sign in
              </Link>
              <Link href="/join" className="btn btn-primary">
                Join eXp
              </Link>
            </>
          )}
        </div>

        <div className="lg:hidden">
          <button
            type="button"
            className="btn btn-secondary"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="shell space-y-1 pb-4 lg:hidden" aria-label="Mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-xl px-3 py-3 font-semibold text-forest hover:bg-white"
            >
              {link.label}
            </Link>
          ))}
          {viewer ? (
            <form action={signOut} className="px-3 pt-2">
              <button type="submit" className="btn btn-secondary w-full">
                Sign out
              </button>
            </form>
          ) : (
            <div className="flex gap-2 px-3 pt-2">
              <Link href="/login" className="btn btn-secondary flex-1">
                Sign in
              </Link>
              <Link href="/signup" className="btn btn-primary flex-1">
                Member account
              </Link>
            </div>
          )}
        </nav>
      ) : null}
    </header>
  );
}
