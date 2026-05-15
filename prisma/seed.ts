import { PrismaClient } from "@prisma/client";

import { seedProducts } from "@/lib/catalog";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({
    where: {
      slug: {
        notIn: seedProducts.map((product) => product.slug)
      }
    }
  });

  for (const product of seedProducts) {
    const existing = await prisma.product.upsert({
      where: {
        slug: product.slug
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        active: product.active,
        modelUrl: product.modelUrl,
        imageUrl: product.imageUrl
      },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        active: product.active,
        modelUrl: product.modelUrl,
        imageUrl: product.imageUrl
      }
    });

    for (const variant of product.variants) {
      await prisma.productVariant.upsert({
        where: {
          sku: variant.sku
        },
        create: {
          id: variant.id,
          productId: existing.id,
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
          sku: variant.sku
        },
        update: {
          productId: existing.id,
          size: variant.size,
          color: variant.color,
          stock: variant.stock
        }
      });
    }
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
