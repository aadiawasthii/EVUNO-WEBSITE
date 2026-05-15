import "server-only";

import Stripe from "stripe";

import { requireEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!stripeClient) {
    stripeClient = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
      apiVersion: "2026-02-25.clover" as Stripe.LatestApiVersion,
      maxNetworkRetries: 2,
      appInfo: {
        name: "EVUNO Storefront",
        version: "0.1.0"
      }
    });
  }

  return stripeClient;
}
