import { Link } from "@tanstack/react-router";
import { LogIn, Menu, UserPlus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        {/* D E S K T O P  N A V I G A T I O N */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group flex flex-col items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary" }}
            >
              <item.icon className="size-5" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* D E S K T O P  A U T H  A C T I O N S */}
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="icon" aria-label="Logga in">
            <Link to="/login">
              <LogIn className="size-5" />
            </Link>
          </Button>
          <Button asChild size="icon" aria-label="Bli medlem">
            <Link to="/register">
              <UserPlus className="size-5" />
            </Link>
          </Button>
        </div>

        {/*  M O B I L E  */}
        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <Button asChild variant="ghost" size="icon" aria-label="Logga in">
            <Link to="/login">
              <LogIn className="size-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Bli medlem">
            <Link to="/register">
              <UserPlus className="size-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border transition-[max-height] duration-300 lg:hidden",
          menuOpen ? "max-h-128" : "max-h-0",
        )}
      >
        <nav className="grid gap-1 px-4 py-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary" }}
            >
              <item.icon className="size-5" aria-hidden />
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            <Button asChild variant="outline" className="flex-1" onClick={() => setMenuOpen(false)}>
              <Link to="/login">
                <LogIn className="size-4" />
                Logga in
              </Link>
            </Button>
            <Button asChild className="flex-1" onClick={() => setMenuOpen(false)}>
              <Link to="/register">
                <UserPlus className="size-4" />
                Bli medlem
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
