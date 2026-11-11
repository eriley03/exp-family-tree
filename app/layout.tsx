import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getViewer } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: "eXp Family Tree",
    template: "%s · eXp Family Tree",
  },
  description:
    "eXp Family Tree is a community for eXp Realty agents, co-founded by Elizabeth Riley. Every agent wins together, regardless of upline.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  const configured = isSupabaseConfigured();

  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader viewer={viewer} />
        {!configured ? (
          <div className="border-b border-line bg-gold-soft">
            <p className="shell py-2 text-sm text-ink">
              Preview mode: Supabase is not connected, so accounts, leads, events, and files are
              not saved yet.
            </p>
          </div>
        ) : null}
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
