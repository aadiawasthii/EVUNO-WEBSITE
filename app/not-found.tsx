import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="shell py-20">
      <div className="mx-auto max-w-2xl glass-panel p-10 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-4xl uppercase tracking-[0.14em]">This route hasn’t evolved yet</h1>
        <p className="mt-5 text-sm leading-7 text-steel">
          The page you were looking for could not be found. Head back to the storefront and continue through Series 01.
        </p>
        <Link href="/" className={`${buttonStyles("primary")} mt-8`}>
          Return home
        </Link>
      </div>
    </section>
  );
}
