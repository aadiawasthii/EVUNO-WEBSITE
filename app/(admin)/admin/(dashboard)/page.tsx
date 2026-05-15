import { getStripePaymentReadiness } from "@/lib/stripe-checkout-config";
import { logoutAdminAction, markOrderFulfilledAction, updateVariantStockAction } from "@/lib/actions/admin";
import { getAdminSnapshot } from "@/lib/storefront";
import { formatPrice } from "@/lib/utils";

function orderBadge(status: string) {
  if (status === "FULFILLED") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }

  if (status === "OVERSOLD_REVIEW") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  }

  if (status === "SHIPPING_REVIEW") {
    return "border-orange-400/20 bg-orange-400/10 text-orange-200";
  }

  return "border-white/10 bg-white/5 text-mist";
}

export const metadata = {
  title: "Admin"
};

export default async function AdminDashboardPage() {
  const snapshot = await getAdminSnapshot();
  const paymentReadiness = getStripePaymentReadiness();

  return (
    <section className="shell py-14 sm:py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-4 text-4xl uppercase tracking-[0.14em] sm:text-5xl">Inventory and orders</h1>
        </div>
        <form action={logoutAdminAction}>
          <button type="submit" className="rounded-full border border-white/12 px-5 py-3 text-sm uppercase tracking-[0.18em] text-steel transition hover:text-mist">
            Log out
          </button>
        </form>
      </div>

      {!snapshot ? (
        <div className="space-y-6">
          <section className="glass-panel p-8">
            <p className="text-sm uppercase tracking-[0.22em] text-steel">Payments</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-steel">
              {paymentReadiness.ready ? (
                <p className="text-mist">Stripe checkout has the required core secrets and webhook configuration.</p>
              ) : (
                paymentReadiness.blockingIssues.map((issue) => (
                  <p key={issue} className="text-rose-200">
                    {issue}
                  </p>
                ))
              )}
              {paymentReadiness.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          </section>
          <div className="glass-panel p-8 text-sm leading-7 text-steel">
            Configure PostgreSQL and run the Prisma migration plus seed step to enable the admin dashboard.
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <section className="glass-panel p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-steel">Payments</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-steel">
              {paymentReadiness.ready ? (
                <p className="text-mist">Stripe checkout has the required core secrets and webhook configuration.</p>
              ) : (
                paymentReadiness.blockingIssues.map((issue) => (
                  <p key={issue} className="text-rose-200">
                    {issue}
                  </p>
                ))
              )}
              {paymentReadiness.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          </section>

          <section className="glass-panel overflow-hidden">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-sm uppercase tracking-[0.22em] text-steel">Inventory by size</p>
            </div>
            <div className="divide-y divide-white/8">
              {snapshot.products.map((product) => (
                <div key={product.id} className="px-6 py-5">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-medium text-mist">{product.name}</h2>
                      <p className="mt-2 text-sm text-steel">{formatPrice(product.priceCents)}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {product.variants.map((variant) => (
                      <form key={variant.id} action={updateVariantStockAction} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                        <input type="hidden" name="variantId" value={variant.id} />
                        <p className="text-sm uppercase tracking-[0.22em] text-steel">{variant.size}</p>
                        <p className="mt-2 text-sm text-mist">{variant.color}</p>
                        <label className="mt-4 block">
                          <span className="text-xs uppercase tracking-[0.22em] text-steel">Stock count</span>
                          <input className="input-shell mt-2" type="number" min={0} name="stock" defaultValue={variant.stock} />
                        </label>
                        <button
                          type="submit"
                          className="mt-4 w-full rounded-full border border-white/12 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-mist transition hover:bg-white/10"
                        >
                          Update stock
                        </button>
                      </form>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel overflow-hidden">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-sm uppercase tracking-[0.22em] text-steel">Orders</p>
            </div>
            <div className="divide-y divide-white/8">
              {snapshot.orders.length ? null : (
                <div className="px-6 py-6 text-sm text-steel">No confirmed orders yet.</div>
              )}

              {snapshot.orders.map((order) => (
                <article key={order.id} className="px-6 py-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-medium text-mist">{order.customerEmail}</h2>
                        <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${orderBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-steel">
                        {order.shippingName ?? order.customerName ?? "Name pending"} / {formatPrice(order.totalCents)}
                      </p>
                      <div className="mt-4 space-y-2">
                        {order.orderItems.map((item) => (
                          <p key={item.id} className="text-sm text-steel">
                            {item.productName} / {item.size} / {item.color} / Qty {item.quantity}
                          </p>
                        ))}
                      </div>
                    </div>

                    {order.status !== "FULFILLED" ? (
                      <form action={markOrderFulfilledAction}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-white/12 bg-white/5 px-5 py-3 text-xs uppercase tracking-[0.2em] text-mist transition hover:bg-white/10"
                        >
                          Mark fulfilled
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
