import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient, signIn, VERIFY_EMAIL_CALLBACK_URL } from "@/lib/auth-client";
import { loginSchema, type LoginInput } from "@nathanget/shared-types";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const [serverError, setServerError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState<{ email: string | null } | null>(null);
  const [resent, setResent] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    setUnverified(null);
    setResent(false);

    const identifier = values.identifier;
    const isEmail = identifier.includes("@");

    const { error } = isEmail
      ? await signIn.email({ email: identifier, password: values.password })
      : await signIn.username({ username: identifier, password: values.password });

    if (error) {
      if (error.status === 403) {
        setUnverified({ email: isEmail ? identifier : null });
      } else if (error.status === 401) {
        setServerError("Fel uppgifter. Kontrollera e-post/smeknamn och lösenord.");
      } else {
        setServerError(error.message ?? "Något gick fel. Försök igen.");
      }
      return;
    }

    await navigate({ to: redirectTo ?? "/" });
  });

  async function resendVerification() {
    if (!unverified?.email) return;
    await authClient.sendVerificationEmail({
      email: unverified.email,
      callbackURL: VERIFY_EMAIL_CALLBACK_URL,
    });
    setResent(true);
  }

  return (
    <AuthLayout
      title="Logga in"
      footer={
        <span>
          Ny här?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Bli medlem
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field
          label="E-post eller smeknamn"
          htmlFor="identifier"
          error={form.formState.errors.identifier?.message}
        >
          <Input
            id="identifier"
            autoComplete="username"
            autoCapitalize="none"
            {...form.register("identifier")}
          />
        </Field>

        <Field label="Lösenord" htmlFor="password" error={form.formState.errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
        </Field>

        {serverError ? (
          <p className="text-sm text-destructive" role="alert">
            {serverError}
          </p>
        ) : null}

        {unverified ? (
          <div className="space-y-2 rounded-md border border-border bg-muted p-3 text-sm">
            <p className="text-muted-foreground">
              Din e-post är inte bekräftad än. Kolla mejlen för verifieringslänken.
            </p>
            {unverified.email ? (
              resent ? (
                <p className="text-cyan">Ny länk skickad.</p>
              ) : (
                <Button type="button" variant="outline" size="sm" onClick={resendVerification}>
                  Skicka ny länk
                </Button>
              )
            ) : (
              <p className="text-muted-foreground">
                Logga in med din e-postadress för att skicka en ny länk.
              </p>
            )}
          </div>
        ) : null}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Loggar in…" : "Logga in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
