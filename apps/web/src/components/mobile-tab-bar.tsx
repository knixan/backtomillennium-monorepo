import { Link } from "@tanstack/react-router";

import { navItems } from "@/lib/nav";

// Startsidan nås via loggan – bottenraden visar de övriga sektionerna.
const tabItems = navItems.filter((item) => item.label !== "Hem");

export function MobileTabBar() {
  return (
    <nav
      aria-label="Sektioner"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex items-center justify-between gap-0.5 overflow-x-auto px-2 py-2">
        {tabItems.map((item) => (
          <li key={item.label} className="flex-1">
            <Link
              to={item.to}
              aria-label={item.label}
              className="flex min-w-11 flex-col items-center rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary" }}
            >
              <item.icon className="size-5" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
