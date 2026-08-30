import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signUp } from "@/lib/auth-client";
import { registerSchema, sexAssignedAtBirthValues, type RegisterInput } from "@nathanget/shared-types";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const today = new Date().toISOString().slice(0, 10);

function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nickname: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      acceptTerms: false,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const { error } = await signUp.email({
      name: values.nickname,
      email: values.email,
      password: values.password,
      nickname: values.nickname,
      birthDate: new Date(values.birthDate),
      sexAssignedAtBirth: values.sexAssignedAtBirth,
      termsAcceptedAt: new Date(),
      callbackURL: `${window.location.origin}/verify-email`,
    });

    if (error) {
      setServerError(error.message ?? "Något gick fel. Försök igen.");
      return;
    }

    setRegisteredEmail(values.email);
  });

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
            Vi har skickat en verifieringslänk till <strong className="text-foreground">{registeredEmail}</strong>.
            Klicka på länken i mejlet för att aktivera ditt konto.
          </p>
          <p>Hittar du inget mejl? Kolla skräpposten.</p>
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
        <Field label="Smeknamn" htmlFor="nickname" error={form.formState.errors.nickname?.message}>
          <Input id="nickname" autoComplete="nickname" {...form.register("nickname")} />
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
            <Field label="Kön vid födsel" htmlFor="sexAssignedAtBirth" error={fieldState.error?.message}>
              <div id="sexAssignedAtBirth" className="grid grid-cols-2 gap-2">
                {sexAssignedAtBirthValues.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={field.value === value ? "default" : "outline"}
                    onClick={() => field.onChange(value)}
                    className={cn("capitalize", field.value === value && "ring-2 ring-ring")}
                  >
                    {value}
                  </Button>
                ))}
              </div>
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
            <div className="space-y-1.5">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="acceptTerms"
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                  aria-invalid={Boolean(fieldState.error)}
                  className="mt-0.5"
                />
                <label htmlFor="acceptTerms" className="text-sm leading-snug text-muted-foreground">
                  Jag godkänner Näthängets{" "}
                  <Link to="/villkor" target="_blank" className="text-primary hover:underline">
                    villkor
                  </Link>{" "}
                  och{" "}
                  <Link
                    to="/integritetspolicy"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    integritetspolicy
                  </Link>
                  .
                </label>
              </div>
              {fieldState.error ? (
                <p className="text-xs text-destructive" role="alert">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
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
