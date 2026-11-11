export function SetupNotice({
  title = "Supabase is not connected yet",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="note">
      <p className="font-semibold text-forest">{title}</p>
      <p className="mt-1 leading-relaxed">
        {children ??
          "Add the project URL and anon key, then apply the SQL migration. Until then, this page explains what will live here and does not pretend the data is saved."}
      </p>
    </div>
  );
}
