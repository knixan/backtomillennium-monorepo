import { PrismaClient } from "@prisma/client";

// Återanvänd samma klient över hot-reloads i dev (tsx watch skapar annars en ny
// PrismaClient per omladdning → anslutningspoolen tar slut).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
