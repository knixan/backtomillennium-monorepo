import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Näthänget – till startsidan"
      className={cn(
        "font-display tracking-tight text-primary transition-opacity hover:opacity-80",
        className,
      )}
    >
      NÄTHÄNGET
    </Link>
  );
}
