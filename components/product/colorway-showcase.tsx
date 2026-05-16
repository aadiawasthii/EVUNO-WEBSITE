"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { series01Editorial } from "@/lib/catalog";
import type { StoreProduct } from "@/lib/storefront";

type ColorwayShowcaseProps = {
  products: StoreProduct[];
};

export function ColorwayShowcase({ products }: ColorwayShowcaseProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const onyx = products.find((product) => product.color === "Onyx") ?? products[1] ?? products[0];

  return (
    <article className="section-frame overflow-hidden p-5 sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_62%)]" />
      <div className="relative aspect-[7/6] min-h-[360px] overflow-hidden rounded-[34px] border border-white/6 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.09),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] sm:min-h-[470px]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_26%,rgba(255,255,255,0.03))]" />
        <motion.div
          className="absolute inset-0"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.96,
                  y: 24,
                  filter: "blur(10px) brightness(1.12)"
                }
          }
          animate={
            reduceMotion
              ? undefined
              : {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: "blur(0px) brightness(1)"
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 0.95,
                  ease: [0.22, 1, 0.36, 1]
                }
          }
        >
          <Image
            src={series01Editorial.reflectiveBackModelUrl}
            alt={`${onyx.name} reflective spine editorial`}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover object-center"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-x-[14%] bottom-[10%] h-20 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_72%)] blur-3xl opacity-70" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.28em] text-steel">
        <span>Reflective spine</span>
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span>Rear architecture</span>
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span>Engineered knit</span>
      </div>
    </article>
  );
}
