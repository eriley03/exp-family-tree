import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 font-serif text-5xl text-forest">That page is not on the tree.</h1>
      <p className="mt-4 max-w-lg text-lg text-ink-soft">
        The link may be old, or the profile may be hidden from the directory.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back home
      </Link>
    </div>
  );
}
