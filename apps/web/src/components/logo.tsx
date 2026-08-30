import { Link } from "@tanstack/react-router";

import logo from "@/assets/nathanget-logga.webp";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Näthänget – till startsidan"
      className={cn("inline-flex shrink-0 transition-opacity hover:opacity-80", className)}
    >
      <img src={logo} alt="Näthänget" className="h-18 w-auto sm:h-18" />
    </Link>
  );
}
