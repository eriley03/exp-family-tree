export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="mt-2 font-serif text-4xl leading-tight text-forest sm:text-5xl">{title}</h1>
      {children ? (
        <div className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{children}</div>
      ) : null}
    </header>
  );
}
