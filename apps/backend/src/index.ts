import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { profileSchema } from "@nathanget/shared-types";
import { env } from "./lib/env.js";
import { prisma } from "./lib/prisma.js";
import { auth } from "./lib/auth.js";

const app = new Hono();

// Tillåtna origins för frontend-apparna (kommaseparerade i CORS_ORIGINS).
app.use(
  "*",
  cors({
    origin: env.CORS_ORIGINS.split(","),
    credentials: true,
  }),
);

app.all("/auth/*", (c) => auth.handler(c.req.raw));

app.get("/health", async (c) => {
  await prisma.$queryRaw`SELECT 1`;
  return c.json({ status: "ok" });
});

// --- Profil (kräver inloggning) ---

const profileSelect = {
  id: true,
  username: true,
  displayUsername: true,
  firstName: true,
  bio: true,
  interests: true,
} as const;

app.get("/me/profile", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Inte inloggad" }, 401);

  const profile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: profileSelect,
  });
  return c.json(profile);
});

app.patch("/me/profile", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Inte inloggad" }, 401);

  const parsed = profileSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message ?? "Ogiltig data" }, 400);
  }

  const profile = await prisma.user.update({
    where: { id: session.user.id },
    data: { bio: parsed.data.bio || null, interests: parsed.data.interests },
    select: profileSelect,
  });
  return c.json(profile);
});

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`backend listening on http://localhost:${info.port}`);
});
