import { Link } from "@tanstack/react-router";
import { LogIn, UserPlus } from "lucide-react";

import heroMobileUrl from "@/assets/hero-mobile.webp";
import heroUrl from "@/assets/hero.webp";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MIN_AGE } from "@nathanget/shared-types";

const INTRO =
  "Näthänget - mötesplatsen för dig som vill träffa nya människor, snacka, dela intressen och ha kul online. Var dig själv  - utan filter.";

const HERO_ALT = "Ungdomar som hänger runt en lägereld i skogen";

function Heading() {
  return (
    <div className="space-y-2">
      <p className="font-display text-xs text-cyan sm:text-sm">VÄLKOMMEN TILL</p>
      <h1 className="font-display text-3xl leading-tight text-warning sm:text-4xl lg:text-5xl">
        NÄTHÄNGET
      </h1>
    </div>
  );
}

function AgeBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md border border-primary bg-background/80 px-4 py-2 text-center font-display text-primary backdrop-blur",
        className,
      )}
    >
      <span className="block text-[10px] leading-none sm:text-xs">ÅLDERSGRÄNS</span>
      <span className="mt-1 block text-lg leading-none sm:text-2xl">{MIN_AGE} ÅR</span>
    </div>
  );
}

function Actions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg">
        <Link to="/register">
          <UserPlus className="size-4" />
          Bli medlem
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link to="/login">
          <LogIn className="size-4" />
          Logga in!
        </Link>
      </Button>
    </div>
  );
}

export function Hero() {
  return (
    <section className="w-full overflow-hidden">
      {/* Desktop: helbredds bild med texten ovanpå */}
      <div className="relative hidden w-full lg:block">
        <img
          src={heroUrl}
          alt={HERO_ALT}
          className="h-[clamp(30rem,58vh,44rem)] w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl flex-col justify-center gap-6 px-6">
            <Heading />
            <p className="max-w-md text-lg leading-relaxed text-white/90">{INTRO}</p>
            <Actions />
          </div>
        </div>
        <AgeBadge className="absolute right-6 top-6" />
      </div>

      {/* Mobil: rubrik → bild → text */}
      <div className="lg:hidden">
        <div className="px-4 pt-6">
          <Heading />
        </div>
        <img src={heroMobileUrl} alt={HERO_ALT} className="my-5 w-full object-cover" loading="eager" />
        <div className="space-y-5 px-4 pb-2">
          <p className="leading-relaxed text-foreground/90">{INTRO}</p>
          <Actions />
        </div>
      </div>
    </section>
  );
}
