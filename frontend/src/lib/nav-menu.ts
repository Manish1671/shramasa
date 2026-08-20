import {
  CONCERNS,
  shopCategoryHref,
  shopConcernHref,
} from "@/lib/concerns";
import { productImagePath } from "@/lib/product-image";

export type MegaLink = {
  href: string;
  label: string;
};

export type MegaColumn = {
  title: string;
  links: MegaLink[];
};

export type MegaFeatured = {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  mega?: {
    columns: MegaColumn[];
    featured?: MegaFeatured;
  };
};

function concernLinks(group: "face" | "hair" | "body"): MegaLink[] {
  return CONCERNS.filter((concern) => concern.group === group).map(
    (concern) => ({
      href: shopConcernHref(concern.slug),
      label: concern.tileLabel,
    }),
  );
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "shop",
    label: "Shop",
    href: "/shop",
    mega: {
      columns: [
        {
          title: "Shop by concern",
          links: concernLinks("face"),
        },
        {
          title: "Hair & body",
          links: [...concernLinks("hair"), ...concernLinks("body")],
        },
        {
          title: "The collection",
          links: [
            { href: "/shop", label: "All products" },
            { href: shopCategoryHref("face-care"), label: "Face care" },
            { href: shopCategoryHref("hair-care"), label: "Hair care" },
            { href: shopCategoryHref("body-care"), label: "Body care" },
            { href: shopCategoryHref("lip-fragrance"), label: "Lip & fragrance" },
            { href: shopCategoryHref("ritual-kits"), label: "Ritual kits" },
          ],
        },
      ],
      featured: {
        href: "/shop/glow-ritual-kit",
        image: productImagePath("glow-ritual-kit"),
        eyebrow: "Featured ritual",
        title: "Glow Ritual Kit",
      },
    },
  },
  {
    id: "bestsellers",
    label: "Bestsellers",
    href: "/#bestsellers",
  },
  {
    id: "face",
    label: "Face Care",
    href: shopCategoryHref("face-care"),
    mega: {
      columns: [
        {
          title: "Shop by concern",
          links: concernLinks("face"),
        },
        {
          title: "The ritual",
          links: [
            { href: "/shop/gentle-gel-cleanser", label: "Cleanse" },
            { href: "/shop/hydrating-toner", label: "Tone" },
            { href: "/shop/vitamin-c-serum", label: "Treat" },
            { href: "/shop/ceramide-moisturizer", label: "Moisturize" },
            { href: "/shop/spf-50-sunscreen", label: "SPF" },
            { href: "/shop/radiance-face-mask", label: "Mask" },
          ],
        },
        {
          title: "Ingredients",
          links: [
            { href: "/shop/vitamin-c-serum", label: "Vitamin C" },
            { href: "/shop/niacinamide-serum", label: "Niacinamide" },
            { href: "/shop/hyaluronic-hydration-serum", label: "Hyaluronic acid" },
            { href: "/shop/ceramide-moisturizer", label: "Ceramide" },
            { href: "/shop/salicylic-acid-cleanser", label: "Salicylic acid" },
            { href: "/shop/spf-50-sunscreen", label: "UV filters" },
          ],
        },
      ],
      featured: {
        href: "/shop/vitamin-c-serum",
        image: productImagePath("vitamin-c-serum"),
        eyebrow: "Most requested",
        title: "Vitamin C Serum",
      },
    },
  },
  {
    id: "hair",
    label: "Hair Care",
    href: shopCategoryHref("hair-care"),
    mega: {
      columns: [
        {
          title: "Shop by concern",
          links: concernLinks("hair"),
        },
        {
          title: "The ritual",
          links: [
            { href: "/shop/strengthening-shampoo", label: "Shampoo" },
            { href: "/shop/nourishing-conditioner", label: "Conditioner" },
            { href: "/shop/repair-hair-mask", label: "Mask" },
            { href: "/shop/nourishing-hair-oil", label: "Oil" },
            { href: "/shop/hair-growth-serum", label: "Serum" },
            { href: "/shop/leave-in-conditioner", label: "Leave-in" },
          ],
        },
      ],
      featured: {
        href: "/shop/nourishing-hair-oil",
        image: productImagePath("nourishing-hair-oil"),
        eyebrow: "Hair essential",
        title: "Nourishing Hair Oil",
      },
    },
  },
  {
    id: "body",
    label: "Body Care",
    href: shopCategoryHref("body-care"),
    mega: {
      columns: [
        {
          title: "Shop by concern",
          links: concernLinks("body"),
        },
        {
          title: "Body",
          links: [
            { href: "/shop/gentle-body-wash", label: "Wash" },
            { href: "/shop/smoothing-body-scrub", label: "Scrub" },
            { href: "/shop/hydrating-body-lotion", label: "Lotion" },
            { href: "/shop/whipped-body-cream", label: "Cream" },
            {
              href: "/shop/fresh-balance-underarm-roll-on",
              label: "Roll-on",
            },
          ],
        },
        {
          title: "Lip & fragrance",
          links: [
            { href: "/shop/nourishing-lip-balm", label: "Lip balm" },
            { href: "/shop/spf-30-lip-balm", label: "SPF lip" },
            { href: "/shop/overnight-lip-mask", label: "Lip mask" },
            { href: "/shop/forest-veil-solid-perfume", label: "Solid perfume" },
          ],
        },
      ],
      featured: {
        href: "/shop/whipped-body-cream",
        image: productImagePath("whipped-body-cream"),
        eyebrow: "Body essential",
        title: "Whipped Body Cream",
      },
    },
  },
  {
    id: "rituals",
    label: "Rituals",
    href: shopCategoryHref("ritual-kits"),
    mega: {
      columns: [
        {
          title: "Ritual kits",
          links: [
            { href: "/shop/glow-ritual-kit", label: "Glow Ritual Kit" },
            { href: "/shop/barrier-repair-kit", label: "Barrier Repair Kit" },
            {
              href: "/shop/hair-repair-ritual-kit",
              label: "Hair Repair Ritual Kit",
            },
            {
              href: "/shop/everyday-body-ritual-kit",
              label: "Everyday Body Ritual Kit",
            },
          ],
        },
      ],
      featured: {
        href: "/shop/glow-ritual-kit",
        image: productImagePath("glow-ritual-kit"),
        eyebrow: "Start here",
        title: "Glow Ritual Kit",
      },
    },
  },
  {
    id: "about",
    label: "About",
    href: "/about",
  },
];
