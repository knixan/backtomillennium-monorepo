import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { InterestsInput } from "@/components/interests-input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { getMyProfile, updateMyProfile } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { MAX_BIO_LENGTH, profileSchema, type ProfileInput } from "@nathanget/shared-types";

export const Route = createFileRoute("/profil")({
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProfilePage,
});

function ProfilePage() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: getMyProfile });

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { bio: "", interests: [] },
    // Synkar formuläret när profilen laddats – inget useEffect behövs.
    values: profileQuery.data
      ? { bio: profileQuery.data.bio ?? "", interests: profileQuery.data.interests }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileInput) => updateMyProfile(values),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      form.reset({ bio: data.bio ?? "", interests: data.interests });
    },
  });

  if (profileQuery.isLoading) {
    return <Shell>Laddar…</Shell>;
  }
  if (profileQuery.isError) {
    return <Shell>Kunde inte ladda profilen.</Shell>;
  }

  const name = profileQuery.data?.displayUsername ?? profileQuery.data?.username ?? "Din profil";
  const bioLength = (form.watch("bio") ?? "").length;
  const showSaved = mutation.isSuccess && !form.formState.isDirty;

  return (
    <Shell>
      <h1 className="font-display text-2xl text-primary">{name}</h1>
      {profileQuery.data?.firstName ? (
        <p className="mt-1 text-sm text-muted-foreground">{profileQuery.data.firstName}</p>
      ) : null}

      <form
        className="mt-8 space-y-6"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <Field
          label="Om mig"
          htmlFor="bio"
          error={form.formState.errors.bio?.message}
          hint={`${bioLength}/${MAX_BIO_LENGTH} tecken`}
        >
          <Textarea
            id="bio"
            rows={5}
            maxLength={MAX_BIO_LENGTH}
            placeholder="Berätta lite om dig själv…"
            {...form.register("bio")}
          />
        </Field>

        <Controller
          control={form.control}
          name="interests"
          render={({ field, fieldState }) => (
            <Field
              label="Intressen & hobbys"
              htmlFor="interests"
              error={fieldState.error?.message}
            >
              <InterestsInput id="interests" value={field.value} onChange={field.onChange} />
            </Field>
          )}
        />

        {mutation.isError ? (
          <p className="text-sm text-destructive" role="alert">
            {(mutation.error as Error).message}
          </p>
        ) : null}
        {showSaved ? <p className="text-sm text-cyan">Sparat!</p> : null}

        <Button type="submit" disabled={mutation.isPending || !form.formState.isDirty}>
          {mutation.isPending ? "Sparar…" : "Spara profil"}
        </Button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">{children}</main>;
}
