import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="relative min-h-screen">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
