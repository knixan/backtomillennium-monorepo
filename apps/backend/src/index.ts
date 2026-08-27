import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prisma } from "./lib/prisma.js";

const app = new Hono();

app.get("/health", async (c) => {
  await prisma.$queryRaw`SELECT 1`;
  return c.json({ status: "ok" });
});

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`backend listening on http://localhost:${info.port}`);
});
