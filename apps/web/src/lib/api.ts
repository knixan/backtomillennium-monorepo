import type { ProfileInput } from "@nathanget/shared-types";

/** Fält som visas på en profil (både egen och andras). */
export interface ProfileFields {
  username: string | null;
  displayUsername: string | null;
  firstName: string | null;
  avatar: string | null;
  city: string | null;
  county: string | null;
  bio: string | null;
  favoriteMusic: string | null;
  favoriteMovies: string | null;
  favoriteBooks: string | null;
  favoriteGames: string | null;
  interests: string[];
}

/** Egen profil (redigerbar). */
export interface Profile extends ProfileFields {
  id: string;
}

/** Annan användares profil – ingen e-post/exakt födelsedatum, bara ålder. */
export interface PublicProfile extends ProfileFields {
  age: number;
  createdAt: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Begäran misslyckades (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function getMyProfile() {
  return request<Profile>("/me/profile");
}

export function updateMyProfile(input: ProfileInput) {
  return request<Profile>("/me/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function getUserProfile(username: string) {
  return request<PublicProfile>(`/users/${encodeURIComponent(username)}`);
}
