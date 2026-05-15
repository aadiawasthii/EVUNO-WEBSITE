import Link from "next/link";

import { SeriesRunnerShowcase } from "@/components/product/series-runner-showcase";
import { buttonStyles } from "@/components/ui/button";
import { getSeries01RunnerByColor } from "@/lib/catalog";
import { getStoreProducts } from "@/lib/storefront";

export const metadata = {
  title: "Series 01"
};

export default async function SeriesZeroOnePage() {
  const products = await getStoreProducts();
  const runnerProducts = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    color: product.color,
    tagline: product.tagline,
    runnerImageUrl: getSeries01RunnerByColor(product.color)
  }));

  return (
    <section className="shell py-14 sm:py-20">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="section-frame p-8 sm:p-10 lg:p-12">
          <p className="eyebrow">Series 01</p>
          <h1 className="mt-5 max-w-4xl text-4xl uppercase tracking-[0.14em] sm:text-5xl lg:text-6xl">
            Apex Performance Tee. One engineered model. Three exact colorways.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-steel sm:text-base">
            Drop 001 is built around a single performance silhouette tuned for movement, recovery, and everyday progression.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/shop" className={buttonStyles("primary")}>
              Shop Series 01
            </Link>
            <Link href="/brand" className={buttonStyles("secondary")}>
              Explore the Brand
            </Link>
          </div>
        </div>

        <div className="section-frame p-8 sm:p-10 lg:p-12">
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.slug} className="border-l border-white/10 pl-5">
                <p className="eyebrow">{product.color}</p>
                <p className="mt-3 text-lg uppercase tracking-[0.12em] text-mist">{product.name}</p>
                <p className="mt-3 text-sm leading-7 text-steel">{product.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SeriesRunnerShowcase products={runnerProducts} />
    </section>
  );
}
