import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
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

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`backend listening on http://localhost:${info.port}`);
});
