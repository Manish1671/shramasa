/**
 * Canonical storefront image path: exact product slug → local PNG.
 * Prefer this over DB image URLs so mapping cannot drift by order/index.
 */
export function productImagePath(slug: string): string {
  return `/products/${slug}.png`;
}

const PRODUCT_IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  "acne-spot-gel": { width: 304, height: 523 },
  "aha-bha-exfoliating-serum": { width: 323, height: 482 },
  "aloe-vera-gel": { width: 345, height: 482 },
  "anti-dandruff-shampoo": { width: 323, height: 464 },
  "barrier-repair-kit": { width: 449, height: 526 },
  "botanical-shower-gel": { width: 343, height: 527 },
  "ceramide-moisturizer": { width: 310, height: 623 },
  "cream-comfort-cleanser": { width: 309, height: 521 },
  "daily-defense-sunscreen": { width: 309, height: 623 },
  "everyday-body-ritual-kit": { width: 427, height: 526 },
  "forest-veil-solid-perfume": { width: 319, height: 542 },
  "fresh-balance-underarm-roll-on": { width: 343, height: 522 },
  "gentle-body-wash": { width: 343, height: 527 },
  "gentle-cleansing-oil": { width: 304, height: 519 },
  "gentle-gel-cleanser": { width: 303, height: 521 },
  "glow-ritual-kit": { width: 1536, height: 1024 },
  "hair-growth-serum": { width: 310, height: 623 },
  "hair-repair-ritual-kit": { width: 446, height: 526 },
  "hyaluronic-hydration-serum": { width: 308, height: 523 },
  "hydrating-body-lotion": { width: 310, height: 623 },
  "hydrating-gel-cream": { width: 339, height: 482 },
  "hydrating-toner": { width: 306, height: 523 },
  "leave-in-conditioner": { width: 344, height: 527 },
  "niacinamide-serum": { width: 302, height: 523 },
  "nourishing-conditioner": { width: 339, height: 464 },
  "nourishing-hair-oil": { width: 309, height: 623 },
  "nourishing-lip-balm": { width: 345, height: 522 },
  "overnight-lip-mask": { width: 319, height: 542 },
  "pure-glycerin-soap": { width: 343, height: 522 },
  "radiance-face-mask": { width: 347, height: 482 },
  "radiance-face-wash": { width: 310, height: 623 },
  "repair-hair-mask": { width: 345, height: 463 },
  "salicylic-acid-cleanser": { width: 307, height: 521 },
  "scalp-balance-serum": { width: 347, height: 463 },
  "smoothing-body-scrub": { width: 344, height: 522 },
  "spf-30-lip-balm": { width: 311, height: 542 },
  "spf-50-sunscreen": { width: 309, height: 623 },
  "strengthening-shampoo": { width: 309, height: 623 },
  "vitamin-c-serum": { width: 309, height: 623 },
  "whipped-body-cream": { width: 345, height: 527 },
};

export function productImageSize(slug: string): { width: number; height: number } {
  return PRODUCT_IMAGE_SIZES[slug] ?? { width: 350, height: 527 };
}

/**
 * Presentation mode from source dimensions — never from product names.
 * 4:5 is 0.8; wider sources need landscape treatment inside that media region.
 */
export function productImageOrientation(
  slug: string,
): "portrait" | "landscape" | "square" {
  const { width, height } = productImageSize(slug);
  const ratio = width / height;
  if (ratio >= 1.05) return "landscape";
  if (ratio <= 0.92) return "portrait";
  return "square";
}
