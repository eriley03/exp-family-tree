export function TreeMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#1B3A2F" />
      <path d="M24 10v20" stroke="#F4EFE6" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M24 16c-4.6-3.4-8.8-3-10 3.2 3.4.3 6.2 1.7 10 4.6 3.8-2.9 6.6-4.3 10-4.6-1.2-6.2-5.4-6.6-10-3.2Z"
        fill="#E4EFE7"
      />
      <path
        d="M24 23c-3.6-2.5-7-2.2-7.8 2.2 2.6.3 4.8 1.3 7.8 3.4 3-2.1 5.2-3.1 7.8-3.4-.8-4.4-4.2-4.7-7.8-2.2Z"
        fill="#F3EAD7"
      />
      <path d="M18.5 36h11" stroke="#C6A56A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
