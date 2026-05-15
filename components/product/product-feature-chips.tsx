"use client";

import { cn } from "@/lib/utils";

type ProductFeatureChipsProps = {
  features: string[];
  className?: string;
  subtle?: boolean;
};

export function ProductFeatureChips({ features, className, subtle = false }: ProductFeatureChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {features.map((feature) => (
        <span
          key={feature}
          className={cn(
            "rounded-full border px-3 py-2 text-[0.64rem] font-medium uppercase tracking-[0.24em]",
            subtle
              ? "border-white/8 bg-white/[0.03] text-steel"
              : "border-white/10 bg-white/[0.05] text-mist shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]"
          )}
        >
          {feature}
        </span>
      ))}
    </div>
  );
}
