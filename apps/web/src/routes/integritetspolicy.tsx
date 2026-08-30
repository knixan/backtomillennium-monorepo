import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/integritetspolicy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="font-display text-2xl text-primary">Integritetspolicy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Senast uppdaterad: 2026-08-30</p>

      <div className="mt-8 space-y-6 leading-relaxed text-foreground/90">
        <p className="rounded-md border border-warning/40 bg-warning/10 p-4 text-sm">
          Platshållartext – ersätt med Näthängets faktiska integritetspolicy innan lansering.
        </p>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-foreground">Vilka uppgifter vi samlar in</h2>
          <p>
            När du skapar ett konto sparar vi din e-postadress, ditt smeknamn, ditt födelsedatum,
            kön vid födsel samt tidpunkten då du godkände villkoren.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-foreground">Hur vi använder uppgifterna</h2>
          <p>
            Uppgifterna används för att driva tjänsten, verifiera din ålder och hålla plattformen
            trygg. Vi säljer aldrig dina uppgifter.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-foreground">Dina rättigheter</h2>
          <p>
            Du har rätt att få ut, rätta eller radera dina uppgifter. Kontakta oss så hjälper vi
            dig.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-foreground">Lagring</h2>
          <p>Uppgifterna sparas så länge du har ett konto och raderas när kontot tas bort.</p>
        </section>
      </div>
    </main>
  );
}
