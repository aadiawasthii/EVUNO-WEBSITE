import { ColorwayShowcase } from "@/components/product/colorway-showcase";
import { ProductCard } from "@/components/product/product-card";
import { getStoreProducts } from "@/lib/storefront";

export const metadata = {
  title: "Shop"
};

export default async function ShopPage() {
  const products = await getStoreProducts();

  return (
    <section className="shell pb-10 pt-8 sm:pb-16 sm:pt-12">
      <div className="grid gap-5 border-t border-white/8 pt-5 sm:pt-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="eyebrow">Shop</p>
          <h1 className="mt-4 text-[2.7rem] uppercase tracking-[0.12em] sm:text-5xl sm:tracking-[0.14em] lg:text-6xl">Series 01</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.28em] text-steel sm:text-base sm:tracking-[0.32em]">Apex performance tee</p>
          <p className="mt-5 text-sm leading-8 text-steel sm:text-base">
            One EVUNO silhouette, three tuned colorways. Lightweight breathable fabric, seamless engineered texture,
            stretch recovery, and reflective detailing built to stay sharp in motion.
          </p>
          <p className="mt-5 text-sm leading-8 text-steel sm:text-base">
            Custom-engineered + manufactured for training, running, and daily wear without losing the premium finish.
          </p>
          <div className="mt-7 flex flex-wrap gap-4 text-[0.68rem] uppercase tracking-[0.28em] text-steel">
            <span>88% Polyester / 12% Elastane</span>
            <span>Reflective structure</span>
            <span>Athletic fitted feel</span>
          </div>
          <div className="mt-8 border-t border-white/8 pt-6">
            <p className="text-3xl uppercase tracking-[0.16em] text-mist sm:text-4xl">The future is now.</p>
            <p className="mt-3 text-sm uppercase tracking-[0.32em] text-steel">Don&apos;t get left behind.</p>
          </div>
        </div>

        <ColorwayShowcase products={products} />
      </div>

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
