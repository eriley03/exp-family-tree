"use client";

import { useActionState } from "react";
import { submitJoinLead } from "@/app/join/actions";
import { SubmitButton } from "@/components/submit-button";
import { initialFormState } from "@/lib/types";

export function JoinForm({ configured }: { configured: boolean }) {
  const [state, action] = useActionState(submitJoinLead, initialFormState);

  if (state.ok) {
    return (
      <div className="note">
        <p className="font-semibold">You are on the list.</p>
        <p className="mt-1">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <div className="hp" aria-hidden="true">
        <label>
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="field">
        <span>Name</span>
        <input className="input" name="full_name" autoComplete="name" required maxLength={120} />
      </label>
      <label className="field">
        <span>Email</span>
        <input className="input" name="email" type="email" autoComplete="email" required />
      </label>
      <label className="field">
        <span>Phone</span>
        <input className="input" name="phone" type="tel" autoComplete="tel" maxLength={40} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          <span>City</span>
          <input className="input" name="city" autoComplete="address-level2" maxLength={80} />
        </label>
        <label className="field">
          <span>State or province</span>
          <input className="input" name="state" autoComplete="address-level1" maxLength={80} />
        </label>
      </div>
      <label className="field">
        <span>Current brokerage</span>
        <input className="input" name="current_brokerage" maxLength={160} />
      </label>
      <label className="field">
        <span>Anything you want Family Tree to know</span>
        <textarea className="textarea" name="message" maxLength={4000} />
      </label>
      {!configured ? (
        <p className="note">The button stays off until Supabase is connected. Nothing is stored in preview mode.</p>
      ) : null}
      {state.error ? <p className="alert">{state.error}</p> : null}
      <SubmitButton pendingLabel="Sending…" disabled={!configured}>
        {configured ? "Send my interest" : "Unavailable until setup"}
      </SubmitButton>
      <p className="text-sm leading-relaxed text-ink-soft">
        This note is visible to Family Tree admins only. It does not create a member login and it
        does not enroll you with eXp Realty.
      </p>
    </form>
  );
}
