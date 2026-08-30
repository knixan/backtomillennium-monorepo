import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/villkor")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="font-display text-2xl text-primary">Användarvillkor</h1>
      <p className="mt-2 text-sm text-muted-foreground">Senast uppdaterad: 2026-08-30</p>

      <div className="mt-8 space-y-6 leading-relaxed text-foreground/90">
        <p className="rounded-md border border-warning/40 bg-warning/10 p-4 text-sm">
          Platshållartext – ersätt med Näthängets faktiska villkor innan lansering.
        </p>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-foreground">1. Om tjänsten</h2>
          <p>
            Näthänget är en social mötesplats. Genom att skapa ett konto godkänner du dessa villkor.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-foreground">2. Åldersgräns</h2>
          <p>Du måste vara minst 13 år för att använda Näthänget.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-foreground">3. Uppförande</h2>
          <p>
            Behandla andra med respekt. Trakasserier, hot, olagligt innehåll och spam är inte
            tillåtet och kan leda till avstängning.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-foreground">4. Ditt innehåll</h2>
          <p>
            Du ansvarar för det du publicerar. Du behåller rättigheterna till ditt innehåll men ger
            Näthänget rätt att visa det inom tjänsten.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-foreground">5. Kontakt</h2>
          <p>Frågor om villkoren? Hör av dig via Kontakta oss.</p>
        </section>
      </div>
    </main>
  );
}
