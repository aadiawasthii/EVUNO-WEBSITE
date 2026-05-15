import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/6 py-10">
      <div className="shell flex flex-col gap-4 text-sm text-steel md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium uppercase tracking-[0.24em] text-mist">EVUNO</p>
          <p className="mt-2 max-w-xl leading-7">
            Evolution-forward streetwear built around discipline, identity, and future-facing minimalism.
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link href="/shop" className="hover:text-mist">
            Shop
          </Link>
          <Link href="/about" className="hover:text-mist">
            About
          </Link>
          <Link href="/admin/login" className="hover:text-mist">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
