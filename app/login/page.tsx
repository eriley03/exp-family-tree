import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { PageHeader } from "@/components/page-header";
import { getViewer } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

const LINK_ERRORS: Record<string, string> = {
  link: "That email link is invalid or expired. Request a new one.",
  setup: "Supabase is not connected, so the email link could not be finished.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const viewer = await getViewer();
  if (viewer) redirect(nextPath);

  return (
    <div className="shell max-w-xl py-14">
      <PageHeader eyebrow="Members" title="Sign in">
        <p>
          Member accounts open the directory, the resource library, and your profile. Joining eXp
          is a separate form.
        </p>
      </PageHeader>
      <div className="mt-8">
        <AuthForm
          mode="login"
          nextPath={nextPath}
          configured={isSupabaseConfigured()}
          linkError={params.error ? LINK_ERRORS[params.error] : undefined}
        />
      </div>
    </div>
  );
}
