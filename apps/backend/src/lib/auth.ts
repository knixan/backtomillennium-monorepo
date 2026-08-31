import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { expo } from "@better-auth/expo";
import { MIN_AGE, isOldEnough } from "@nathanget/shared-types";
import { prisma } from "./prisma.js";
import { sendEmail } from "./mailer.js";
import { username } from "better-auth/plugins";

const expoDevelopmentOrigins = ["exp://", "exp://**", "exp://192.168.*.*:*/**"];

export const auth = betterAuth({
  basePath: "/auth",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Bekräfta din e-postadress — Näthänget",
        html: `<p>Klicka för att bekräfta din e-postadress:</p><p><a href="${url}">${url}</a></p>`,
      });
    },
  },
  user: {
    additionalFields: {
      // Frivilligt förnamn. Inget efternamn samlas in.
      firstName: {
        type: "string",
        required: false,
      },
      birthDate: {
        type: "date",
        required: true,
      },
      sexAssignedAtBirth: {
        type: ["tjej", "kille"],
        required: true,
      },
      // När användaren godkände villkor + integritetspolicy.
      termsAcceptedAt: {
        type: "date",
        required: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Serversidan har sista ordet (klientvalidering går att kringgå).
        before: async (user) => {
          // Smeknamn (username) är obligatoriskt – username-pluginet tillåter tomt annars.
          const uname = (user as { username?: string | null }).username;
          if (!uname || uname.trim().length < 2) {
            throw new APIError("BAD_REQUEST", { message: "Smeknamn krävs." });
          }

          const birthDate = (user as { birthDate?: Date | string | null }).birthDate;
          const parsed = birthDate ? new Date(birthDate) : null;

          if (!parsed || Number.isNaN(parsed.getTime())) {
            throw new APIError("BAD_REQUEST", { message: "Ogiltigt födelsedatum." });
          }
          if (!isOldEnough(parsed)) {
            throw new APIError("BAD_REQUEST", {
              message: `Du måste vara minst ${MIN_AGE} år för att skapa ett konto.`,
            });
          }

          // Villkor + integritetspolicy måste vara godkända.
          const termsAcceptedAt = (user as { termsAcceptedAt?: Date | string | null })
            .termsAcceptedAt;
          const acceptedAt = termsAcceptedAt ? new Date(termsAcceptedAt) : null;
          if (!acceptedAt || Number.isNaN(acceptedAt.getTime())) {
            throw new APIError("BAD_REQUEST", {
              message: "Du måste godkänna villkoren och integritetspolicyn.",
            });
          }
        },
      },
    },
  },
  plugins: [
    // Tillåter inloggning med smeknamn (username) utöver e-post.
    username({ minUsernameLength: 2, maxUsernameLength: 30 }),
    expo(),
  ],
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:8081",
    "nathanget://",
    ...(process.env.NODE_ENV === "development" ? expoDevelopmentOrigins : []),
  ],
});
