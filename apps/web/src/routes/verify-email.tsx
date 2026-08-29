import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";

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
    <AuthLayout
      title={error ? "Verifieringen misslyckades" : "E-post bekräftad"}
      description={
        error
          ? "Länken är ogiltig eller har gått ut. Begär en ny verifieringslänk."
          : "Din e-postadress är nu bekräftad."
      }
    >
      <Button asChild className="w-full">
        <Link to="/login">Till inloggningen</Link>
      </Button>
    </AuthLayout>
  );
}
