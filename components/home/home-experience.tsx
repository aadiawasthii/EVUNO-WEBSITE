"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { motion, useReducedMotion, useScroll } from "framer-motion";

import { MetallicWordmark } from "@/components/home/metallic-wordmark";
import { ProductFeatureChips } from "@/components/product/product-feature-chips";
import { ProductModelViewer } from "@/components/product/product-model-viewer";
import { buttonStyles } from "@/components/ui/button";
import type { StoreProduct } from "@/lib/storefront";
import { formatPrice } from "@/lib/utils";

type HomeExperienceProps = {
  products: StoreProduct[];
};

const manifestoPoints = [
  "EVUNO is a uniform for people who treat growth like a discipline.",
  "Every piece is designed with minimal restraint, future-facing structure, and premium monochrome confidence.",
  "Series 01 reduces the launch to one engineered silhouette in three exact color systems so the signal stays sharp."
];

export function HomeExperience({ products }: HomeExperienceProps) {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion ?? false;
  const revealViewport = { once: true, amount: 0.2 };
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  return (
    <div className="pb-20">
      <section ref={heroRef} className="shell relative overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pt-36">
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-knit-luxury opacity-[0.96]"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    scale: [1, 1.02, 1],
                    x: [0, -10, 8, 0]
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
            }
          />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_20%_44%,rgba(255,255,255,0.04),transparent_28%),linear-gradient(180deg,rgba(5,6,8,0.74)_0%,rgba(5,6,8,0.38)_26%,rgba(5,6,8,0.56)_54%,rgba(5,6,8,0.9)_100%)]"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.9, 1, 0.92],
                    x: [0, 12, 0]
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
            }
          />
          <div className="absolute inset-y-0 left-0 w-[52%] bg-[linear-gradient(90deg,rgba(5,6,8,0.94)_0%,rgba(5,6,8,0.72)_42%,rgba(5,6,8,0)_100%)]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_62%)] blur-3xl" />
        <motion.div
          className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl flex-col items-center justify-center px-4 text-center"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 28 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="relative z-10 -mt-12 flex w-full flex-col items-center sm:-mt-14 lg:-mt-16">
            <MetallicWordmark
              progress={scrollYProgress}
              reduceMotion={shouldReduceMotion}
              className="relative w-[min(82vw,54rem)]"
            />
          </div>

          <div className="relative z-10 -mt-12 flex w-full max-w-3xl flex-col items-center sm:-mt-14">
            <p className="eyebrow">Custom-Engineered Athleisure</p>
            <h1 className="headline-balance mt-6 max-w-4xl text-5xl font-semibold uppercase tracking-[0.14em] sm:text-6xl lg:text-7xl">
              EVOLVE YOURSELF
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-steel sm:text-lg">Drop 001 is here. Built to move with you.</p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-steel">Minimal form. Maximum intent. Made to evolve.</p>
            <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/shop" className={`${buttonStyles("primary")} flex-1`}>
                Shop Series 01
              </Link>
              <Link href="/brand" className={`${buttonStyles("secondary")} flex-1`}>
                Explore the Brand
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="shell relative overflow-hidden py-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src="/assets/landing-runner-bg.png"
            alt="EVUNO runner editorial background"
            fill
            sizes="100vw"
            className="object-contain object-[78%_24%] opacity-22 saturate-[0.94] brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,8,0.97)_0%,rgba(5,6,8,0.9)_28%,rgba(5,6,8,0.54)_56%,rgba(5,6,8,0.86)_100%),linear-gradient(180deg,rgba(5,6,8,0.26)_0%,rgba(5,6,8,0.8)_100%)]" />
        </div>
        <div className="relative">
          <div className="grid gap-10 border-y border-white/8 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 32 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <p className="eyebrow">Manifesto</p>
              <h2 className="mt-5 text-3xl uppercase tracking-[0.14em] sm:text-4xl">Future identity starts with repetition</h2>
            </motion.div>
            <div className="space-y-6">
              {manifestoPoints.map((point, index) => (
                <motion.p
                  key={point}
                  className="border-l border-white/10 pl-5 text-sm leading-7 text-steel sm:text-base"
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 28 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={revealViewport}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                >
                    {point}
                </motion.p>
              ))}
            </div>
          </div>

          <motion.div
            className="mt-10 mb-10 flex flex-col gap-4 border-t border-white/8 pt-10 sm:mt-14 sm:mb-10 sm:pt-14 md:flex-row md:items-end md:justify-between"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 32 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div>
              <p className="eyebrow">Series 01</p>
              <h2 className="mt-4 text-3xl uppercase tracking-[0.14em] sm:text-4xl">One silhouette. Three color systems.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-steel">
              One performance-engineered tee, separated into Forest, Onyx, and Cobalt so the drop still reads as a curated three-piece system.
            </p>
          </motion.div>

          <div className="relative grid gap-10 lg:grid-cols-3">
            {products.map((product, index) => (
              <motion.article
                key={product.slug}
                className="relative border-t border-white/10 pt-5"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 36 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
              >
                <ProductModelViewer
                  alt={product.name}
                  fallbackImage={product.posterUrl}
                  hasModel={product.hasModel}
                  modelUrl={product.modelUrl}
                  videoUrl={product.videoUrl}
                  videoScale={product.videoScale}
                  videoPlaybackRate={product.videoPlaybackRate}
                  className="aspect-square border-white/5 bg-black"
                />
                <div className="mt-6">
                  <p className="eyebrow">{product.color}</p>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl uppercase tracking-[0.12em]">{product.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-steel">{product.tagline}</p>
                      <ProductFeatureChips features={product.featureHighlights.slice(0, 2)} className="mt-4" subtle />
                    </div>
                    <span className="text-sm uppercase tracking-[0.18em] text-mist">{formatPrice(product.priceCents)}</span>
                  </div>
                  <Link href={`/product/${product.slug}`} className={`${buttonStyles("secondary")} mt-6 w-full`}>
                    View Garment
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
