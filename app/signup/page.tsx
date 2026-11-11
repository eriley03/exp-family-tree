import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { PageHeader } from "@/components/page-header";
import { getViewer } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Create a member account",
  robots: { index: false, follow: false },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const viewer = await getViewer();
  if (viewer) redirect(nextPath);

  return (
    <div className="shell max-w-xl py-14">
      <PageHeader eyebrow="Members" title="Create a member account">
        <p>
          Use this if you are already part of Family Tree and need a login. If you are considering
          a move to eXp, use the interest form instead.
        </p>
      </PageHeader>
      <div className="mt-8">
        <AuthForm mode="signup" nextPath={nextPath} configured={isSupabaseConfigured()} />
      </div>
    </div>
  );
}
