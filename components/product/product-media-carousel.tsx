"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { GarmentStill } from "@/components/product/garment-still";
import { ProductModelViewer } from "@/components/product/product-model-viewer";
import { cn } from "@/lib/utils";

type ProductMediaCarouselProps = {
  name: string;
  color: string;
  posterUrl: string;
  hasModel: boolean;
  modelUrl: string;
  videoUrl?: string;
  videoScale?: number;
  videoPlaybackRate?: number;
  frontStillUrl: string;
  backStillUrl: string;
  fabricDetailUrl: string;
  material: string;
  fitLabel: string;
  manufacturingNote: string;
};

export function ProductMediaCarousel({
  name,
  color,
  posterUrl,
  hasModel,
  modelUrl,
  videoUrl,
  videoScale,
  videoPlaybackRate,
  frontStillUrl,
  backStillUrl,
  fabricDetailUrl,
  material,
  fitLabel,
  manufacturingNote
}: ProductMediaCarouselProps) {
  const slides = useMemo(
    () => [
      { id: "motion", label: "Motion", kind: "motion" as const },
      { id: "front", label: "Front", kind: "front" as const },
      { id: "back", label: "Back", kind: "back" as const },
      { id: "fabric", label: "Fabric", kind: "fabric" as const }
    ],
    []
  );
  const [index, setIndex] = useState(0);

  const activeSlide = slides[index];
  const navigationSlides = slides.filter((slide) => slide.kind !== "motion");
  const activeDetails = useMemo(() => {
    if (activeSlide.kind === "motion") {
      return {
        eyebrow: "Motion study",
        title: `See the ${color} silhouette in motion`,
        body: "Use the rotating view to read the proportions, hem fall, reflective placement, and the way the engineered structure wraps the body before checkout.",
        cards: [
          {
            title: "Performance platform",
            body: manufacturingNote
          },
          {
            title: "Fit profile",
            body: fitLabel
          },
          {
            title: "Reflective response",
            body: "Shoulder hits, the EVUNO chest crest, and the rear spine line are placed to sharpen under direct light without breaking the minimal shape."
          }
        ]
      };
    }

    if (activeSlide.kind === "front") {
      return {
        eyebrow: "Front architecture",
        title: "Built to read clean from the front",
        body: `The ${color} front view shows the chest crest, shoulder detailing, and the angular mapping that gives Series 01 its fast technical profile without turning loud.`,
        cards: [
          {
            title: "Chest crest",
            body: "The EVUNO mark is centered to stay minimal up close and sharper once light catches it."
          },
          {
            title: "Shoulder hits",
            body: "Reflective shoulder lines frame the silhouette and add a premium after-dark read."
          },
          {
            title: "Athletic line",
            body: "The front body is cut to stay close through the torso while leaving enough recovery for training movement."
          }
        ]
      };
    }

    if (activeSlide.kind === "back") {
      return {
        eyebrow: "Rear signature",
        title: "The reflective spine is the clearest EVUNO statement",
        body: "From the back, the vertical EVUNO line becomes the garment’s strongest technical signature, giving the tee a cleaner chrome read in direct light.",
        cards: [
          {
            title: "Spine line",
            body: "The full rear line is designed to catch light as one continuous mark instead of a scattered reflective print."
          },
          {
            title: "Upper-back mapping",
            body: "Subtle knit zoning across the back supports breathability while keeping the silhouette disciplined."
          },
          {
            title: "Rear balance",
            body: "The spine placement anchors the back view and keeps the colorway feeling premium instead of busy."
          }
        ]
      };
    }

    return {
      eyebrow: "Fabric detail",
      title: "Engineered knit built into the body",
      body: "The close-up reveals the seamless texture, mapped breathability, and fine rib structure that give Series 01 its luxury-performance surface.",
      cards: [
        {
          title: "Material platform",
          body: material
        },
        {
          title: "Recovery",
          body: "Stretch response is tuned for unrestricted movement and repeat wear without losing shape."
        },
        {
          title: "Finish",
          body: "Reflective detailing is integrated into the garment system so the technical finish feels natural instead of pasted on."
        }
      ]
    };
  }, [activeSlide.kind, color, fitLabel, manufacturingNote, material]);

  function goTo(nextIndex: number) {
    const lastIndex = slides.length - 1;
    if (nextIndex < 0) {
      setIndex(lastIndex);
      return;
    }
    if (nextIndex > lastIndex) {
      setIndex(0);
      return;
    }
    setIndex(nextIndex);
  }

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {navigationSlides.map((slide) => {
          const slideIndex = slides.findIndex((candidate) => candidate.id === slide.id);
          const view =
            slide.kind === "back" ? "back" : slide.kind === "fabric" ? undefined : "front";
          const stillSrc =
            slide.kind === "front"
              ? frontStillUrl
              : slide.kind === "back"
                ? backStillUrl
                : fabricDetailUrl;

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(slideIndex)}
              aria-pressed={index === slideIndex}
              className={cn(
                "glass-panel overflow-hidden p-2 text-left transition hover:border-white/18 sm:p-2.5",
                index === slideIndex && "border-white/28 bg-white/[0.1] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
              )}
            >
              <div className="relative aspect-[5/4] overflow-hidden rounded-[16px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] sm:rounded-[20px]">
                {slide.kind === "fabric" ? (
                  <Image src={fabricDetailUrl} alt={`${name} fabric detail`} fill sizes="(max-width: 768px) 25vw, 10vw" className="object-cover" />
                ) : (
                  <GarmentStill
                    src={stillSrc}
                    alt={`${name} ${color} ${slide.label.toLowerCase()}`}
                    view={view!}
                    sizes="(max-width: 768px) 25vw, 10vw"
                    className="h-full w-full"
                    paddingClassName="p-4"
                  />
                )}
              </div>
              <p className={cn("mt-2 text-[0.58rem] uppercase tracking-[0.16em] text-steel sm:mt-2.5 sm:text-[0.68rem] sm:tracking-[0.24em]", index === slideIndex && "text-mist")}>
                {slide.label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="section-frame p-2.5 sm:p-4">
        <div className="relative overflow-hidden rounded-[28px]">
          {activeSlide.kind === "motion" ? (
            <ProductModelViewer
              alt={`${name} motion view`}
              fallbackImage={posterUrl}
              hasModel={hasModel}
              modelUrl={modelUrl}
              videoUrl={videoUrl}
              videoScale={videoScale}
              videoPlaybackRate={videoPlaybackRate}
              className="aspect-square"
            />
          ) : activeSlide.kind === "fabric" ? (
            <MagnifierStill alt={`${name} fabric detail`} src={fabricDetailUrl} mode="cover" />
          ) : (
            <MagnifierStill
              alt={`${name} ${color} ${activeSlide.kind}`}
              src={activeSlide.kind === "front" ? frontStillUrl : backStillUrl}
              mode="garment"
              view={activeSlide.kind === "front" ? "front" : "back"}
            />
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2.5 sm:p-4">
            <div className="rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-mist backdrop-blur-xl">
              {activeSlide.label}
            </div>
          </div>

          <button
            type="button"
            aria-label="Previous product image"
            onClick={() => goTo(index - 1)}
            className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/42 text-mist backdrop-blur-xl transition hover:border-white/24 hover:bg-black/55 sm:left-4 sm:h-12 sm:w-12"
          >
            <Arrow direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next product image"
            onClick={() => goTo(index + 1)}
            className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/42 text-mist backdrop-blur-xl transition hover:border-white/24 hover:bg-black/55 sm:right-4 sm:h-12 sm:w-12"
          >
            <Arrow direction="right" />
          </button>

          <div className="pointer-events-none absolute bottom-0 left-0 p-3 sm:p-4">
            <div className="rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-mist backdrop-blur-xl">
              {index + 1} / {slides.length}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          className="grid gap-4 lg:grid-cols-[1.06fr_0.94fr]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <article className="glass-panel p-5 sm:p-7">
            <p className="eyebrow">{activeDetails.eyebrow}</p>
            <h2 className="mt-4 text-[2rem] uppercase tracking-[0.11em] sm:text-4xl sm:tracking-[0.14em]">{activeDetails.title}</h2>
            <p className="mt-5 text-sm leading-7 text-steel sm:text-base">{activeDetails.body}</p>
          </article>
          <div className="grid gap-4">
            {activeDetails.cards.map((card) => (
              <article key={card.title} className="glass-panel p-5">
                <p className="text-xs uppercase tracking-[0.26em] text-mist">{card.title}</p>
                <p className="mt-3 text-sm leading-7 text-steel">{card.body}</p>
              </article>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function MagnifierStill({
  src,
  alt,
  view,
  mode
}: {
  src: string;
  alt: string;
  view?: "front" | "back";
  mode: "garment" | "cover";
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const lensSize = 220;
  const zoomScale = mode === "cover" ? 5.2 : 5.8;

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setPointer({
      x: Math.max(0, Math.min(x, rect.width)),
      y: Math.max(0, Math.min(y, rect.height)),
      width: rect.width,
      height: rect.height
    });
  }

  const lensLeft = pointer ? Math.max(12, Math.min(pointer.x - lensSize / 2, pointer.width - lensSize - 12)) : 0;
  const lensTop = pointer ? Math.max(12, Math.min(pointer.y - lensSize / 2, pointer.height - lensSize - 12)) : 0;
  const bgPositionX = pointer ? `${(pointer.x / pointer.width) * 100}%` : "50%";
  const bgPositionY = pointer ? `${(pointer.y / pointer.height) * 100}%` : "50%";

  return (
    <div
      ref={frameRef}
      className="relative aspect-square cursor-zoom-in rounded-[26px] border border-white/10 bg-metal-sheen"
      onMouseLeave={() => setPointer(null)}
      onMouseMove={handleMove}
    >
      {mode === "garment" && view ? (
        <GarmentStill
          src={src}
          alt={alt}
          view={view}
          sizes="(max-width: 1024px) 100vw, 44vw"
          className="h-full w-full rounded-[26px]"
          paddingClassName="p-8 sm:p-10"
        />
      ) : (
        <div className="relative h-full w-full overflow-hidden rounded-[26px]">
          <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 44vw" className="object-cover" />
        </div>
      )}

      {pointer ? (
        <div
          className="pointer-events-none absolute hidden overflow-hidden rounded-full border border-white/22 bg-black/70 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:block"
          style={{
            left: lensLeft,
            top: lensTop,
            width: lensSize,
            height: lensSize
          }}
        >
          <div
            className="absolute inset-[8px] rounded-full bg-black/75"
            style={{
              backgroundImage: `url("${src}")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: `${bgPositionX} ${bgPositionY}`,
              backgroundSize: `${zoomScale * 100}%`
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      {direction === "left" ? (
        <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M7.5 4.5L13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
