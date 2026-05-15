"use client";

import Link from "next/link";

import { CheckoutButton } from "@/components/cart/checkout-button";
import { useCart } from "@/components/cart/cart-provider";
import { buttonStyles } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartPage() {
  const { items, removeItem, subtotalCents, updateQuantity } = useCart();

  if (!items.length) {
    return (
      <section className="shell py-16 sm:py-24">
        <div className="mx-auto max-w-2xl glass-panel p-10 text-center">
          <p className="eyebrow">Cart</p>
          <h1 className="mt-4 text-[2.5rem] uppercase tracking-[0.12em] sm:text-4xl sm:tracking-[0.14em]">No pieces selected yet</h1>
          <p className="mt-4 text-sm leading-7 text-steel">
            Series 01 is ready when you are. Start with the Forest, Onyx, or Cobalt colorway that feels most like your next form.
          </p>
          <Link href="/shop" className={`${buttonStyles("primary")} mt-8`}>
            Shop Series 01
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="shell py-10 sm:py-20">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.8fr)]">
        <div className="space-y-4">
          <div>
            <p className="eyebrow">Cart</p>
            <h1 className="mt-4 text-[2.4rem] uppercase tracking-[0.12em] sm:text-4xl sm:tracking-[0.14em]">Refine your selection</h1>
          </div>

          {items.map((item) => (
            <article key={item.variantId} className="glass-panel p-5 sm:p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-steel">{item.size} / {item.color}</p>
                  <h2 className="mt-2 text-xl font-medium">{item.productName}</h2>
                  <p className="mt-3 text-steel">{formatPrice(item.unitPriceCents)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    className={buttonStyles("secondary", "sm")}
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    className={buttonStyles("secondary", "sm")}
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className={buttonStyles("ghost", "sm")}
                    onClick={() => removeItem(item.variantId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="glass-panel h-fit p-5 sm:p-6">
          <p className="eyebrow">Summary</p>
          <div className="mt-6 flex items-center justify-between text-sm uppercase tracking-[0.18em] text-steel">
            <span>Subtotal</span>
            <span className="text-mist">{formatPrice(subtotalCents)}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-steel">
            Taxes, shipping, and secure payment collection are handled in Stripe Checkout after your server-validated session is created.
          </p>
          <p className="mt-3 text-sm leading-7 text-steel">
            Enter your shipping ZIP or postal code below before checkout. Eligible San Diego ZIP codes unlock the free local-delivery option.
          </p>
          <CheckoutButton className="mt-8" />
        </aside>
      </div>
    </section>
  );
}
