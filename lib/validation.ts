import { z } from "zod";

export const sizeSchema = z.enum(["S", "M", "L"]);

export const checkoutItemSchema = z.object({
  variantId: z.string().min(1).max(191),
  quantity: z.coerce.number().int().min(1).max(10),
  productSlug: z.string().min(1).max(191).optional(),
  size: sizeSchema.optional(),
  color: z.string().min(1).max(64).optional()
});

export const checkoutRequestSchema = z.object({
  items: z.array(checkoutItemSchema).min(1).max(12),
  shippingPostalCode: z.string().trim().min(2).max(16)
});

export const adminLoginSchema = z.object({
  secret: z.string().min(1).max(256)
});

export const updateInventorySchema = z.object({
  variantId: z.string().min(1).max(191),
  stock: z.coerce.number().int().min(0).max(9999)
});

export const fulfillOrderSchema = z.object({
  orderId: z.string().min(1).max(191)
});
