import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getEnv, requireEnv } from "@/lib/env";

const ADMIN_COOKIE = "evuno-admin-session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function encode(input: string) {
  return Buffer.from(input, "utf8");
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function getSessionSecret() {
  const env = getEnv();
  return env.ADMIN_SESSION_SECRET ?? env.ADMIN_SECRET ?? null;
}

export function verifyAdminSecret(input: string) {
  const expected = getEnv().ADMIN_SECRET;

  if (!expected) {
    return false;
  }

  const left = encode(input);
  const right = encode(expected);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export async function createAdminSession() {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("ADMIN_SECRET or ADMIN_SESSION_SECRET must be configured.");
  }

  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${expiresAt}`;
  const token = `${payload}.${sign(payload, secret)}`;

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: getEnv().NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(expiresAt)
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: getEnv().NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0)
  });
}

export async function hasAdminSession() {
  const secret = getSessionSecret();

  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!value) {
    return false;
  }

  const [expiresAt, signature] = value.split(".");

  if (!expiresAt || !signature) {
    return false;
  }

  const expectedSignature = sign(expiresAt, secret);
  const left = encode(signature);
  const right = encode(expectedSignature);

  if (left.length !== right.length) {
    return false;
  }

  if (!timingSafeEqual(left, right)) {
    return false;
  }

  return Number(expiresAt) > Date.now();
}

export async function requireAdminSession() {
  const isValid = await hasAdminSession();

  if (!isValid) {
    redirect("/admin/login");
  }
}

export function requireAdminEnv() {
  requireEnv("ADMIN_SECRET");
}
