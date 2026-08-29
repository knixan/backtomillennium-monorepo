import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { expo } from "@better-auth/expo";
import { prisma } from "./prisma.js"

const expoDevelopmentOrigins = ["exp://", "exp://**", "exp://192.168.*.*:*/**"];

/*
Det här är en konfiguration för Better Auth som används i backend-applikationen. 
Den använder Prisma-adaptern för att ansluta till databasen och möjliggör autentisering med e-post och lösenord. 
Den inkluderar också ett plugin för Expo och definierar betrodda ursprung för utvecklingsmiljön.
*/
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  plugins: [expo()],
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:8081",
    "millenium://",
    ...(process.env.NODE_ENV === "development" ? expoDevelopmentOrigins : []),
  ],
});
