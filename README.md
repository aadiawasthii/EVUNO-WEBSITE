# EVUNO Storefront

Production-ready Next.js storefront for **EVUNO**, built as a premium full-stack ecommerce app for `evuno.fit`.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma ORM
- PostgreSQL
- Stripe Checkout + Stripe webhooks
- Zod validation

## Features

- Cinematic homepage with EVUNO rotating logo video
- Premium shop grid for the three-colorway Series 01 drop
- Product detail pages with 3D model viewers and graceful placeholders
- Persistent cart with local storage
- Server-side Stripe Checkout session creation
- Verified Stripe webhook flow for order creation
- Inventory reservation before checkout and stock decrement after confirmed payment
- Protected admin dashboard for inventory and fulfillment
- Security headers, env-based secrets, and documented operational boundaries

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and fill in real values:

```bash
cp .env.example .env.local
```

3. Create the database schema:

```bash
npm run db:migrate -- --name init
```

4. Seed Series 01:

```bash
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Required values are documented in [.env.example](/Users/aadiawasthi/Documents/New project/.env.example).

- `DATABASE_URL`: Prisma PostgreSQL connection string
- `DIRECT_URL`: direct PostgreSQL connection string for migrations
- `NEXT_PUBLIC_APP_URL`: public site URL, such as `http://localhost:3000` locally or `https://evuno.fit` in production
- `STRIPE_SECRET_KEY`: Stripe secret API key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `STRIPE_ALLOWED_SHIPPING_COUNTRIES`: comma-separated ISO country list for Checkout shipping collection
- `STRIPE_BILLING_ADDRESS_COLLECTION`: `required` or `auto`
- `STRIPE_AUTOMATIC_TAX_ENABLED`: `true` to let Stripe Tax calculate tax in Checkout
- `STRIPE_ALLOW_PROMOTION_CODES`: `true` to allow Stripe promotion codes
- `STRIPE_PHONE_NUMBER_COLLECTION_ENABLED`: `true` to collect phone number in Checkout
- `STRIPE_SHIPPING_RATE_STANDARD`: Stripe shipping rate id for standard shipping
- `STRIPE_SHIPPING_RATE_EXPRESS`: optional Stripe shipping rate id for express shipping
- `STRIPE_ENABLE_SAN_DIEGO_FREE_SHIPPING`: `true` to show a free `San Diego Local Delivery` Checkout shipping option
- `STRIPE_SAN_DIEGO_FREE_SHIPPING_POSTAL_CODES`: comma-separated eligible ZIP/postal codes for the San Diego free-delivery option
- `ADMIN_SECRET`: secure admin login passphrase
- `ADMIN_SESSION_SECRET`: separate signing secret for the admin session cookie

## Stripe Setup

1. In Stripe, create or use an account for EVUNO.
2. In Stripe test mode, create at least one shipping rate for EVUNO.
3. Copy the shipping rate ids into `STRIPE_SHIPPING_RATE_STANDARD` and optionally `STRIPE_SHIPPING_RATE_EXPRESS`.
4. The app also supports a built-in free `San Diego Local Delivery (San Diego only)` option in Stripe Checkout. Leave `STRIPE_ENABLE_SAN_DIEGO_FREE_SHIPPING=true` to show it, or set it to `false` to hide it.
5. The checkout button collects a ZIP/postal code before redirecting to Stripe. Only configured San Diego ZIP-code matches in `STRIPE_SAN_DIEGO_FREE_SHIPPING_POSTAL_CODES` are allowed to see the free-delivery option, and the final Stripe shipping postal code is checked again after payment.
6. If you want Stripe to calculate tax, enable Stripe Tax in the Dashboard and set `STRIPE_AUTOMATIC_TAX_ENABLED=true`.
7. Use the test secret key in local development.
8. Run the Stripe webhook forwarder locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

9. Copy the returned webhook secret into `STRIPE_WEBHOOK_SECRET`.

10. In Stripe, make sure the webhook listens for:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

### Payment Flow

- The site never handles raw card data.
- Checkout sessions are created only on the server.
- Prices are always read from the server/database.
- Checkout refuses to open if the Stripe secret, webhook secret, or database connection is missing.
- Inventory is reserved before the Checkout Session is created.
- Orders are written only after a verified successful Stripe webhook event.
- The success page also re-checks Stripe server-side so the order summary can appear even if the webhook write is still finishing.
- Reservation release is handled for both expired and async-failed Stripe sessions.

## Database Notes

The Prisma schema lives in [prisma/schema.prisma](/Users/aadiawasthi/Documents/New project/prisma/schema.prisma).

Core models:

- `Product`
- `ProductVariant`
- `Order`
- `OrderItem`

Additional operational models:

- `CheckoutReservation`
- `CheckoutReservationItem`

These reservation tables prevent the checkout flow from overselling inventory between session creation and payment confirmation.

## Asset Upload Locations

### Brand video

The homepage expects the rotating logo video at:

- `/public/assets/evuno-logo-rotate.mp4`

This repo already includes the provided EVUNO rotation video copied into that path.

### 3D models

Upload the GLB file here with this exact name:

- `/public/models/shirt-1.glb`

All three storefront products currently point to this same model file. If it is missing, the app automatically falls back to the premium placeholder artwork in `/public/assets/placeholders`.

## Series 01 Seed Data

- `Series 01 Apex Performance Tee / Forest` — `$37`
- `Series 01 Apex Performance Tee / Onyx` — `$37`
- `Series 01 Apex Performance Tee / Cobalt` — `$37`

Each product seeds sizes `S`, `M`, and `L` with stock `25`.

## Admin Access

- Visit `/admin/login`
- Sign in using `ADMIN_SECRET`
- The app sets an `HttpOnly`, signed admin session cookie
- Inventory updates and fulfillment actions are validated server-side

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run db:migrate -- --name init
npm run db:seed
npm run vercel-build
```

## Deployment To Vercel

1. Push the repo to GitHub.
2. Create a Vercel project and import the repository.
3. Provision a PostgreSQL database.
   Recommended options:
   - Vercel Postgres
   - Neon
   - Supabase Postgres
4. Add all environment variables from `.env.example` in the Vercel project settings.
5. Set the Vercel build command to:

```bash
npm run vercel-build
```

6. Deploy.

### Post-deploy checks

- Confirm `/shop` loads products
- Confirm `/product/series-01-apex-performance-tee-forest` renders
- Confirm `/api/webhooks/stripe` is configured as a Stripe webhook endpoint
- Confirm the Stripe webhook subscribes to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `checkout.session.expired`
- Confirm `STRIPE_SHIPPING_RATE_STANDARD` is set to a real shipping rate id
- Confirm checkout redirects to Stripe
- Confirm successful payments create orders in the admin dashboard

## Connecting `evuno.fit`

After the Vercel deployment is healthy:

1. Add `evuno.fit` and `www.evuno.fit` under the Vercel project domains section.
2. Update DNS at your domain registrar using the records Vercel provides.
3. Set `NEXT_PUBLIC_APP_URL=https://evuno.fit`.
4. In Stripe, update the allowed production webhook endpoint to `https://evuno.fit/api/webhooks/stripe`.
5. Re-deploy after the env change.

## Security Checklist

- Stripe secret keys are server-only
- Stripe webhook signatures are verified against the raw request body
- No raw card, CVV, or payment method details are stored
- Checkout pricing is server-authoritative
- Admin access uses signed `HttpOnly` cookies
- Checkout creation is rate limited
- Checkout refuses to start if the Stripe webhook secret or database connection is missing
- Product and admin inputs are validated with Zod
- Security headers are configured in `next.config.mjs`
- Inventory is reserved before checkout and decremented after confirmed payment
- Placeholder fallbacks prevent broken product pages when GLB assets are missing

## Production Configuration Still Required

Before going live, you still need to provide:

- Real production Stripe keys and webhook secret
- Real PostgreSQL connection strings
- Final DNS records for `evuno.fit`
- Final shipping countries and tax configuration in Stripe
- Real GLB garment models in `/public/models`

## Notes

- The repo still contains older non-storefront analysis files from the previous project history, but the ecommerce app runs from the Next.js root structure added here.
- If you want a full third-party auth provider later, the admin secret flow can be swapped for a provider-backed auth layer without changing the product or order models.
