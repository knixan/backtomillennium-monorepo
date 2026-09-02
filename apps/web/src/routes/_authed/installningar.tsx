import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/installningar")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="font-display text-2xl text-primary">Inställningar</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Konto- och sekretessinställningar kommer snart. Under tiden kan du{" "}
        <Link to="/profil/redigera" className="text-primary hover:underline">
          redigera din profil
        </Link>
        .
      </p>
    </main>
  );
}
