import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "sm";

export function buttonStyles(variant: ButtonVariant = "primary", size: ButtonSize = "default") {
  return cn(
    "inline-flex items-center justify-center rounded-full border text-sm font-semibold tracking-[0.14em] uppercase transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50",
    size === "default" ? "min-h-12 px-6" : "min-h-10 px-4 text-xs",
    variant === "primary" &&
      "border-white/12 bg-white text-abyss shadow-[0_14px_40px_rgba(255,255,255,0.16)] hover:bg-white/90",
    variant === "secondary" && "border-white/12 bg-white/5 text-mist hover:border-white/20 hover:bg-white/10",
    variant === "ghost" && "border-transparent bg-transparent text-steel hover:text-mist"
  );
}
