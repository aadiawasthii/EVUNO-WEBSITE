import { NextResponse } from "next/server";

import { assertStripeCheckoutOperational } from "@/lib/stripe-checkout-config";
import { getStripe } from "@/lib/stripe";
import { limitByKey } from "@/lib/rate-limit";
import { attachSessionToReservation, releaseReservationById, reserveInventory, resolveCheckoutSelections } from "@/lib/storefront";
import { absoluteUrl, dedupeByVariant } from "@/lib/utils";
import { checkoutRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateLimit = limitByKey(`checkout:${forwardedFor}`, 8, 1000 * 60 * 5);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many checkout attempts. Please wait a few minutes and try again."
      },
      { status: 429 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Cart payload validation failed." }, { status: 400 });
  }

  let checkoutConfig: ReturnType<typeof assertStripeCheckoutOperational>;

  try {
    checkoutConfig = assertStripeCheckoutOperational(parsed.data.shippingPostalCode);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Checkout is not configured."
      },
      { status: 503 }
    );
  }

  const items = dedupeByVariant(parsed.data.items);
  let reservationId: string | null = null;

  try {
    const resolvedItems = await resolveCheckoutSelections(items);
    const reservation = await reserveInventory(resolvedItems);
    reservationId = reservation.id;
    const totalQuantity = reservation.items.reduce((sum, item) => sum + item.quantity, 0);

    const stripe = getStripe();

    // Security-sensitive: line item pricing is built exclusively from server-side product data.
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        success_url: absoluteUrl("/checkout/success?session_id={CHECKOUT_SESSION_ID}"),
        cancel_url: absoluteUrl("/checkout/cancel"),
        client_reference_id: reservation.id,
        billing_address_collection: checkoutConfig.billingAddressCollection,
        shipping_address_collection: {
          allowed_countries: checkoutConfig.allowedCountries
        },
        automatic_tax: {
          enabled: checkoutConfig.automaticTaxEnabled
        },
        allow_promotion_codes: checkoutConfig.allowPromotionCodes,
        customer_creation: "always",
        phone_number_collection: {
          enabled: checkoutConfig.phoneNumberCollectionEnabled
        },
        shipping_options: checkoutConfig.shippingOptions.length ? checkoutConfig.shippingOptions : undefined,
        expires_at: Math.floor(reservation.expiresAt.getTime() / 1000),
        metadata: {
          reservationId: reservation.id,
          checkoutSource: "evuno-storefront",
          itemCount: String(totalQuantity),
          requestedShippingPostalCode: parsed.data.shippingPostalCode
        },
        payment_intent_data: {
          metadata: {
            reservationId: reservation.id,
            checkoutSource: "evuno-storefront",
            requestedShippingPostalCode: parsed.data.shippingPostalCode
          }
        },
        line_items: reservation.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: item.variant.product.priceCents,
            product_data: {
              name: item.variant.product.name,
              description: `${item.variant.size} / ${item.variant.color}`,
              images: item.variant.product.imageUrl ? [absoluteUrl(item.variant.product.imageUrl)] : [],
              metadata: {
                productId: item.variant.product.id,
                variantId: item.variant.id,
                slug: item.variant.product.slug,
                size: item.variant.size,
                color: item.variant.color,
                sku: item.variant.sku
              }
            }
          }
        }))
      },
      {
        idempotencyKey: `checkout-session:${reservation.id}`
      }
    );

    await attachSessionToReservation(reservation.id, session.id);

    return NextResponse.json({
      url: session.url
    });
  } catch (error) {
    if (reservationId) {
      await releaseReservationById(reservationId);
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create checkout session."
      },
      { status: 400 }
    );
  }
}
