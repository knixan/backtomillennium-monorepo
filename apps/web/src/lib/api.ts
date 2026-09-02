import type { ProfileInput } from "@nathanget/shared-types";

export interface Profile {
  id: string;
  username: string | null;
  displayUsername: string | null;
  firstName: string | null;
  bio: string | null;
  interests: string[];
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
