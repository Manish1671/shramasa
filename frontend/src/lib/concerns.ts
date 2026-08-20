/**
 * Centralized Shop-by-Concern map.
 * Product slugs are verified against the live 38-product catalog.
 * Filtering reads only this file — do not duplicate mappings elsewhere.
 */
export type ConcernGroup = "face" | "hair" | "body";

export type Concern = {
  slug: string;
  name: string;
  /** Short tile caption for the homepage grid. */
  tileLabel: string;
  description: string;
  group: ConcernGroup;
  /** Existing catalog product slugs for this concern. */
  productSlugs: string[];
  /** Representative product image for the concern card. */
  imageSlug: string;
};

export function shopConcernHref(concernSlug: string): string {
  return `/shop?concern=${encodeURIComponent(concernSlug)}`;
}

export function shopCategoryHref(categorySlug: string): string {
  return `/shop?category=${encodeURIComponent(categorySlug)}`;
}

export function concernPhotoPath(slug: string): string {
  return `/concerns/${slug}.jpg`;
}

export const CONCERNS: Concern[] = [
  {
    slug: "pigmentation-dark-spots",
    name: "Pigmentation & Dark Spots",
    tileLabel: "Uneven tone",
    description: "Brightening care for a more even-looking complexion.",
    group: "face",
    productSlugs: ["vitamin-c-serum", "niacinamide-serum"],
    imageSlug: "vitamin-c-serum",
  },
  {
    slug: "acne-breakouts",
    name: "Acne & Breakouts",
    tileLabel: "Acne",
    description: "Targeted care for blemish-prone skin.",
    group: "face",
    productSlugs: ["salicylic-acid-cleanser", "acne-spot-gel"],
    imageSlug: "acne-spot-gel",
  },
  {
    slug: "oiliness",
    name: "Oiliness",
    tileLabel: "Oiliness",
    description: "Balancing care for shine-prone, congested-feeling skin.",
    group: "face",
    productSlugs: [
      "salicylic-acid-cleanser",
      "niacinamide-serum",
      "aha-bha-exfoliating-serum",
    ],
    imageSlug: "niacinamide-serum",
  },
  {
    slug: "dullness-glow",
    name: "Dullness & Glow",
    tileLabel: "Glow",
    description: "Daily essentials for fresh, luminous-looking skin.",
    group: "face",
    productSlugs: ["vitamin-c-serum", "radiance-face-mask"],
    imageSlug: "radiance-face-mask",
  },
  {
    slug: "dryness-dehydration",
    name: "Dryness & Dehydration",
    tileLabel: "Dryness",
    description: "Comforting hydration for dry, thirsty skin.",
    group: "face",
    productSlugs: [
      "hyaluronic-hydration-serum",
      "hydrating-gel-cream",
      "hydrating-body-lotion",
    ],
    imageSlug: "hyaluronic-hydration-serum",
  },
  {
    slug: "barrier-sensitivity",
    name: "Barrier & Sensitivity",
    tileLabel: "Barrier",
    description: "Gentle care for a supported, comfortable skin barrier.",
    group: "face",
    productSlugs: [
      "cream-comfort-cleanser",
      "ceramide-moisturizer",
      "hydrating-gel-cream",
    ],
    imageSlug: "ceramide-moisturizer",
  },
  {
    slug: "sun-protection",
    name: "Sun Protection",
    tileLabel: "Sun",
    description: "Everyday protection for exposed skin.",
    group: "face",
    productSlugs: ["spf-50-sunscreen"],
    imageSlug: "spf-50-sunscreen",
  },
  {
    slug: "hair-fall-weakness",
    name: "Hair Fall & Weakness",
    tileLabel: "Hair fall",
    description: "Care for stronger-looking, healthier hair.",
    group: "hair",
    productSlugs: [
      "hair-growth-serum",
      "strengthening-shampoo",
      "scalp-balance-serum",
    ],
    imageSlug: "hair-growth-serum",
  },
  {
    slug: "dandruff-scalp-care",
    name: "Dandruff & Scalp Care",
    tileLabel: "Scalp",
    description: "Targeted care for a balanced, comfortable scalp.",
    group: "hair",
    productSlugs: ["anti-dandruff-shampoo", "scalp-balance-serum"],
    imageSlug: "anti-dandruff-shampoo",
  },
  {
    slug: "dry-damaged-hair",
    name: "Dry & Damaged Hair",
    tileLabel: "Dry hair",
    description: "Restorative care for dry, stressed strands.",
    group: "hair",
    productSlugs: [
      "nourishing-conditioner",
      "repair-hair-mask",
      "leave-in-conditioner",
    ],
    imageSlug: "repair-hair-mask",
  },
  {
    slug: "frizz-smoothness",
    name: "Frizz & Smoothness",
    tileLabel: "Frizz",
    description: "Conditioning care for smoother-looking hair.",
    group: "hair",
    productSlugs: ["nourishing-conditioner", "leave-in-conditioner"],
    imageSlug: "leave-in-conditioner",
  },
  {
    slug: "body-dryness",
    name: "Body Dryness",
    tileLabel: "Body dryness",
    description: "Comforting moisture for soft, supple body skin.",
    group: "body",
    productSlugs: ["hydrating-body-lotion", "whipped-body-cream"],
    imageSlug: "hydrating-body-lotion",
  },
  {
    slug: "underarm-care",
    name: "Underarm Care",
    tileLabel: "Underarm",
    description: "Simple everyday care for fresh, comfortable underarms.",
    group: "body",
    productSlugs: ["fresh-balance-underarm-roll-on"],
    imageSlug: "fresh-balance-underarm-roll-on",
  },
];

export const CONCERN_GROUPS: {
  id: ConcernGroup;
  label: string;
  heading: string;
  description: string;
  categorySlug: string;
  shopLabel: string;
}[] = [
  {
    id: "face",
    label: "Face",
    heading: "Care for the complexion.",
    description:
      "From blemishes and dullness to barrier comfort and daily sun.",
    categorySlug: "face-care",
    shopLabel: "Shop face care",
  },
  {
    id: "hair",
    label: "Hair & Scalp",
    heading: "Care for scalp and lengths.",
    description:
      "Balance, strength, and softness — from wash to leave-in.",
    categorySlug: "hair-care",
    shopLabel: "Shop hair care",
  },
  {
    id: "body",
    label: "Body",
    heading: "Care beyond the face.",
    description:
      "Moisture and freshness for the daily shower-to-evening ritual.",
    categorySlug: "body-care",
    shopLabel: "Shop body care",
  },
];

export function getConcernBySlug(slug: string | undefined | null): Concern | undefined {
  if (!slug) return undefined;
  return CONCERNS.find((concern) => concern.slug === slug);
}

export function getProductSlugsForConcern(
  slug: string | undefined | null,
): string[] | null {
  const concern = getConcernBySlug(slug);
  return concern ? concern.productSlugs : null;
}
