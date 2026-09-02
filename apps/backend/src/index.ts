import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { profileSchema } from "@nathanget/shared-types";
import { prisma } from "./lib/prisma.js";
import { auth } from "./lib/auth.js";

const app = new Hono();

const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173,http://localhost:8081").split(",");

/*
Det här är en konfiguration för CORS (Cross-Origin Resource Sharing) som används i backend-applikationen. 
Den tillåter förfrågningar från specifika ursprung som definieras i miljövariabeln CORS_ORIGINS. 
Om miljövariabeln inte är satt, används standardvärdena http://localhost:5173 och http://localhost:8081.
*/

app.use(
  "*",
  cors({
    origin: allowedOrigins,
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

  // Trimma bort dubbletter (skiftlägesokänsligt) och tomma värden.
  const seen = new Set<string>();
  const interests = parsed.data.interests.filter((i) => {
    const key = i.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const profile = await prisma.user.update({
    where: { id: session.user.id },
    data: { bio: parsed.data.bio || null, interests },
    select: profileSelect,
  });
  return c.json(profile);
});

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`backend listening on http://localhost:${info.port}`);
});
