import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { AuthLayout } from "@/components/auth-layout";
import { TermsCheckbox } from "@/components/terms-checkbox";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { authClient, signUp, VERIFY_EMAIL_CALLBACK_URL } from "@/lib/auth-client";
import {
  registerSchema,
  sexAssignedAtBirthValues,
  type RegisterInput,
} from "@nathanget/shared-types";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const today = new Date().toISOString().slice(0, 10);

const sexOptions = sexAssignedAtBirthValues.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      firstName: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      acceptTerms: false,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const firstName = values.firstName?.trim() || undefined;
    const { error } = await signUp.email({
      name: firstName ?? values.username,
      firstName,
      username: values.username,
      email: values.email,
      password: values.password,
      birthDate: new Date(values.birthDate),
      sexAssignedAtBirth: values.sexAssignedAtBirth,
      termsAcceptedAt: new Date(),
      callbackURL: VERIFY_EMAIL_CALLBACK_URL,
    });

    if (error) {
      // Upptaget smeknamn: visa felet vid fältet.
      if (error.code === "USERNAME_IS_ALREADY_TAKEN") {
        form.setError("username", { message: "Smeknamnet är upptaget. Välj ett annat." });
      } else {
        setServerError(error.message ?? "Något gick fel. Försök igen.");
      }
      return;
    }

    // Obs: en redan registrerad e-post ger också "success" (Better Auth avslöjar
    // inte vilka adresser som har konton). Bekräftelseskärmen tar höjd för det.
    setRegisteredEmail(values.email);
  });

  async function resendVerification() {
    if (!registeredEmail) return;
    await authClient.sendVerificationEmail({
      email: registeredEmail,
      callbackURL: VERIFY_EMAIL_CALLBACK_URL,
    });
    setResent(true);
  }

  if (registeredEmail) {
    return (
      <AuthLayout
        title="Kolla din mejl"
        description="Ett sista steg innan du kommer in."
        footer={
          <Link to="/login" className="text-primary hover:underline">
            Till inloggningen
          </Link>
        }
      >
        <div className="space-y-4 text-sm text-muted-foreground">
          <MailCheck className="size-8 text-cyan" aria-hidden />
          <p>
            Vi har skickat en verifieringslänk till{" "}
            <strong className="text-foreground">{registeredEmail}</strong>. Klicka på länken i
            mejlet för att aktivera ditt konto.
          </p>

          <div className="space-y-2 rounded-md border border-border bg-muted p-3">
            <p className="font-medium text-foreground">Ingen mejl inom några minuter?</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Kolla skräpposten.</li>
              <li>
                Har du redan ett konto?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Logga in
                </Link>{" "}
                istället.
              </li>
            </ul>
            {resent ? (
              <p className="text-cyan">Ny länk skickad.</p>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={resendVerification}>
                Skicka länken igen
              </Button>
            )}
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Bli medlem"
      description="Näthänget har 13-årsgräns."
      footer={
        <span>
          Har du redan ett konto?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Logga in
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field label="Smeknamn" htmlFor="username" error={form.formState.errors.username?.message}>
          <Input id="username" autoComplete="username" {...form.register("username")} />
        </Field>

        <Field
          label="Förnamn (valfritt)"
          htmlFor="firstName"
          error={form.formState.errors.firstName?.message}
        >
          <Input id="firstName" autoComplete="given-name" {...form.register("firstName")} />
        </Field>

        <Field label="E-post" htmlFor="email" error={form.formState.errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        </Field>

        <Field
          label="Födelsedatum"
          htmlFor="birthDate"
          error={form.formState.errors.birthDate?.message}
          hint="Du måste vara minst 13 år."
        >
          <Input id="birthDate" type="date" max={today} {...form.register("birthDate")} />
        </Field>

        <Controller
          control={form.control}
          name="sexAssignedAtBirth"
          render={({ field, fieldState }) => (
            <Field
              label="Kön vid födsel"
              htmlFor="sexAssignedAtBirth"
              error={fieldState.error?.message}
            >
              <SegmentedControl
                id="sexAssignedAtBirth"
                value={field.value}
                onChange={field.onChange}
                options={sexOptions}
              />
            </Field>
          )}
        />

        <Field label="Lösenord" htmlFor="password" error={form.formState.errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
          />
        </Field>

        <Field
          label="Bekräfta lösenord"
          htmlFor="confirmPassword"
          error={form.formState.errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
        </Field>

        <Controller
          control={form.control}
          name="acceptTerms"
          render={({ field, fieldState }) => (
            <TermsCheckbox
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        {serverError ? (
          <p className="text-sm text-destructive" role="alert">
            {serverError}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Skapar konto…" : "Bli medlem"}
        </Button>
      </form>
    </AuthLayout>
  );
}
