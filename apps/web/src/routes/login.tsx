import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient, signIn } from "@/lib/auth-client";
import { loginSchema, type LoginInput } from "@nathanget/shared-types";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    setUnverifiedEmail(null);
    setResent(false);

    const { error } = await signIn.email({ email: values.email, password: values.password });

    if (error) {
      if (error.status === 403) {
        setUnverifiedEmail(values.email);
      } else if (error.status === 401) {
        setServerError("Fel e-post eller lösenord.");
      } else {
        setServerError(error.message ?? "Något gick fel. Försök igen.");
      }
      return;
    }

    await navigate({ to: "/" });
  });

  async function resendVerification() {
    if (!unverifiedEmail) return;
    await authClient.sendVerificationEmail({
      email: unverifiedEmail,
      callbackURL: `${window.location.origin}/verify-email`,
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
        <Field label="E-post" htmlFor="email" error={form.formState.errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
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

        {unverifiedEmail ? (
          <div className="space-y-2 rounded-md border border-border bg-muted p-3 text-sm">
            <p className="text-muted-foreground">
              Din e-post är inte bekräftad än. Kolla mejlen för verifieringslänken.
            </p>
            {resent ? (
              <p className="text-cyan">Ny länk skickad.</p>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={resendVerification}>
                Skicka ny länk
              </Button>
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
