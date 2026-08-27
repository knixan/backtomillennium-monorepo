import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prisma } from "./lib/prisma.js";

const app = new Hono();

const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173,http://localhost:8081").split(",");

app.use(
  "*",
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.get("/health", async (c) => {
  await prisma.$queryRaw`SELECT 1`;
  return c.json({ status: "ok" });
});

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`backend listening on http://localhost:${info.port}`);
});
