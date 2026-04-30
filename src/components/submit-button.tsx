"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  className: string;
};

export function SubmitButton({ idleLabel, pendingLabel, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`${className} ${pending ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </span>
      ) : (
        idleLabel
      )}
    </button>
  );
}
