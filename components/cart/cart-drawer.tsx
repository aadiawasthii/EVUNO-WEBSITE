"use client";

import { useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { CheckoutButton } from "@/components/cart/checkout-button";
import { useCart } from "@/components/cart/cart-provider";
import { buttonStyles } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { closeCart, isOpen, items, removeItem, subtotalCents, updateQuantity } = useCart();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [closeCart, isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#07090d]/95 p-4 shadow-[0_0_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            aria-label="Shopping cart"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Cart</p>
                <h2 className="mt-3 text-2xl font-medium uppercase tracking-[0.16em]">Your evolution</h2>
              </div>
              <button type="button" className={buttonStyles("ghost", "sm")} onClick={closeCart}>
                Close
              </button>
            </div>

            <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1 sm:mt-8">
              {items.length ? null : (
                <div className="glass-panel p-5 text-sm text-steel">
                  Your cart is empty. Build Series 01 around the Forest, Onyx, or Cobalt colorway that fits your next evolution.
                </div>
              )}

              {items.map((item) => (
                <div key={item.variantId} className="glass-panel p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-steel">{item.size} / {item.color}</p>
                      <p className="mt-2 text-base font-semibold text-mist">{item.productName}</p>
                      <p className="mt-2 text-sm text-steel">{formatPrice(item.unitPriceCents)}</p>
                    </div>
                    <button
                      type="button"
                      className={buttonStyles("ghost", "sm")}
                      onClick={() => removeItem(item.variantId)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
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
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="mb-4 flex items-center justify-between text-sm uppercase tracking-[0.18em] text-steel">
                <span>Subtotal</span>
                <span className="text-mist">{formatPrice(subtotalCents)}</span>
              </div>
              <CheckoutButton />
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
