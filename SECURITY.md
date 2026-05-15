# SECURITY

## What This App Handles

- Server-side Stripe Checkout Session creation
- Stripe webhook signature verification
- Product, inventory, and order storage in PostgreSQL through Prisma
- Admin route protection with signed `HttpOnly` cookies
- Input validation with Zod for checkout and admin actions
- Security headers through Next.js response headers

## What This App Does Not Handle

- Raw card number collection
- Raw CVV collection
- Direct client-side price authority
- Public access to admin inventory mutation routes
- Long-term fraud detection or chargeback workflow management
- Advanced distributed rate limiting across multiple regions

## Payment Security Model

- Card data is collected only by Stripe Checkout.
- The app does not store PAN, CVV, or reusable payment details.
- Stripe webhook verification uses the raw request body and `STRIPE_WEBHOOK_SECRET`.
- Orders are created only after verified successful payment events.
- Checkout refuses to open if core payment infrastructure like the Stripe secret, webhook secret, or database connection is missing.
- Reservation release is handled for expired and async-failed Checkout Sessions so held stock does not stay trapped indefinitely.

## Inventory Safety Model

- Checkout creation validates inventory server-side.
- Active cart items are turned into short-lived inventory reservations before Stripe Checkout is opened.
- Inventory is decremented only after the payment-confirmed webhook flow runs.
- If stock becomes inconsistent despite the reservation flow, the order is marked `OVERSOLD_REVIEW` for manual intervention rather than silently corrupting inventory.

## Admin Security Model

- Admin access requires `ADMIN_SECRET`.
- The login flow sets a signed `HttpOnly` cookie.
- Admin write actions re-check the session server-side.
- Secrets are never sent to client-side JavaScript as `NEXT_PUBLIC_*` values.

## Operational Recommendations

- Use separate test and live Stripe keys.
- Keep `ADMIN_SECRET` and `ADMIN_SESSION_SECRET` long and unique.
- Rotate secrets if you suspect exposure.
- Enable HTTPS everywhere in production.
- Use a managed Postgres provider with backups enabled.
- Consider replacing the in-memory rate limiter with Redis or Upstash before very high traffic launches.
- Monitor Stripe webhook delivery and retry failures.

## Reporting

If you discover a security issue in this codebase, rotate any exposed secrets first, disable affected endpoints if needed, and patch the issue before relaunching public checkout traffic.
