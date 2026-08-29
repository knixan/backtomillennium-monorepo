import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const verifyEmailSearchSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute("/verify-email")({
  validateSearch: verifyEmailSearchSchema,
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { error } = Route.useSearch();

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle className="font-display text-lg leading-relaxed">
            {error ? (
              <span className="text-warning">Verifieringen misslyckades</span>
            ) : (
              <span className="text-primary">E-post bekräftad</span>
            )}
          </CardTitle>
          <CardDescription>
            {error
              ? "Länken är ogiltig eller har gått ut. Begär en ny verifieringslänk."
              : "Din e-postadress är nu bekräftad. Du kan logga in."}
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
