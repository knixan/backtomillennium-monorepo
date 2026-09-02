import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { AvatarPicker } from "@/components/avatar-picker";
import { InterestsInput } from "@/components/interests-input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getMyProfile, updateMyProfile, type Profile } from "@/lib/api";
import { avatarUrl } from "@/lib/avatars";
import {
  MAX_BIO_LENGTH,
  profileSchema,
  SWEDISH_COUNTIES,
  type ProfileInput,
} from "@nathanget/shared-types";

// Inloggning krävs – guarden ligger i routes/_authed.tsx.
export const Route = createFileRoute("/_authed/profil/redigera")({
  component: ProfilePage,
});

const favoriteFields = [
  { name: "favoriteMusic", label: "Favoritmusik", placeholder: "Artister, band, låtar…" },
  { name: "favoriteMovies", label: "Favoritfilmer", placeholder: "Filmer du älskar…" },
  { name: "favoriteBooks", label: "Favoritböcker", placeholder: "Böcker du gillar…" },
  { name: "favoriteGames", label: "Favoritspel", placeholder: "Spel du spelar…" },
] as const;

function toFormValues(p: Profile): ProfileInput {
  return {
    avatar: p.avatar ?? "",
    city: p.city ?? "",
    county: p.county ?? "",
    bio: p.bio ?? "",
    favoriteMusic: p.favoriteMusic ?? "",
    favoriteMovies: p.favoriteMovies ?? "",
    favoriteBooks: p.favoriteBooks ?? "",
    favoriteGames: p.favoriteGames ?? "",
    interests: p.interests,
  };
}

const emptyValues: ProfileInput = {
  avatar: "",
  city: "",
  county: "",
  bio: "",
  favoriteMusic: "",
  favoriteMovies: "",
  favoriteBooks: "",
  favoriteGames: "",
  interests: [],
};

function ProfilePage() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: getMyProfile, retry: false });

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: emptyValues,
    // Synkar formuläret när profilen laddats – inget useEffect behövs.
    values: profileQuery.data ? toFormValues(profileQuery.data) : undefined,
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileInput) => updateMyProfile(values),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      form.reset(toFormValues(data));
    },
  });

  if (profileQuery.isLoading) return <Shell>Laddar…</Shell>;
  if (profileQuery.isError || !profileQuery.data) return <Shell>Kunde inte ladda profilen.</Shell>;

  const profile = profileQuery.data;
  const name = profile.displayUsername ?? profile.username ?? "Din profil";
  const currentAvatar = avatarUrl(form.watch("avatar"));
  const bioLength = (form.watch("bio") ?? "").length;
  const location = [form.watch("city"), form.watch("county")].filter(Boolean).join(", ");
  const showSaved = mutation.isSuccess && !form.formState.isDirty;

  return (
    <Shell>
      <header className="flex items-center gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-full border-2 border-primary bg-muted">
          {currentAvatar ? (
            <img src={currentAvatar} alt="" className="size-full object-cover" />
          ) : null}
        </div>
        <div>
          <h1 className="font-display text-2xl text-primary">{name}</h1>
          {profile.firstName ? (
            <p className="text-sm text-muted-foreground">{profile.firstName}</p>
          ) : null}
          {location ? <p className="text-sm text-muted-foreground">{location}</p> : null}
          {profile.username ? (
            <Link
              to="/profil/$username"
              params={{ username: profile.username }}
              className="text-sm text-primary hover:underline"
            >
              ← Tillbaka till profilen
            </Link>
          ) : null}
        </div>
      </header>

      <form
        className="mt-8 space-y-6"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <Controller
          control={form.control}
          name="avatar"
          render={({ field, fieldState }) => (
            <Field label="Profilbild" htmlFor="avatar" error={fieldState.error?.message}>
              <AvatarPicker value={field.value} onChange={field.onChange} />
            </Field>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Ort" htmlFor="city" error={form.formState.errors.city?.message}>
            <Input id="city" autoComplete="address-level2" {...form.register("city")} />
          </Field>

          <Field label="Län" htmlFor="county" error={form.formState.errors.county?.message}>
            <Select id="county" {...form.register("county")}>
              <option value="">Välj län…</option>
              {SWEDISH_COUNTIES.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </Select>
          </Field>
        </div>

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

        <fieldset className="space-y-4">
          <legend className="text-sm font-medium">Favoriter</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {favoriteFields.map((f) => (
              <Field
                key={f.name}
                label={f.label}
                htmlFor={f.name}
                error={form.formState.errors[f.name]?.message}
              >
                <Input id={f.name} placeholder={f.placeholder} {...form.register(f.name)} />
              </Field>
            ))}
          </div>
        </fieldset>

        <Controller
          control={form.control}
          name="interests"
          render={({ field, fieldState }) => (
            <Field label="Intressen & hobbys" htmlFor="interests" error={fieldState.error?.message}>
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
