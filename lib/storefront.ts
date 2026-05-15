import "server-only";

import { access } from "node:fs/promises";
import path from "node:path";

import { Prisma, ReservationStatus } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

import { seedProducts, type SeedProduct } from "@/lib/catalog";
import { db, isDatabaseConfigured } from "@/lib/prisma";
import { dedupeByVariant, sortSizes } from "@/lib/utils";

export type StoreProduct = SeedProduct & {
  hasModel: boolean;
};

const reservationInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: true
        }
      }
    }
  }
} satisfies Prisma.CheckoutReservationInclude;

async function publicAssetExists(assetPath: string) {
  try {
    const relative = assetPath.replace(/^\/+/, "");
    await access(path.join(process.cwd(), "public", relative));
    return true;
  } catch {
    return false;
  }
}

async function withMedia(product: SeedProduct): Promise<StoreProduct> {
  return {
    ...product,
    hasModel: await publicAssetExists(product.modelUrl)
  };
}

export async function getStoreProducts() {
  const fallbackProducts = await Promise.all(seedProducts.map(withMedia));

  if (!isDatabaseConfigured()) {
    return fallbackProducts;
  }

  try {
    const products = await db().product.findMany({
      where: { active: true },
      include: {
        variants: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    if (!products.length) {
      return fallbackProducts;
    }

    return Promise.all(
      products.map(async (product) => {
        const seed = seedProducts.find((candidate) => candidate.slug === product.slug);

        return withMedia({
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          priceCents: product.priceCents,
          active: product.active,
          modelUrl: product.modelUrl ?? seed?.modelUrl ?? "",
          imageUrl: product.imageUrl ?? seed?.imageUrl ?? "/assets/placeholders/series-01-onyx.svg",
          posterUrl: seed?.posterUrl ?? product.imageUrl ?? "/assets/placeholders/series-01-onyx.svg",
          videoUrl: seed?.videoUrl,
          videoScale: seed?.videoScale,
          videoPlaybackRate: seed?.videoPlaybackRate,
          frontStillUrl: seed?.frontStillUrl ?? product.imageUrl ?? "/assets/placeholders/series-01-onyx.svg",
          backStillUrl: seed?.backStillUrl ?? product.imageUrl ?? "/assets/placeholders/series-01-onyx.svg",
          color: seed?.color ?? product.variants[0]?.color ?? "Onyx",
          tagline: seed?.tagline ?? product.description,
          featureHighlights: seed?.featureHighlights ?? [],
          material: seed?.material ?? "88% Polyester / 12% Elastane",
          fitLabel: seed?.fitLabel ?? "Athletic / fitted fit · True to size",
          useCase: seed?.useCase ?? "Designed for training and lifestyle wear.",
          manufacturingNote: seed?.manufacturingNote ?? "Custom-engineered + manufactured performance material.",
          details: seed?.details ?? "Details will be updated as the drop evolves.",
          fit: seed?.fit ?? "Refer to the size selector for the intended fit.",
          shipping: seed?.shipping ?? "Shipping timelines are configured in Stripe and your fulfillment workflow.",
          care: seed?.care ?? "Care guidance will be provided per garment.",
          variants: sortSizes(
            product.variants.map((variant) => ({
              id: variant.id,
              size: variant.size as SeedProduct["variants"][number]["size"],
              color: variant.color,
              stock: variant.stock,
              sku: variant.sku
            }))
          )
        });
      })
    );
  } catch {
    return fallbackProducts;
  }
}

export async function getStoreProductBySlug(slug: string) {
  const products = await getStoreProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedProducts(slug: string) {
  const products = await getStoreProducts();
  return products.filter((product) => product.slug !== slug).slice(0, 2);
}

export async function getAdminSnapshot() {
  noStore();

  if (!isDatabaseConfigured()) {
    return null;
  }

  return db().$transaction(async (tx) => {
    const [products, orders] = await Promise.all([
      tx.product.findMany({
        include: {
          variants: {
            orderBy: {
              sku: "asc"
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      }),
      tx.order.findMany({
        include: {
          orderItems: true
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    ]);

    return { products, orders };
  });
}

export async function getOrderBySessionId(sessionId: string) {
  noStore();

  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    return await db().order.findUnique({
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

type CheckoutSelection = {
  variantId: string;
  quantity: number;
  productSlug?: string;
  size?: string;
  color?: string;
};

function variantHintKey(selection: Pick<CheckoutSelection, "productSlug" | "size" | "color">) {
  return `${selection.productSlug?.toLowerCase() ?? ""}::${selection.size?.toLowerCase() ?? ""}::${selection.color?.toLowerCase() ?? ""}`;
}

export async function resolveCheckoutSelections(items: CheckoutSelection[]) {
  if (!isDatabaseConfigured()) {
    return dedupeByVariant(items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })));
  }

  const requestedVariantIds = items.map((item) => item.variantId);
  const directMatches = await db().productVariant.findMany({
    where: {
      id: {
        in: requestedVariantIds
      },
      product: {
        active: true
      }
    },
    include: {
      product: true
    }
  });

  const directMatchMap = new Map(directMatches.map((variant) => [variant.id, variant]));
  const fallbackRequests = items.filter((item) => {
    return !directMatchMap.has(item.variantId) && item.productSlug && item.size && item.color;
  });

  const fallbackMatches = fallbackRequests.length
    ? await db().productVariant.findMany({
        where: {
          product: {
            active: true,
            slug: {
              in: Array.from(new Set(fallbackRequests.map((item) => item.productSlug!)))
            }
          }
        },
        include: {
          product: true
        }
      })
    : [];

  const fallbackMatchMap = new Map(
    fallbackMatches.map((variant) => [
      variantHintKey({
        productSlug: variant.product.slug,
        size: variant.size,
        color: variant.color
      }),
      variant
    ])
  );

  const resolvedItems = items.map((item) => {
    const directMatch = directMatchMap.get(item.variantId);

    if (directMatch) {
      return {
        variantId: directMatch.id,
        quantity: item.quantity
      };
    }

    const fallbackKey = variantHintKey(item);
    const fallbackMatch = fallbackMatchMap.get(fallbackKey);

    if (!fallbackMatch) {
      throw new Error("Your cart contains an outdated product option. Remove it and add the current version again.");
    }

    return {
      variantId: fallbackMatch.id,
      quantity: item.quantity
    };
  });

  return dedupeByVariant(resolvedItems);
}

export async function reserveInventory(items: Array<{ variantId: string; quantity: number }>) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database configuration is required for checkout.");
  }

  const normalizedItems = dedupeByVariant(items);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 30);

  return db().$transaction(async (tx) => {
    await tx.checkoutReservation.updateMany({
      where: {
        status: ReservationStatus.ACTIVE,
        expiresAt: {
          lt: now
        }
      },
      data: {
        status: ReservationStatus.EXPIRED
      }
    });

    const variants = await tx.productVariant.findMany({
      where: {
        id: {
          in: normalizedItems.map((item) => item.variantId)
        },
        product: {
          active: true
        }
      },
      include: {
        product: true,
        reservationItems: {
          where: {
            reservation: {
              status: ReservationStatus.ACTIVE,
              expiresAt: {
                gt: now
              }
            }
          }
        }
      }
    });

    if (variants.length !== normalizedItems.length) {
      throw new Error("One or more product variants are no longer available.");
    }

    const variantMap = new Map(variants.map((variant) => [variant.id, variant]));

    for (const item of normalizedItems) {
      const variant = variantMap.get(item.variantId);

      if (!variant) {
        throw new Error("A requested product variant was not found.");
      }

      const reserved = variant.reservationItems.reduce((sum, reservationItem) => sum + reservationItem.quantity, 0);
      const available = variant.stock - reserved;

      if (available < item.quantity) {
        throw new Error(`Insufficient inventory for ${variant.product.name} (${variant.size}).`);
      }
    }

    return tx.checkoutReservation.create({
      data: {
        status: ReservationStatus.ACTIVE,
        expiresAt,
        items: {
          create: normalizedItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity
          }))
        }
      },
      include: reservationInclude
    });
  });
}

export async function releaseReservationBySessionId(sessionId: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  return db().checkoutReservation.updateMany({
    where: {
      stripeSessionId: sessionId,
      status: ReservationStatus.ACTIVE
    },
    data: {
      status: ReservationStatus.RELEASED
    }
  });
}

export async function releaseReservationById(reservationId: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  return db().checkoutReservation.updateMany({
    where: {
      id: reservationId,
      status: ReservationStatus.ACTIVE
    },
    data: {
      status: ReservationStatus.RELEASED
    }
  });
}

export async function attachSessionToReservation(reservationId: string, stripeSessionId: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database configuration is required for checkout.");
  }

  return db().checkoutReservation.update({
    where: {
      id: reservationId
    },
    data: {
      stripeSessionId
    }
  });
}

export async function getReservationById(reservationId: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database configuration is required.");
  }

  return db().checkoutReservation.findUnique({
    where: {
      id: reservationId
    },
    include: reservationInclude
  });
}
