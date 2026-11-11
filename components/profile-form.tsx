"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/account/actions";
import { SubmitButton } from "@/components/submit-button";
import { initialFormState, type Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action] = useActionState(updateProfile, initialFormState);

  return (
    <form action={action} className="grid gap-4">
      <label className="field">
        <span>Name</span>
        <input className="input" name="full_name" defaultValue={profile.full_name} required maxLength={120} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          <span>City</span>
          <input className="input" name="city" defaultValue={profile.city} maxLength={80} />
        </label>
        <label className="field">
          <span>State or province</span>
          <input className="input" name="state" defaultValue={profile.state} maxLength={80} />
        </label>
      </div>
      <label className="field">
        <span>Bio</span>
        <textarea className="textarea" name="bio" defaultValue={profile.bio} maxLength={2000} />
      </label>
      <label className="field">
        <span>Phone (only you and admins can see this on the account page)</span>
        <input className="input" name="phone" defaultValue={profile.phone} maxLength={40} />
      </label>
      <label className="field">
        <span>Website</span>
        <input className="input" name="website" defaultValue={profile.website} maxLength={300} placeholder="https://" />
      </label>
      <label className="field">
        <span>Photo</span>
        <input className="input" name="avatar" type="file" accept="image/jpeg,image/png,image/webp" />
      </label>
      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input type="checkbox" name="directory_visible" defaultChecked={profile.directory_visible} className="mt-1" />
        <span>Show me in the member directory. Name, location, bio, photo, and website are visible to signed-in members.</span>
      </label>
      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input type="checkbox" name="show_email" defaultChecked={profile.show_email} className="mt-1" />
        <span>Also show my sign-in email on my directory profile.</span>
      </label>
      {state.error ? <p className="alert">{state.error}</p> : null}
      {state.message ? <p className="note">{state.message}</p> : null}
      <SubmitButton>Save profile</SubmitButton>
    </form>
  );
}
