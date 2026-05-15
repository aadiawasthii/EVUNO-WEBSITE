import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export const metadata = {
  title: "Checkout Cancelled"
};

export default function CancelPage() {
  return (
    <section className="shell py-16 sm:py-20">
      <div className="mx-auto max-w-2xl glass-panel p-8 text-center sm:p-10">
        <p className="eyebrow">Checkout cancelled</p>
        <h1 className="mt-4 text-4xl uppercase tracking-[0.14em] sm:text-5xl">Your cart is still waiting</h1>
        <p className="mt-5 text-sm leading-7 text-steel">
          Nothing was charged on-site. Return to your cart any time and restart the secure Stripe Checkout flow when you are ready.
        </p>
        <Link href="/cart" className={`${buttonStyles("primary")} mt-8`}>
          Return to cart
        </Link>
      </div>
    </section>
  );
}
