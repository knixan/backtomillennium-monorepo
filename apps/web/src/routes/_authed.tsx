import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

/**
 * Layoutroute för sidor som kräver inloggning. Alla routes under `_authed/`
 * ärver guarden nedan – ingen per-sida-kontroll behövs.
 */
export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ location }) => {
    const { data } = await authClient.getSession();
    if (!data) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  return <Outlet />;
}
