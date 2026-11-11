"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="shell py-24">
      <h1 className="font-serif text-5xl text-forest">Something went wrong.</h1>
      <p className="mt-4 max-w-lg text-lg text-ink-soft">
        The page could not be loaded. Try again, and if it keeps happening, check the Supabase
        connection.
      </p>
      <button type="button" className="btn btn-primary mt-8" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
