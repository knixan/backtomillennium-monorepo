import { describe, expect, it } from "vitest";

import {
  calculateAge,
  dedupeInterests,
  isOldEnough,
  loginSchema,
  MAX_INTERESTS,
  MIN_AGE,
  profileSchema,
  registerSchema,
} from "./index.js";

describe("calculateAge / isOldEnough", () => {
  it("räknar hela år", () => {
    const now = new Date("2026-09-01");
    expect(calculateAge("2000-09-01", now)).toBe(26);
    expect(calculateAge("2000-01-01", now)).toBe(26);
    expect(calculateAge("2000-12-31", now)).toBe(25);
  });

  it("räknar inte upp förrän födelsedagen passerat", () => {
    const now = new Date("2026-09-01");
    expect(calculateAge("2013-09-01", now)).toBe(13); // fyller år idag
    expect(calculateAge("2013-09-02", now)).toBe(12); // fyller år imorgon
  });

  it("isOldEnough respekterar MIN_AGE", () => {
    const now = new Date("2026-09-01");
    expect(isOldEnough(`${2026 - MIN_AGE}-09-01`, now)).toBe(true);
    expect(isOldEnough(`${2026 - MIN_AGE}-09-02`, now)).toBe(false);
    expect(isOldEnough(`${2026 - MIN_AGE + 1}-01-01`, now)).toBe(false);
  });
});

describe("dedupeInterests", () => {
  it("tar bort dubbletter skiftlägesokänsligt och behåller ordning", () => {
    expect(dedupeInterests(["Musik", "musik", "Foto"])).toEqual(["Musik", "Foto"]);
  });

  it("trimmar och tar bort tomma", () => {
    expect(dedupeInterests(["  Skate  ", "", "   "])).toEqual(["Skate"]);
  });
});

describe("registerSchema", () => {
  const base = {
    username: "kalle_2011",
    firstName: "",
    email: "Kalle@Example.com",
    password: "hemligt123",
    confirmPassword: "hemligt123",
    birthDate: "2005-01-01",
    sexAssignedAtBirth: "kille",
    acceptTerms: true,
  };

  it("godkänner giltig indata och normaliserar e-post", () => {
    const result = registerSchema.parse(base);
    expect(result.email).toBe("kalle@example.com");
  });

  it("kräver att villkoren godkänns", () => {
    expect(registerSchema.safeParse({ ...base, acceptTerms: false }).success).toBe(false);
  });

  it("nekar för unga", () => {
    const tooYoung = `${new Date().getFullYear() - 5}-01-01`;
    expect(registerSchema.safeParse({ ...base, birthDate: tooYoung }).success).toBe(false);
  });

  it("nekar ogiltiga tecken i smeknamn", () => {
    expect(registerSchema.safeParse({ ...base, username: "kalle anka" }).success).toBe(false);
  });

  it("kräver att lösenorden matchar", () => {
    expect(registerSchema.safeParse({ ...base, confirmPassword: "annat123" }).success).toBe(false);
  });

  it("kräver minst 8 tecken i lösenord", () => {
    expect(
      registerSchema.safeParse({ ...base, password: "kort", confirmPassword: "kort" }).success,
    ).toBe(false);
  });
});

describe("loginSchema", () => {
  it("godkänner e-post eller smeknamn", () => {
    expect(loginSchema.safeParse({ identifier: "kalle", password: "x" }).success).toBe(true);
    expect(loginSchema.safeParse({ identifier: "k@e.se", password: "x" }).success).toBe(true);
  });

  it("kräver identifierare och lösenord", () => {
    expect(loginSchema.safeParse({ identifier: "", password: "x" }).success).toBe(false);
    expect(loginSchema.safeParse({ identifier: "kalle", password: "" }).success).toBe(false);
  });
});

describe("profileSchema", () => {
  const base = {
    avatar: "",
    city: "",
    county: "",
    bio: "",
    favoriteMusic: "",
    favoriteMovies: "",
    favoriteBooks: "",
    favoriteGames: "",
    interests: [] as string[],
  };

  it("godkänner tom profil", () => {
    expect(profileSchema.safeParse(base).success).toBe(true);
  });

  it("avdubblar intressen via transform", () => {
    const result = profileSchema.parse({ ...base, interests: ["A", "a", "B"] });
    expect(result.interests).toEqual(["A", "B"]);
  });

  it("nekar för lång bio", () => {
    expect(profileSchema.safeParse({ ...base, bio: "x".repeat(501) }).success).toBe(false);
  });

  it("nekar för många intressen", () => {
    const many = Array.from({ length: MAX_INTERESTS + 1 }, (_, i) => `i${i}`);
    expect(profileSchema.safeParse({ ...base, interests: many }).success).toBe(false);
  });

  it("godkänner giltig profilbild och län men nekar ogiltiga", () => {
    expect(profileSchema.safeParse({ ...base, avatar: "profil1" }).success).toBe(true);
    expect(profileSchema.safeParse({ ...base, avatar: "profil5" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...base, county: "Stockholms län" }).success).toBe(true);
    expect(profileSchema.safeParse({ ...base, county: "Osloland" }).success).toBe(false);
  });

  it("nekar för långa favoritfält", () => {
    expect(profileSchema.safeParse({ ...base, favoriteMusic: "x".repeat(121) }).success).toBe(
      false,
    );
  });
});
