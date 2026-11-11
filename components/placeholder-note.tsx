export function PlaceholderNote({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="placeholder">
      <p className="placeholder-label">Placeholder — needs real content</p>
      <h2 className="font-serif text-2xl text-forest">{title}</h2>
      <div className="mt-3 space-y-3 text-ink-soft leading-relaxed">{children}</div>
    </aside>
  );
}
