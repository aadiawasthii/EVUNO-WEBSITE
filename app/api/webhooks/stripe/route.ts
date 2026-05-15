import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { releaseCheckoutReservationForSession, syncPaidCheckoutSessionById } from "@/lib/checkout";
import { requireEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripeSignature = (await headers()).get("stripe-signature");

  if (!stripeSignature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    // Security-sensitive: Stripe webhook verification must use the exact raw request body.
    event = stripe.webhooks.constructEvent(rawBody, stripeSignature, requireEnv("STRIPE_WEBHOOK_SECRET"));
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid webhook signature."
      },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === "paid") {
        await syncPaidCheckoutSessionById(session.id);
      }
    }

    if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await releaseCheckoutReservationForSession(session);
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Webhook handling failed."
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
