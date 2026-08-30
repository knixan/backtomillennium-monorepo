import { z } from "zod";

/** Lägsta tillåtna ålder för att skapa ett konto på Näthänget. */
export const MIN_AGE = 13;

export const sexAssignedAtBirthValues = ["tjej", "kille"] as const;
export type SexAssignedAtBirth = (typeof sexAssignedAtBirthValues)[number];

/**
 * Ålder i hela år vid `now`, räknat enbart på kalenderdatum.
 * Ingen tid och ingen tidszon är inblandad – `birthDate` ska vara ett
 * rent datum (`YYYY-MM-DD` eller en Date som representerar det).
 */
export function calculateAge(birthDate: Date | string, now: Date = new Date()): number {
  const b = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  let age = now.getFullYear() - b.getFullYear();
  const monthDiff = now.getMonth() - b.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < b.getDate())) {
    age -= 1;
  }
  return age;
}

export function isOldEnough(birthDate: Date | string, now: Date = new Date()): boolean {
  return calculateAge(birthDate, now) >= MIN_AGE;
}

const nickname = z
  .string()
  .trim()
  .min(2, "Smeknamnet måste vara minst 2 tecken")
  .max(30, "Smeknamnet får vara högst 30 tecken");

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Ogiltig e-postadress"));

const password = z
  .string()
  .min(8, "Lösenordet måste vara minst 8 tecken")
  .max(128, "Lösenordet får vara högst 128 tecken");

/** `YYYY-MM-DD`, inte i framtiden, och minst {@link MIN_AGE} år gammalt. */
export const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ange ett giltigt datum")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Ange ett giltigt datum")
  .refine((v) => new Date(v) <= new Date(), "Datumet kan inte vara i framtiden")
  .refine((v) => isOldEnough(v), `Du måste vara minst ${MIN_AGE} år för att gå med`);

const sexAssignedAtBirth = z.enum(sexAssignedAtBirthValues, { error: "Välj ett alternativ" });

const acceptTerms = z
  .boolean()
  .refine((v) => v === true, "Du måste godkänna villkoren och integritetspolicyn");

export const registerSchema = z
  .object({
    nickname,
    email,
    password,
    confirmPassword: z.string(),
    birthDate: birthDateSchema,
    sexAssignedAtBirth,
    acceptTerms,
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Ange ditt lösenord"),
});

export type LoginInput = z.infer<typeof loginSchema>;
