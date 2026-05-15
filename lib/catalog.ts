export const PRODUCT_SIZES = ["S", "M", "L"] as const;
export type ProductSize = (typeof PRODUCT_SIZES)[number];

export type SeedVariant = {
  id: string;
  size: ProductSize;
  color: string;
  stock: number;
  sku: string;
};

export type SeedProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  active: boolean;
  modelUrl: string;
  imageUrl: string;
  posterUrl: string;
  videoUrl?: string;
  videoScale?: number;
  videoPlaybackRate?: number;
  frontStillUrl: string;
  backStillUrl: string;
  color: string;
  tagline: string;
  featureHighlights: string[];
  material: string;
  fitLabel: string;
  useCase: string;
  manufacturingNote: string;
  details: string;
  fit: string;
  shipping: string;
  care: string;
  variants: SeedVariant[];
};

export const series01Editorial = {
  trioLookUrl: "/assets/products/editorial/trio-look.png",
  performanceImageUrl: "/assets/products/editorial/onyx-performance.png",
  fabricDetailUrl: "/assets/products/editorial/fabric-detail.png",
  reflectiveBackModelUrl: "/assets/products/editorial/reflective-back-model.png"
} as const;

export function getSeries01RunnerByColor(color: string) {
  switch (color.toLowerCase()) {
    case "forest":
      return "/assets/products/editorial/forest-performance.png";
    case "cobalt":
      return "/assets/products/editorial/cobalt-performance.png";
    case "onyx":
    default:
      return "/assets/products/editorial/onyx-performance.png";
  }
}

function buildVariants(baseSku: string, color: string): SeedVariant[] {
  return PRODUCT_SIZES.map((size) => ({
    id: `${baseSku}-${size.toLowerCase()}`,
    size,
    color,
    stock: 25,
    sku: `${baseSku}-${size}`
  }));
}

export const seedProducts: SeedProduct[] = [
  {
    id: "seed-series-01-apex-performance-tee-forest",
    slug: "series-01-apex-performance-tee-forest",
    name: "Series 01 Apex Performance Tee",
    description: "Muted field green engineered for a quieter tactical read, sharp shoulder reflectivity, and a disciplined EVUNO silhouette.",
    priceCents: 3599,
    active: true,
    modelUrl: "/models/shirt-1.glb",
    imageUrl: "/assets/products/stills/forest-front.png",
    posterUrl: "/assets/products/stills/forest-front.png",
    videoUrl: "/assets/products/series-01-forest.webm",
    videoScale: 1,
    videoPlaybackRate: 1.12,
    frontStillUrl: "/assets/products/stills/forest-front.png",
    backStillUrl: "/assets/products/stills/forest-back.png",
    color: "Forest",
    tagline: "Field-tone performance knit with controlled reflectivity and a quieter visual footprint.",
    featureHighlights: [
      "Lightweight breathable fabric",
      "Sweat-wicking",
      "Athletic fitted feel",
      "Reflective detailing",
      "Seamless engineered texture",
      "Stretch for unrestricted movement",
      "Training + lifestyle wear"
    ],
    material: "88% Polyester / 12% Elastane",
    fitLabel: "Athletic / fitted fit · True to size",
    useCase: "Built for training sessions, road miles, and everyday wear.",
    manufacturingNote: "Custom-engineered + manufactured performance material.",
    details:
      "The EVUNO Performance Athletic Tee features a lightweight breathable fabric with an athletic fit designed to move with you through every workout. Seamless texture, sweat-wicking material, and reflective detailing keep the silhouette technical and premium, while Forest softens the palette without losing the engineered look.",
    fit: "Athletic / fitted fit. True to size with a close body line through the chest and shoulder and enough stretch for unrestricted movement.",
    shipping:
      "Secure Stripe Checkout collects shipping and payment details. Orders enter fulfillment only after verified payment success, and tracking is issued as soon as the package is processed.",
    care: "Machine wash cold with similar colors, skip bleach and high heat, then low tumble or hang dry to preserve the seamless texture, reflective finish, and fabric recovery.",
    variants: buildVariants("SERIES01-FOREST", "Forest")
  },
  {
    id: "seed-series-01-apex-performance-tee-onyx",
    slug: "series-01-apex-performance-tee-onyx",
    name: "Series 01 Apex Performance Tee",
    description: "Stealth black with the cleanest contrast through the chest crest, tonal mapping, and the rear reflective EVUNO spine.",
    priceCents: 3599,
    active: true,
    modelUrl: "/models/shirt-1.glb",
    imageUrl: "/assets/products/stills/onyx-front.png",
    posterUrl: "/assets/products/stills/onyx-front.png",
    videoUrl: "/assets/products/series-01-onyx.webm",
    videoScale: 1,
    videoPlaybackRate: 1.12,
    frontStillUrl: "/assets/products/stills/onyx-front.png",
    backStillUrl: "/assets/products/stills/onyx-back.png",
    color: "Onyx",
    tagline: "Stealth-first finish with the sharpest EVUNO light response.",
    featureHighlights: [
      "Lightweight breathable fabric",
      "Sweat-wicking",
      "Athletic fitted feel",
      "Reflective detailing",
      "Seamless engineered texture",
      "Stretch for unrestricted movement",
      "Training + lifestyle wear"
    ],
    material: "88% Polyester / 12% Elastane",
    fitLabel: "Athletic / fitted fit · True to size",
    useCase: "Built for lifting, conditioning, and off-duty wear.",
    manufacturingNote: "Custom-engineered + manufactured performance material.",
    details:
      "The EVUNO Performance Athletic Tee features a lightweight breathable fabric with an athletic fit designed to move with you through every workout. In Onyx, the seamless texture and reflective spine read with the most precision, giving the tee its sharpest after-dark signature without adding unnecessary noise.",
    fit: "Athletic / fitted fit. True to size with a close body line through the chest and shoulder and enough stretch for unrestricted movement.",
    shipping:
      "Checkout supports secure address collection through Stripe, and fulfillment begins only after a verified successful payment event reaches the backend.",
    care: "Machine wash cold with similar colors, skip bleach and high heat, then low tumble or hang dry to preserve the seamless texture, reflective finish, and fabric recovery.",
    variants: buildVariants("SERIES01-ONYX", "Onyx")
  },
  {
    id: "seed-series-01-apex-performance-tee-cobalt",
    slug: "series-01-apex-performance-tee-cobalt",
    name: "Series 01 Apex Performance Tee",
    description: "Deep cobalt with sharpened panel zoning, chrome-response detailing, and a brighter technical edge.",
    priceCents: 3599,
    active: true,
    modelUrl: "/models/shirt-1.glb",
    imageUrl: "/assets/products/stills/cobalt-front.png",
    posterUrl: "/assets/products/stills/cobalt-front.png",
    videoUrl: "/assets/products/series-01-cobalt.webm",
    videoScale: 1,
    videoPlaybackRate: 1.12,
    frontStillUrl: "/assets/products/stills/cobalt-front.png",
    backStillUrl: "/assets/products/stills/cobalt-back.png",
    color: "Cobalt",
    tagline: "High-contrast cobalt built to read faster, brighter, and more technical.",
    featureHighlights: [
      "Lightweight breathable fabric",
      "Sweat-wicking",
      "Athletic fitted feel",
      "Reflective detailing",
      "Seamless engineered texture",
      "Stretch for unrestricted movement",
      "Training + lifestyle wear"
    ],
    material: "88% Polyester / 12% Elastane",
    fitLabel: "Athletic / fitted fit · True to size",
    useCase: "Built for fast training days, recovery movement, and everyday rotation.",
    manufacturingNote: "Custom-engineered + manufactured performance material.",
    details:
      "The EVUNO Performance Athletic Tee features a lightweight breathable fabric with an athletic fit designed to move with you through every workout. Cobalt adds a more vivid technical presence, while the seamless texture, stretch response, and reflective detailing keep the garment clean instead of loud.",
    fit: "Athletic / fitted fit. True to size with a close body line through the chest and shoulder and enough stretch for unrestricted movement.",
    shipping:
      "Orders are created only after a verified successful Stripe webhook event, keeping fulfillment, inventory, and payment state aligned from the start.",
    care: "Machine wash cold with similar colors, skip bleach and high heat, then low tumble or hang dry to preserve the seamless texture, reflective finish, and fabric recovery.",
    variants: buildVariants("SERIES01-COBALT", "Cobalt")
  }
];

export const seedProductMap = new Map(seedProducts.map((product) => [product.slug, product]));

export function getSeedProductBySlug(slug: string) {
  return seedProductMap.get(slug) ?? null;
}
