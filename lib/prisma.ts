import "server-only";

import { PrismaClient } from "@prisma/client";

declare global {
  var evunoPrisma: PrismaClient | undefined;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function db() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.evunoPrisma) {
    globalThis.evunoPrisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
    });
  }

  return globalThis.evunoPrisma;
}
