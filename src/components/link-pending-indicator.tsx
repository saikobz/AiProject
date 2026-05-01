"use client";

import { Loader2 } from "lucide-react";
import { useLinkStatus } from "next/link";

import { cn } from "@/lib/utils/cn";

type LinkPendingIndicatorProps = {
  className?: string;
};

export function LinkPendingIndicator({ className }: LinkPendingIndicatorProps) {
  const { pending } = useLinkStatus();

  return (
    <Loader2
      aria-hidden="true"
      className={cn(
        "size-3.5 shrink-0 opacity-0 transition-opacity",
        pending && "animate-spin opacity-100",
        className,
      )}
    />
  );
}
