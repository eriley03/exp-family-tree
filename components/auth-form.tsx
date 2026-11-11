"use client";

import Link from "next/link";
import { useActionState } from "react";
import { sendMagicLink, signInWithPassword, signUpWithPassword } from "@/app/auth/actions";
import { SubmitButton } from "@/components/submit-button";
import { initialFormState } from "@/lib/types";

export function AuthForm({
  mode,
  nextPath,
  configured,
  linkError,
}: {
  mode: "login" | "signup";
  nextPath: string;
  configured: boolean;
  linkError?: string;
}) {
  const passwordAction = mode === "signup" ? signUpWithPassword : signInWithPassword;
  const [passwordState, passwordFormAction] = useActionState(passwordAction, initialFormState);
  const [magicState, magicFormAction] = useActionState(sendMagicLink, initialFormState);

  return (
    <div className="grid gap-6">
      {!configured ? (
        <p className="note">
          Sign-in is visible so you can review the screens, but it will not create a session until
          Supabase Auth is connected.
        </p>
      ) : null}
      {linkError ? <p className="alert">{linkError}</p> : null}

      <form action={passwordFormAction} className="card grid gap-4 p-6">
        <h2 className="font-serif text-2xl text-forest">
          {mode === "signup" ? "Create a member account" : "Sign in with a password"}
        </h2>
        <input type="hidden" name="next" value={nextPath} />
        {mode === "signup" ? (
          <label className="field">
            <span>Name</span>
            <input className="input" name="full_name" autoComplete="name" required maxLength={120} />
          </label>
        ) : null}
        <label className="field">
          <span>Email</span>
          <input className="input" name="email" type="email" autoComplete="email" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            className="input"
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={8}
            required
          />
        </label>
        {mode === "signup" ? (
          <label className="field">
            <span>Confirm password</span>
            <input className="input" name="confirm" type="password" autoComplete="new-password" required />
          </label>
        ) : null}
        {passwordState.error ? <p className="alert">{passwordState.error}</p> : null}
        {passwordState.message ? <p className="note">{passwordState.message}</p> : null}
        <SubmitButton pendingLabel={mode === "signup" ? "Creating…" : "Signing in…"}>
          {mode === "signup" ? "Create account" : "Sign in"}
        </SubmitButton>
      </form>

      <form action={magicFormAction} className="card grid gap-4 p-6">
        <h2 className="font-serif text-2xl text-forest">Email me a sign-in link</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          A magic link can create an account or sign you in. If you are new, add your name so the
          directory is not blank.
        </p>
        <input type="hidden" name="next" value={nextPath} />
        <label className="field">
          <span>Name</span>
          <input className="input" name="full_name" autoComplete="name" maxLength={120} />
        </label>
        <label className="field">
          <span>Email</span>
          <input className="input" name="email" type="email" autoComplete="email" required />
        </label>
        {magicState.error ? <p className="alert">{magicState.error}</p> : null}
        {magicState.message ? <p className="note">{magicState.message}</p> : null}
        <SubmitButton variant="secondary" pendingLabel="Sending…">
          Send magic link
        </SubmitButton>
      </form>

      <p className="text-sm text-ink-soft">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="font-semibold text-forest">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Need a member account?{" "}
            <Link href={`/signup?next=${encodeURIComponent(nextPath)}`} className="font-semibold text-forest">
              Create one
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
