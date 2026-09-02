import { BookOpen, Film, Gamepad2, Music } from "lucide-react";
import type { ReactNode } from "react";

import heroBg from "@/assets/hero.webp";
import type { ProfileFields } from "@/lib/api";
import { avatarUrl } from "@/lib/avatars";

interface ProfileViewProps {
  profile: ProfileFields & { age?: number; createdAt?: string };
  /** Knappar (Redigera profil m.m.) – visas bara på din egen profil. */
  action?: ReactNode;
}

type FavoriteKey = "favoriteMovies" | "favoriteBooks" | "favoriteMusic" | "favoriteGames";

const favorites: { key: FavoriteKey; label: string; icon: typeof Film }[] = [
  { key: "favoriteMovies", label: "Filmer & Serier", icon: Film },
  { key: "favoriteBooks", label: "Böcker", icon: BookOpen },
  { key: "favoriteMusic", label: "Musik", icon: Music },
  { key: "favoriteGames", label: "Spel", icon: Gamepad2 },
];

const memberSince = (iso: string) =>
  new Intl.DateTimeFormat("sv-SE", { month: "long", year: "numeric" }).format(new Date(iso));

function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-5 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

function Heading({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <h2
      className={`font-sans text-lg font-semibold text-cyan ${center ? "text-center tracking-wide" : ""}`}
    >
      {children}
    </h2>
  );
}

export function ProfileView({ profile, action }: ProfileViewProps) {
  const name = profile.displayUsername ?? profile.username ?? "Profil";
  const metaLine = [
    profile.age != null ? `${profile.age} år` : null,
    [profile.city, profile.county].filter(Boolean).join(", ") || null,
  ]
    .filter(Boolean)
    .join(" · ");
  const shownFavorites = favorites.filter((f) => profile[f.key]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border">
        <img src={heroBg} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-card via-card/90 to-card/30" />
        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:gap-6">
          <div className="size-28 shrink-0 overflow-hidden rounded-full border-4 border-warning bg-muted shadow-lg">
            {avatarUrl(profile.avatar) ? (
              <img src={avatarUrl(profile.avatar)!} alt="" className="size-full object-cover" />
            ) : null}
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl text-cyan">{name}</h1>
            {metaLine ? <p className="text-sm text-foreground/90">{metaLine}</p> : null}
            {profile.bio ? (
              <p className="line-clamp-3 max-w-md text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                {profile.bio}
              </p>
            ) : null}
            {profile.createdAt ? (
              <p className="text-sm">
                <span className="block text-xs font-medium text-cyan">Medlem sedan</span>
                <span className="capitalize">{memberSince(profile.createdAt)}</span>
              </p>
            ) : null}
            {action ? <div className="flex flex-wrap gap-3 pt-2">{action}</div> : null}
          </div>
        </div>
      </section>

      {/* Om mig */}
      <Card>
        <Heading>Om mig</Heading>
        <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
          {profile.bio ?? "Ingen beskrivning än."}
        </p>
      </Card>

      {/* 3 kolumner */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <Heading>Intressen &amp; Hobbys</Heading>
          {profile.interests.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <li
                  key={interest}
                  className="rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  {interest}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Inga intressen än.</p>
          )}
        </Card>

        <Card>
          <Heading center>FAVORITER</Heading>
          {shownFavorites.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {shownFavorites.map(({ key, label, icon: Icon }) => (
                <div key={key} className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0 text-cyan" aria-hidden />
                    <h3 className="font-sans text-base font-semibold">{label}</h3>
                  </div>
                  <p className="mt-2 text-sm whitespace-pre-wrap text-foreground/80">
                    {profile[key]}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-center text-sm text-muted-foreground">Inga favoriter än.</p>
          )}
        </Card>

        <Card>
          <Heading>Senast Online</Heading>
          <p className="mt-4 text-sm text-muted-foreground">Kommer snart.</p>
        </Card>
      </div>
    </div>
  );
}
