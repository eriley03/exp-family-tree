"use client";

import { useActionState } from "react";
import {
  createEvent,
  createResource,
  updateEvent,
  updateLeadStatus,
  updateResource,
} from "@/app/admin/actions";
import { SubmitButton } from "@/components/submit-button";
import { toCentralInput } from "@/lib/time";
import { initialFormState, type FamilyEvent, type JoinLead, type Resource } from "@/lib/types";

const CATEGORIES = ["General", "Getting started", "Calls", "Scripts", "Marketing"];

export function EventFields({
  action,
  event,
}: {
  action: (payload: FormData) => void;
  event?: FamilyEvent;
}) {
  return (
    <form action={action} className="grid gap-4">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}
      <label className="field">
        <span>Title</span>
        <input className="input" name="title" defaultValue={event?.title} required maxLength={160} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          <span>Starts (Central Time)</span>
          <input
            className="input"
            type="datetime-local"
            name="starts_at"
            required
            defaultValue={event ? toCentralInput(event.starts_at) : undefined}
          />
        </label>
        <label className="field">
          <span>Ends (optional)</span>
          <input
            className="input"
            type="datetime-local"
            name="ends_at"
            defaultValue={event?.ends_at ? toCentralInput(event.ends_at) : undefined}
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          <span>Type</span>
          <select className="select" name="event_type" defaultValue={event?.event_type ?? "call"}>
            <option value="call">Call</option>
            <option value="training">Training</option>
            <option value="event">Gathering</option>
          </select>
        </label>
        <label className="field">
          <span>Location</span>
          <input className="input" name="location" defaultValue={event?.location} maxLength={200} />
        </label>
      </div>
      <label className="field">
        <span>Join link</span>
        <input className="input" name="join_url" defaultValue={event?.join_url} maxLength={500} placeholder="https://" />
      </label>
      <label className="field">
        <span>Description</span>
        <textarea className="textarea" name="description" defaultValue={event?.description} maxLength={4000} />
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="published" defaultChecked={event?.published ?? true} />
        Published on the public calendar
      </label>
      <SubmitButton>{event ? "Update event" : "Add event"}</SubmitButton>
    </form>
  );
}

export function CreateEventForm() {
  const [state, action] = useActionState(createEvent, initialFormState);
  return (
    <div className="card p-5">
      <h2 className="font-serif text-2xl text-forest">New event</h2>
      <div className="mt-4">
        <EventFields key={state.savedAt ?? "new"} action={action} />
      </div>
      {state.error ? <p className="alert mt-4">{state.error}</p> : null}
      {state.message ? <p className="note mt-4">{state.message}</p> : null}
    </div>
  );
}

export function EditEventForm({ event }: { event: FamilyEvent }) {
  const [state, action] = useActionState(updateEvent, initialFormState);
  return (
    <div className="mt-4">
      <EventFields action={action} event={event} />
      {state.error ? <p className="alert mt-4">{state.error}</p> : null}
      {state.message ? <p className="note mt-4">{state.message}</p> : null}
    </div>
  );
}

export function LeadStatusForm({ lead }: { lead: JoinLead }) {
  const [state, action] = useActionState(updateLeadStatus, initialFormState);
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={lead.id} />
      <label className="sr-only" htmlFor={`status-${lead.id}`}>
        Status for {lead.full_name}
      </label>
      <select id={`status-${lead.id}`} name="status" defaultValue={lead.status} className="select w-auto">
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="closed">Closed</option>
      </select>
      <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
      {state.error ? <span className="text-sm text-clay">{state.error}</span> : null}
    </form>
  );
}

export function ResourceFields({
  action,
  resource,
}: {
  action: (payload: FormData) => void;
  resource?: Resource;
}) {
  return (
    <form action={action} className="grid gap-4">
      {resource ? <input type="hidden" name="id" value={resource.id} /> : null}
      <label className="field">
        <span>Title</span>
        <input className="input" name="title" defaultValue={resource?.title} required maxLength={160} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">
          <span>Category</span>
          <input
            className="input"
            name="category"
            list={`resource-categories-${resource?.id ?? "new"}`}
            defaultValue={resource?.category ?? "General"}
            required
            maxLength={80}
          />
          <datalist id={`resource-categories-${resource?.id ?? "new"}`}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>
        <label className="field">
          <span>Type</span>
          <select className="select" name="kind" defaultValue={resource?.kind ?? "link"}>
            <option value="link">Link</option>
            <option value="file">File upload</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Link address (for links)</span>
        <input className="input" name="url" defaultValue={resource?.url} maxLength={500} placeholder="https://" />
      </label>
      <label className="field">
        <span>File {resource?.storage_path ? "(leave empty to keep the current file)" : ""}</span>
        <input className="input" name="file" type="file" />
      </label>
      <label className="field">
        <span>Description</span>
        <textarea className="textarea" name="description" defaultValue={resource?.description} maxLength={2000} />
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="published" defaultChecked={resource?.published ?? true} />
        Visible to signed-in members
      </label>
      <SubmitButton>{resource ? "Update resource" : "Add resource"}</SubmitButton>
    </form>
  );
}

export function CreateResourceForm() {
  const [state, action] = useActionState(createResource, initialFormState);
  return (
    <div className="card p-5">
      <h2 className="font-serif text-2xl text-forest">New resource</h2>
      <div className="mt-4">
        <ResourceFields key={state.savedAt ?? "new"} action={action} />
      </div>
      {state.error ? <p className="alert mt-4">{state.error}</p> : null}
      {state.message ? <p className="note mt-4">{state.message}</p> : null}
    </div>
  );
}

export function EditResourceForm({ resource }: { resource: Resource }) {
  const [state, action] = useActionState(updateResource, initialFormState);
  return (
    <div className="mt-4">
      <ResourceFields action={action} resource={resource} />
      {state.error ? <p className="alert mt-4">{state.error}</p> : null}
      {state.message ? <p className="note mt-4">{state.message}</p> : null}
    </div>
  );
}
