import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Vite proxar /api → backend (se vite.config.ts). Better Auth vill ha en absolut URL.
  baseURL: `${window.location.origin}/api/auth`,
  plugins: [
    usernameClient(),
    inferAdditionalFields({
      user: {
        firstName: { type: "string", required: false },
        birthDate: { type: "date", required: true },
        sexAssignedAtBirth: { type: "string", required: true },
        termsAcceptedAt: { type: "date", required: true },
      },
    }),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
