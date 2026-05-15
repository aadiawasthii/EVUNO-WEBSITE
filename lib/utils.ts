import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(priceCents / 100);
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function absoluteUrl(pathname: string) {
  const base = getBaseUrl().replace(/\/$/, "");
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function sortSizes<T extends { size: string }>(items: T[]) {
  const rank = new Map([
    ["S", 0],
    ["M", 1],
    ["L", 2]
  ]);

  return [...items].sort((left, right) => {
    return (rank.get(left.size) ?? Number.MAX_SAFE_INTEGER) - (rank.get(right.size) ?? Number.MAX_SAFE_INTEGER);
  });
}

export function dedupeByVariant<T extends { variantId: string; quantity: number }>(items: T[]) {
  const merged = new Map<string, T>();

  for (const item of items) {
    const existing = merged.get(item.variantId);

    if (!existing) {
      merged.set(item.variantId, { ...item });
      continue;
    }

    merged.set(item.variantId, {
      ...existing,
      quantity: existing.quantity + item.quantity
    });
  }

  return Array.from(merged.values());
}
