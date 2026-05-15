"use client";

import Image from "next/image";

type RunnerShowcaseProduct = {
  slug: string;
  color: string;
  runnerImageUrl: string;
};

type SeriesRunnerShowcaseProps = {
  products: RunnerShowcaseProduct[];
};

export function SeriesRunnerShowcase({ products }: SeriesRunnerShowcaseProps) {
  return (
    <section className="section-frame relative mt-8 overflow-hidden p-4 sm:p-5 lg:p-6">
      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.slug}
            className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/20"
          >
            <div className="relative aspect-[16/8.4] overflow-hidden">
              <Image
                src={product.runnerImageUrl}
                alt={`${product.color} Series 01 runner editorial`}
                fill
                sizes="100vw"
                className="object-cover object-[62%_center]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,8,0.78)_0%,rgba(5,6,8,0.28)_38%,rgba(5,6,8,0.16)_68%,rgba(5,6,8,0.62)_100%),linear-gradient(180deg,rgba(5,6,8,0.02)_0%,rgba(5,6,8,0.22)_100%)]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
