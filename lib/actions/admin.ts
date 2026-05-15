"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearAdminSession, createAdminSession, requireAdminSession, verifyAdminSecret } from "@/lib/auth/admin";
import { db, isDatabaseConfigured } from "@/lib/prisma";
import { adminLoginSchema, fulfillOrderSchema, updateInventorySchema } from "@/lib/validation";

export type AdminActionState = {
  error: string | null;
};

export async function loginAdminAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = adminLoginSchema.safeParse({
    secret: formData.get("secret")
  });

  if (!parsed.success) {
    return {
      error: "Enter the configured admin secret."
    };
  }

  if (!verifyAdminSecret(parsed.data.secret)) {
    return {
      error: "The admin secret was invalid."
    };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateVariantStockAction(formData: FormData) {
  await requireAdminSession();

  if (!isDatabaseConfigured()) {
    throw new Error("Database configuration is required for admin updates.");
  }

  const parsed = updateInventorySchema.parse({
    variantId: formData.get("variantId"),
    stock: formData.get("stock")
  });

  await db().productVariant.update({
    where: {
      id: parsed.variantId
    },
    data: {
      stock: parsed.stock
    }
  });

  revalidatePath("/admin");
}

export async function markOrderFulfilledAction(formData: FormData) {
  await requireAdminSession();

  if (!isDatabaseConfigured()) {
    throw new Error("Database configuration is required for admin updates.");
  }

  const parsed = fulfillOrderSchema.parse({
    orderId: formData.get("orderId")
  });

  await db().order.update({
    where: {
      id: parsed.orderId
    },
    data: {
      status: "FULFILLED",
      fulfilledAt: new Date()
    }
  });

  revalidatePath("/admin");
}
