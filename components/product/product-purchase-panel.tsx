"use client";

import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { buttonStyles } from "@/components/ui/button";
import type { StoreProduct } from "@/lib/storefront";
import { cn, formatPrice } from "@/lib/utils";

type ProductPurchasePanelProps = {
  product: Pick<StoreProduct, "id" | "slug" | "name" | "imageUrl" | "frontStillUrl" | "priceCents" | "color" | "variants">;
  compact?: boolean;
};

export function ProductPurchasePanel({ product, compact = false }: ProductPurchasePanelProps) {
  const { addItem, openCart } = useCart();

  const firstAvailable = useMemo(
    () => product.variants.find((variant) => variant.stock > 0) ?? product.variants[0] ?? null,
    [product.variants]
  );

  const [variantId, setVariantId] = useState(firstAvailable?.id ?? "");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setVariantId(firstAvailable?.id ?? "");
  }, [firstAvailable?.id]);

  const selectedVariant = product.variants.find((variant) => variant.id === variantId) ?? firstAvailable;
  const isSoldOut = !selectedVariant || selectedVariant.stock < quantity;

  function handleAddToCart() {
    if (!selectedVariant) {
      return;
    }

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      imageUrl: product.frontStillUrl,
      quantity,
      size: selectedVariant.size,
      color: selectedVariant.color,
      unitPriceCents: product.priceCents
    });
    openCart();
  }

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-steel">Color</p>
          <p className="mt-2 text-sm text-mist">{product.color}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.24em] text-steel">Price</p>
          <p className="mt-2 text-lg font-medium text-mist">{formatPrice(product.priceCents)}</p>
        </div>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.24em] text-steel">Size</span>
        <select
          className="input-shell mt-2"
          value={variantId}
          onChange={(event) => setVariantId(event.target.value)}
          aria-label={`Select a size for ${product.name}`}
        >
          {product.variants.map((variant) => (
            <option key={variant.id} value={variant.id} disabled={variant.stock <= 0}>
              {variant.size} {variant.stock <= 0 ? "— Sold out" : ""}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className={cn("block", compact ? "max-w-[110px]" : "max-w-[132px]")}>
          <span className="text-xs uppercase tracking-[0.24em] text-steel">Quantity</span>
          <input
            className="input-shell mt-2"
            type="number"
            min={1}
            max={Math.max(selectedVariant?.stock ?? 1, 1)}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          />
        </label>
        <button
          type="button"
          className={cn(buttonStyles("primary"), "w-full flex-1")}
          disabled={isSoldOut}
          onClick={handleAddToCart}
        >
          {isSoldOut ? "Unavailable" : "Add to Cart"}
        </button>
      </div>

      {selectedVariant ? (
        <p className="text-sm text-steel">
          {selectedVariant.stock > 0 ? `${selectedVariant.stock} units ready to ship.` : "Currently sold out in this size."}
        </p>
      ) : null}
    </div>
  );
}
