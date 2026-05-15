import "server-only";

import { OrderStatus, Prisma, ReservationStatus } from "@prisma/client";
import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import { releaseReservationById, releaseReservationBySessionId } from "@/lib/storefront";
import { isSanDiegoFreeShippingPostalCode } from "@/lib/shipping";
import { db, isDatabaseConfigured } from "@/lib/prisma";

export async function syncPaidCheckoutSession(session: Stripe.Checkout.Session) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database configuration is required.");
  }

  const reservationId = session.metadata?.reservationId;

  if (!reservationId) {
    throw new Error("Stripe session metadata is missing reservationId.");
  }

  return db().$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: {
        stripeSessionId: session.id
      }
    });

    if (existingOrder) {
      return existingOrder;
    }

    const reservation = await tx.checkoutReservation.findUnique({
      where: {
        id: reservationId
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    if (!reservation) {
      throw new Error(`Reservation ${reservationId} not found.`);
    }

    let status: OrderStatus = OrderStatus.PAID;

    for (const item of reservation.items) {
      const result = await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
          stock: {
            gte: item.quantity
          }
        },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });

      if (result.count === 0) {
        status = OrderStatus.OVERSOLD_REVIEW;
      }
    }

    await tx.checkoutReservation.update({
      where: {
        id: reservation.id
      },
      data: {
        status: ReservationStatus.COMPLETED,
        completedAt: new Date(),
        stripeSessionId: session.id
      }
    });

    const totalCents =
      session.amount_total ??
      reservation.items.reduce((sum, item) => sum + item.variant.product.priceCents * item.quantity, 0);

    const shippingDetails = session.collected_information?.shipping_details;
    const actualShippingPostalCode = shippingDetails?.address?.postal_code ?? null;
    const requestedShippingPostalCode = session.metadata?.requestedShippingPostalCode ?? null;
    const selectedShippingAmount = session.shipping_cost?.amount_total ?? 0;

    if (
      selectedShippingAmount === 0 &&
      actualShippingPostalCode &&
      !isSanDiegoFreeShippingPostalCode(actualShippingPostalCode)
    ) {
      status = OrderStatus.SHIPPING_REVIEW;
    }

    if (
      selectedShippingAmount === 0 &&
      !actualShippingPostalCode &&
      requestedShippingPostalCode &&
      !isSanDiegoFreeShippingPostalCode(requestedShippingPostalCode)
    ) {
      status = OrderStatus.SHIPPING_REVIEW;
    }

    return tx.order.create({
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
        status,
        customerEmail: session.customer_details?.email ?? session.customer_email ?? "pending@evuno.fit",
        customerName: session.customer_details?.name ?? null,
        shippingName: shippingDetails?.name ?? null,
        shippingAddressJson: (shippingDetails?.address as Prisma.InputJsonValue | undefined) ?? undefined,
        totalCents,
        reservationId: reservation.id,
        orderItems: {
          create: reservation.items.map((item) => ({
            productId: item.variant.product.id,
            variantId: item.variant.id,
            productName: item.variant.product.name,
            size: item.variant.size,
            color: item.variant.color,
            quantity: item.quantity,
            unitPriceCents: item.variant.product.priceCents
          }))
        }
      }
    });
  });
}

export async function syncPaidCheckoutSessionById(sessionId: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const existingOrder = await db().order.findUnique({
    where: {
      stripeSessionId: sessionId
    },
    include: {
      orderItems: true
    }
  });

  if (existingOrder) {
    return existingOrder;
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return null;
    }

    await syncPaidCheckoutSession(session);

    return db().order.findUnique({
      where: {
        stripeSessionId: sessionId
      },
      include: {
        orderItems: true
      }
    });
  } catch {
    return null;
  }
}

export async function releaseCheckoutReservationForSession(session: Stripe.Checkout.Session) {
  const reservationId = session.metadata?.reservationId ?? null;

  if (reservationId) {
    await releaseReservationById(reservationId);
  }

  await releaseReservationBySessionId(session.id);
}
