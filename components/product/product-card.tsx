import Link from "next/link";

import { ProductModelViewer } from "@/components/product/product-model-viewer";
import type { StoreProduct } from "@/lib/storefront";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: StoreProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="group block h-full">
      <article className="section-frame flex h-full flex-col p-3 transition duration-300 group-hover:border-white/16 sm:p-5">
        <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-2.5 sm:rounded-[28px] sm:p-3">
          <ProductModelViewer
            alt={product.name}
            fallbackImage={product.posterUrl}
            hasModel={product.hasModel}
            modelUrl={product.modelUrl}
            videoUrl={product.videoUrl}
            videoScale={product.videoScale}
            videoPlaybackRate={product.videoPlaybackRate}
            className="aspect-square"
          />
        </div>

        <div className="mt-4 flex flex-1 flex-col sm:mt-5">
          <div className="flex items-start justify-between gap-4">
            <p className="eyebrow">Series 01</p>
            <p className="text-sm uppercase tracking-[0.24em] text-steel">{product.color}</p>
          </div>

          <h3 className="mt-4 text-[1.5rem] uppercase leading-[1.02] tracking-[0.1em] text-mist transition group-hover:text-chrome sm:text-[1.95rem] sm:tracking-[0.12em]">
            {product.name}
          </h3>

          <p className="mt-3 min-h-0 text-sm leading-7 text-steel sm:mt-4 sm:min-h-[5rem]">{product.tagline}</p>

          <div className="mt-5 flex flex-col gap-4 border-t border-white/8 pt-4 sm:mt-auto sm:flex-row sm:items-end sm:justify-between sm:pt-5">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-steel">Reflective detailing</p>
              <p className="mt-2 text-sm text-mist">Chrome-read shoulder hits and rear spine finish.</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-[0.26em] text-steel">Price</p>
              <p className="mt-2 text-2xl font-medium text-mist">{formatPrice(product.priceCents)}</p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
