import Image from "next/image";
import { notFound } from "next/navigation";

import { ProductAccordion } from "@/components/product/product-accordion";
import { ProductFeatureChips } from "@/components/product/product-feature-chips";
import { ProductMediaCarousel } from "@/components/product/product-media-carousel";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { getSeries01RunnerByColor, series01Editorial } from "@/lib/catalog";
import { getStoreProductBySlug } from "@/lib/storefront";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found"
    };
  }

  return {
    title: product.name,
    description: product.description
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const runnerEditorialUrl = getSeries01RunnerByColor(product.color);

  return (
    <section className="shell pb-10 pt-6 sm:pb-16 sm:pt-10">
      <article className="section-frame relative mb-5 overflow-hidden">
        <div className="relative aspect-[8/9] min-h-[260px] sm:aspect-[16/7] sm:min-h-[280px] lg:min-h-[340px]">
          <Image
            src={runnerEditorialUrl}
            alt={`${product.color} Series 01 runner editorial`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[76%_center] sm:object-[76%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,8,0.92)_0%,rgba(5,6,8,0.82)_28%,rgba(5,6,8,0.34)_58%,rgba(5,6,8,0.76)_100%),linear-gradient(180deg,rgba(5,6,8,0.18)_0%,rgba(5,6,8,0.5)_100%)]" />
        </div>
      </article>

      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="space-y-4">
          <ProductMediaCarousel
            name={product.name}
            color={product.color}
            posterUrl={product.posterUrl}
            hasModel={product.hasModel}
            modelUrl={product.modelUrl}
            videoUrl={product.videoUrl}
            videoScale={product.videoScale}
            videoPlaybackRate={product.videoPlaybackRate}
            frontStillUrl={product.frontStillUrl}
            backStillUrl={product.backStillUrl}
            fabricDetailUrl={series01Editorial.fabricDetailUrl}
            material={product.material}
            fitLabel={product.fitLabel}
            manufacturingNote={product.manufacturingNote}
          />
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6 sm:p-7">
            <p className="eyebrow">{product.color}</p>
            <h1 className="mt-4 text-[2.5rem] uppercase tracking-[0.12em] sm:text-5xl sm:tracking-[0.14em]">{product.name}</h1>
            <p className="mt-4 text-sm leading-7 text-steel sm:text-base sm:leading-8">{product.description}</p>
            <p className="mt-4 text-sm leading-7 text-steel sm:leading-8">
              {product.manufacturingNote} Built for comfort, movement, and confidence with reflective detailing that
              stays elegant in daylight and sharpens under direct light.
            </p>
            <ProductFeatureChips features={product.featureHighlights.slice(0, 5)} className="mt-6" subtle />

            <div className="mt-6">
              <ProductPurchasePanel product={product} />
            </div>
          </div>
          <ProductAccordion
            items={[
              { title: "Details", content: product.details },
              { title: "Fit", content: product.fit },
              { title: "Shipping", content: product.shipping },
              { title: "Care", content: product.care }
            ]}
          />
        </div>
      </div>
    </section>
  );
}
