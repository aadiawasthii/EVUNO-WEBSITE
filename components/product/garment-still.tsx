import Image from "next/image";

import { cn } from "@/lib/utils";

type GarmentStillProps = {
  src: string;
  alt: string;
  view: "front" | "back";
  sizes: string;
  className?: string;
  imageClassName?: string;
  paddingClassName?: string;
  priority?: boolean;
};

export function GarmentStill({
  src,
  alt,
  view,
  sizes,
  className,
  imageClassName,
  paddingClassName = "p-6",
  priority = false
}: GarmentStillProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]" />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.45)] [filter:brightness(1.03)_contrast(1.05)_saturate(1.02)]",
          paddingClassName,
          imageClassName
        )}
      />
      <ReflectiveOverlay view={view} />
      <div className="pointer-events-none absolute inset-x-[12%] bottom-0 h-16 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_65%)] blur-2xl opacity-30" />
    </div>
  );
}

function ReflectiveOverlay({ view }: { view: "front" | "back" }) {
  if (view === "front") {
    return (
      <div className="pointer-events-none absolute inset-0 mix-blend-screen">
        <div className="absolute left-[18%] top-[13%] h-[14%] w-[20%] bg-[radial-gradient(circle,rgba(255,255,255,0.32),transparent_70%)] blur-2xl opacity-70" />
        <div className="absolute right-[18%] top-[13%] h-[14%] w-[20%] bg-[radial-gradient(circle,rgba(255,255,255,0.32),transparent_70%)] blur-2xl opacity-70" />
        <div className="absolute left-1/2 top-[22%] h-[13%] w-[16%] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.3),transparent_72%)] blur-2xl opacity-80" />
        <div className="absolute left-1/2 top-[34%] h-[22%] w-[42%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_65%)] blur-2xl opacity-35" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 mix-blend-screen">
      <div className="absolute left-1/2 top-[14%] h-[14%] w-[16%] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.34),transparent_72%)] blur-2xl opacity-80" />
      <div className="absolute left-1/2 top-[19%] h-[60%] w-[12%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.12),transparent)] blur-2xl opacity-60" />
      <div className="absolute left-[22%] top-[18%] h-[18%] w-[18%] bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_72%)] blur-3xl opacity-40" />
      <div className="absolute right-[22%] top-[18%] h-[18%] w-[18%] bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_72%)] blur-3xl opacity-40" />
      <div className="absolute left-1/2 bottom-[11%] h-[18%] w-[10%] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.26),transparent_72%)] blur-2xl opacity-70" />
    </div>
  );
}
