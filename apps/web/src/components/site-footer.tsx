import { Link } from "@tanstack/react-router";

const footerLinks = [
  { label: "Om oss", to: "/" },
  { label: "Villkor", to: "/villkor" },
  { label: "Integritetspolicy", to: "/integritetspolicy" },
  { label: "Kontakta oss", to: "/" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <p className="font-display text-sm text-primary">© Näthänget</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
