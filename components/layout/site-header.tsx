"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/components/cart/cart-provider";
import { buttonStyles } from "@/components/ui/button";
import { KeyedVideoLogo } from "@/components/ui/keyed-video-logo";
import { cn } from "@/lib/utils";

const leftNavigation = [{ href: "/about", label: "About" }];
const rightNavigation = [{ href: "/shop", label: "Shop" }];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, toggleCart } = useCart();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-30 overflow-visible bg-abyss/70 backdrop-blur-xl">
      <div className="shell relative flex min-h-[4.6rem] items-center overflow-visible py-2 sm:min-h-24">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex items-center gap-2 sm:gap-5">
          <div className="h-px flex-1 bg-white/30" />
          <div className={cn(isHome ? "w-28 sm:w-40 lg:w-56" : "w-24 sm:w-32 lg:w-40")} />
          <div className="h-px flex-1 bg-white/30" />
        </div>

        <Link
          href="/"
          aria-label="Go to homepage"
          className={cn(
            "group absolute left-1/2 top-0 z-20 block -translate-x-1/2",
            isHome ? "h-32 w-32 sm:h-52 sm:w-52 lg:h-72 lg:w-72" : "h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
          )}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_70%)] blur-3xl opacity-85 transition duration-300 group-hover:opacity-100",
              isHome ? "scale-[0.88]" : "scale-[0.96]"
            )}
          />
          <KeyedVideoLogo
            src="/assets/evuno-logo-rotate-alt.mp4"
            poster="/assets/logos/evuno-mark-hologram.png"
            playbackRate={1.22}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen [filter:brightness(1.18)_contrast(1.32)_saturate(0.95)_drop-shadow(0_0_26px_rgba(255,255,255,0.14))]",
              isHome ? "top-[42%] h-[128%] w-[128%] sm:h-[113%] sm:w-[113%]" : "top-[44%] h-[128%] w-[128%] sm:h-[118%] sm:w-[118%]"
            )}
          />
        </Link>

        <div className="relative z-30 flex w-full items-center justify-between gap-3">
          <nav className="flex items-center gap-2 sm:gap-5">
            {leftNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[0.6rem] uppercase tracking-[0.18em] text-steel transition hover:text-mist sm:text-sm sm:tracking-[0.24em]",
                  pathname === item.href && "text-mist"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 pl-10 sm:gap-5 sm:pl-0">
            <nav className="flex items-center gap-2 sm:gap-5">
              {rightNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-[0.6rem] uppercase tracking-[0.18em] text-steel transition hover:text-mist sm:text-sm sm:tracking-[0.24em]",
                    pathname === item.href && "text-mist"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              className={cn(buttonStyles("secondary", "sm"), "px-3 text-[0.62rem] tracking-[0.18em] sm:px-4 sm:text-xs sm:tracking-[0.24em]")}
              onClick={toggleCart}
            >
              Cart {itemCount ? `(${itemCount})` : ""}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
