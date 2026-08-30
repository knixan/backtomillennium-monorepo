import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Vite proxar /api → backend (se vite.config.ts). Better Auth vill ha en absolut URL.
  baseURL: `${window.location.origin}/api/auth`,
  plugins: [
    inferAdditionalFields({
      user: {
        nickname: { type: "string", required: true },
        birthDate: { type: "date", required: true },
        sexAssignedAtBirth: { type: "string", required: true },
        termsAcceptedAt: { type: "date", required: true },
      },
    }),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
