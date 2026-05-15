"use client";

import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CheckoutButtonProps = {
  className?: string;
};

export function CheckoutButton({ className }: CheckoutButtonProps) {
  const { items } = useCart();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingPostalCode, setShippingPostalCode] = useState("");

  async function handleCheckout() {
    const normalizedPostalCode = shippingPostalCode.trim();

    if (!normalizedPostalCode) {
      setError("Enter your shipping ZIP or postal code before checkout.");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            productSlug: item.productSlug,
            size: item.size,
            color: item.color
          })),
          shippingPostalCode: normalizedPostalCode
        })
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Unable to start checkout.");
      }

      window.location.assign(payload.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={className}>
      <label className="mb-4 block">
        <span className="text-xs uppercase tracking-[0.2em] text-steel">Shipping ZIP / Postal code</span>
        <input
          className="input-shell mt-2"
          type="text"
          inputMode="text"
          autoComplete="postal-code"
          placeholder="Enter ZIP or postal code"
          value={shippingPostalCode}
          onChange={(event) => setShippingPostalCode(event.target.value)}
        />
      </label>
      <p className="mb-4 text-xs leading-6 text-steel">
        Free San Diego local delivery is only offered for eligible San Diego ZIP codes and is verified again after Stripe collects the final shipping address.
      </p>
      <button
        type="button"
        className={cn(buttonStyles("primary"), "w-full")}
        onClick={handleCheckout}
        disabled={!items.length || isPending}
      >
        {isPending ? "Opening Checkout" : "Checkout Securely"}
      </button>
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
