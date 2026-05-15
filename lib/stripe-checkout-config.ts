import "server-only";

import type Stripe from "stripe";

import { getEnv } from "@/lib/env";
import { isSanDiegoFreeShippingPostalCode } from "@/lib/shipping";

const DEFAULT_ALLOWED_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] = [
  "US",
  "CA",
  "GB",
  "AU",
  "DE",
  "FR",
  "NL"
];

function readBooleanEnv(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === "true";
}

function buildSanDiegoFreeShippingOption(): Stripe.Checkout.SessionCreateParams.ShippingOption {
  return {
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: "San Diego Local Delivery (San Diego only)",
      fixed_amount: {
        amount: 0,
        currency: "usd"
      },
      delivery_estimate: {
        minimum: {
          unit: "business_day",
          value: 1
        },
        maximum: {
          unit: "business_day",
          value: 2
        }
      }
    }
  };
}

function readShippingRateId(key: "STRIPE_SHIPPING_RATE_STANDARD" | "STRIPE_SHIPPING_RATE_EXPRESS") {
  const value = process.env[key];

  if (!value) {
    return null;
  }

  if (!/^shr_[A-Za-z0-9]+$/.test(value)) {
    throw new Error(`${key} must be a Stripe shipping rate id beginning with shr_.`);
  }

  return value;
}

function parseAllowedCountries(rawValue: string | undefined) {
  if (!rawValue) {
    return DEFAULT_ALLOWED_COUNTRIES;
  }

  const parsed = rawValue
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter((value): value is Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry =>
      /^[A-Z]{2}$/.test(value)
    );

  return parsed.length ? parsed : DEFAULT_ALLOWED_COUNTRIES;
}

export function getStripeCheckoutConfig(shippingPostalCode?: string) {
  const standardShippingRate = readShippingRateId("STRIPE_SHIPPING_RATE_STANDARD");
  const expressShippingRate = readShippingRateId("STRIPE_SHIPPING_RATE_EXPRESS");
  const includeSanDiegoFreeShipping = readBooleanEnv(process.env.STRIPE_ENABLE_SAN_DIEGO_FREE_SHIPPING, true);
  const normalizedShippingPostalCode = shippingPostalCode?.trim() ?? "";
  const includeFreeSanDiegoOption =
    includeSanDiegoFreeShipping &&
    normalizedShippingPostalCode.length > 0 &&
    isSanDiegoFreeShippingPostalCode(normalizedShippingPostalCode);

  const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [];

  if (standardShippingRate) {
    shippingOptions.push({
      shipping_rate: standardShippingRate
    });
  }

  if (includeFreeSanDiegoOption) {
    shippingOptions.push(buildSanDiegoFreeShippingOption());
  }

  if (expressShippingRate) {
    shippingOptions.push({
      shipping_rate: expressShippingRate
    });
  }

  return {
    billingAddressCollection:
      process.env.STRIPE_BILLING_ADDRESS_COLLECTION === "auto"
        ? ("auto" as Stripe.Checkout.SessionCreateParams.BillingAddressCollection)
        : ("required" as Stripe.Checkout.SessionCreateParams.BillingAddressCollection),
    allowedCountries: parseAllowedCountries(process.env.STRIPE_ALLOWED_SHIPPING_COUNTRIES),
    automaticTaxEnabled: readBooleanEnv(process.env.STRIPE_AUTOMATIC_TAX_ENABLED, false),
    allowPromotionCodes: readBooleanEnv(process.env.STRIPE_ALLOW_PROMOTION_CODES, false),
    phoneNumberCollectionEnabled: readBooleanEnv(process.env.STRIPE_PHONE_NUMBER_COLLECTION_ENABLED, true),
    shippingOptions
  };
}

export function getStripePaymentReadiness() {
  const env = getEnv();
  const blockingIssues: string[] = [];
  const warnings: string[] = [];

  if (!process.env.DATABASE_URL) {
    blockingIssues.push("DATABASE_URL is missing.");
  }

  if (!env.STRIPE_SECRET_KEY) {
    blockingIssues.push("STRIPE_SECRET_KEY is missing.");
  }

  if (!env.STRIPE_WEBHOOK_SECRET) {
    blockingIssues.push("STRIPE_WEBHOOK_SECRET is missing.");
  }

  const checkoutConfig = getStripeCheckoutConfig();

  if (!checkoutConfig.shippingOptions.length) {
    warnings.push("No Stripe shipping rate ids are configured. Checkout will collect addresses without charging shipping.");
  }

  if (!checkoutConfig.automaticTaxEnabled) {
    warnings.push("Automatic tax is disabled. Stripe Tax will not calculate taxes until STRIPE_AUTOMATIC_TAX_ENABLED=true.");
  }

  return {
    ready: blockingIssues.length === 0,
    blockingIssues,
    warnings,
    checkoutConfig
  };
}

export function assertStripeCheckoutOperational(shippingPostalCode?: string) {
  const readiness = getStripePaymentReadiness();

  if (!readiness.ready) {
    throw new Error(`Checkout is not ready: ${readiness.blockingIssues.join(" ")}`);
  }

  return getStripeCheckoutConfig(shippingPostalCode);
}
