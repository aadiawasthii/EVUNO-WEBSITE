"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { CartLineItem } from "@/lib/cart";

type CartContextValue = {
  items: CartLineItem[];
  itemCount: number;
  subtotalCents: number;
  isOpen: boolean;
  addItem: (item: CartLineItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const STORAGE_KEY = "evuno-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        setItems(JSON.parse(raw) as CartLineItem[]);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [isLoaded, items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalCents = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotalCents,
      isOpen,
      addItem(item) {
        setItems((current) => {
          const existing = current.find((entry) => entry.variantId === item.variantId);

          if (!existing) {
            return [...current, item];
          }

          return current.map((entry) =>
            entry.variantId === item.variantId
              ? {
                  ...entry,
                  quantity: entry.quantity + item.quantity
                }
              : entry
          );
        });
      },
      updateQuantity(variantId, quantity) {
        setItems((current) =>
          current.flatMap((item) => {
            if (item.variantId !== variantId) {
              return [item];
            }

            if (quantity <= 0) {
              return [];
            }

            return [{ ...item, quantity }];
          })
        );
      },
      removeItem(variantId) {
        setItems((current) => current.filter((item) => item.variantId !== variantId));
      },
      clearCart() {
        setItems([]);
      },
      openCart() {
        setIsOpen(true);
      },
      closeCart() {
        setIsOpen(false);
      },
      toggleCart() {
        setIsOpen((current) => !current);
      }
    };
  }, [isOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
