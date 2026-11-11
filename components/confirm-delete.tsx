"use client";

export function ConfirmDelete({
  action,
  id,
  label,
  message,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label: string;
  message: string;
}) {
  return (
    <form action={action} className="mt-3">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="btn btn-danger"
        onClick={(event) => {
          if (!window.confirm(message)) event.preventDefault();
        }}
      >
        {label}
      </button>
    </form>
  );
}
