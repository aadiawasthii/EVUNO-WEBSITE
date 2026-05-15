import Link from "next/link";

import { CheckoutReset } from "@/components/cart/checkout-reset";
import { buttonStyles } from "@/components/ui/button";
import { syncPaidCheckoutSessionById } from "@/lib/checkout";
import { getOrderBySessionId } from "@/lib/storefront";
import { formatPrice } from "@/lib/utils";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export const metadata = {
  title: "Checkout Success"
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  let order = sessionId ? await getOrderBySessionId(sessionId) : null;

  if (!order && sessionId) {
    // Security-sensitive: we only backfill the order by re-checking the Stripe session server-side.
    order = await syncPaidCheckoutSessionById(sessionId);
  }

  return (
    <section className="shell py-16 sm:py-20">
      <CheckoutReset />
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="glass-panel p-8 sm:p-10">
          <p className="eyebrow">Order confirmed</p>
          <h1 className="mt-4 text-4xl uppercase tracking-[0.14em] sm:text-5xl">Your evolution starts now.</h1>
          <p className="mt-5 text-sm leading-7 text-steel">
            Payment was successfully handed off through Stripe Checkout. If the order summary is still loading, the verified webhook may still be finishing the final write.
          </p>

          {order ? (
            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm uppercase tracking-[0.22em] text-steel">Order summary</p>
                <p className="text-sm uppercase tracking-[0.22em] text-mist">{formatPrice(order.totalCents)}</p>
              </div>
              <div className="mt-5 space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4 border-t border-white/8 pt-3 first:border-t-0 first:pt-0">
                    <div>
                      <p className="font-medium text-mist">{item.productName}</p>
                      <p className="mt-1 text-sm text-steel">
                        {item.size} / {item.color} / Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-mist">{formatPrice(item.unitPriceCents * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[24px] border border-dashed border-white/12 p-6 text-sm text-steel">
              We’re waiting for the webhook-confirmed order record. Refresh in a moment if this summary has not appeared yet.
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/shop" className={buttonStyles("primary")}>
              Continue shopping
            </Link>
            <Link href="/about" className={buttonStyles("secondary")}>
              About EVUNO
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
