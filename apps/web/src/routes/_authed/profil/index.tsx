import { createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

/** /profil skickar vidare till din egna profil-vy (/profil/<ditt-smeknamn>). */
export const Route = createFileRoute("/_authed/profil/")({
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    const username = (data?.user as { username?: string } | undefined)?.username;
    if (username) {
      throw redirect({ to: "/profil/$username", params: { username } });
    }
    // Saknar smeknamn (borde inte hända) – låt _authed-guarden ta hand om resten.
    throw redirect({ to: "/" });
  },
});
