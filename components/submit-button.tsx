"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "primary",
  disabled = false,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const variantClass =
    variant === "danger" ? "btn-danger" : variant === "secondary" ? "btn-secondary" : "btn-primary";

  return (
    <button type="submit" className={`btn ${variantClass}`} disabled={pending || disabled}>
      {pending ? pendingLabel : children}
    </button>
  );
}
