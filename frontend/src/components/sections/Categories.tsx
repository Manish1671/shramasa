import Link from "next/link";

import { ProductPhotoFrame } from "@/components/commerce/ProductPhotoFrame";
import { QuietLink } from "@/components/layout/QuietLink";
import { Section, SectionHeader } from "@/components/layout/Section";
import { productImagePath } from "@/lib/product-image";

const categories = [
  {
    name: "Face Care",
    href: "/shop?category=face-care",
    description: "Cleanse, treat, and protect.",
    slug: "vitamin-c-serum",
  },
  {
    name: "Hair Care",
    href: "/shop?category=hair-care",
    description: "Scalp to lengths, botanically.",
    slug: "nourishing-hair-oil",
  },
  {
    name: "Body Care",
    href: "/shop?category=body-care",
    description: "From shower to evening.",
    slug: "hydrating-body-lotion",
  },
  {
    name: "Ritual Kits",
    href: "/shop?category=ritual-kits",
    description: "Complete, considered sets.",
    slug: "glow-ritual-kit",
  },
] as const;

export function Categories() {
  return (
    <Section tone="stone">
      <div className="reveal">
        <SectionHeader
          eyebrow="The house"
          title="Shop by category"
          action={<QuietLink href="/shop">View the collection</QuietLink>}
        />

        <div className="mt-10 grid gap-x-8 gap-y-12 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ProductPhotoFrame
                src={productImagePath(category.slug)}
                alt=""
                slug={category.slug}
              />
              <h3 className="type-h4 mt-5">{category.name}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
