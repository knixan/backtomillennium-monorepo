import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { expo } from "@better-auth/expo";
import { prisma } from "./prisma.js";
import { sendEmail } from "./mailer.js";

const expoDevelopmentOrigins = ["exp://", "exp://**", "exp://192.168.*.*:*/**"];

export const auth = betterAuth({
  basePath: "/auth",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
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
      nickname: {
        type: "string",
        required: true,
      },
      birthDate: {
        type: "date",
        required: true,
      },
      sexAssignedAtBirth: {
        type: ["tjej", "kille"],
        required: true,
      },
    },
  },
  plugins: [expo()],
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:8081",
    "nathanget://",
    ...(process.env.NODE_ENV === "development" ? expoDevelopmentOrigins : []),
  ],
});
