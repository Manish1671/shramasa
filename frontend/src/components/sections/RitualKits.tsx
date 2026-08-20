import Link from "next/link";

import { ProductThumb } from "@/components/commerce/ProductThumb";
import { StoreImage } from "@/components/commerce/StoreImage";
import { QuietLink } from "@/components/layout/QuietLink";
import { Section, SectionHeader } from "@/components/layout/Section";
import { productImageSize } from "@/lib/product-image";

const kits = [
  {
    name: "Glow Ritual Kit",
    slug: "glow-ritual-kit",
    copy: "Vitamin C Serum, Hydrating Gel Cream, and SPF 50 — a daytime radiance set.",
    image: "/products/glow-ritual-kit.png",
  },
  {
    name: "Hair Repair Ritual Kit",
    slug: "hair-repair-ritual-kit",
    copy: "Wash, condition, mask, and oil — strength and softness in one cupboard.",
    image: "/products/hair-repair-ritual-kit.png",
  },
  {
    name: "Barrier Repair Kit",
    slug: "barrier-repair-kit",
    copy: "Gentle cleanse, hyaluronic hydration, ceramide seal for comfort.",
    image: "/products/barrier-repair-kit.png",
  },
  {
    name: "Everyday Body Ritual Kit",
    slug: "everyday-body-ritual-kit",
    copy: "Wash, polish, and moisturize — soft skin from shower to evening.",
    image: "/products/everyday-body-ritual-kit.png",
  },
];

export function RitualKits() {
  const [featured, ...rest] = kits;
  const featuredSize = productImageSize(featured.slug);

  return (
    <Section tone="stone">
      <div className="reveal">
        <SectionHeader
          eyebrow="Complete sets"
          title="Rituals, considered together."
          description="Thoughtfully paired essentials for simple, intentional routines."
          action={
            <QuietLink href="/shop?category=ritual-kits">
              Shop ritual kits
            </QuietLink>
          }
        />

        <div className="mt-14 grid items-start gap-10 lg:mt-16 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <Link
            href={`/shop/${featured.slug}`}
            className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <StoreImage
              src={featured.image}
              alt={featured.name}
              width={featuredSize.width}
              height={featuredSize.height}
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="h-auto w-full object-contain object-center"
            />
            <p className="eyebrow mt-6">Featured</p>
            <h3 className="type-h3 mt-3">{featured.name}</h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              {featured.copy}
            </p>
          </Link>

          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {rest.map((kit) => (
              <li key={kit.slug}>
                <Link
                  href={`/shop/${kit.slug}`}
                  className="group grid grid-cols-[5.5rem_1fr] items-center gap-6 py-7 outline-none focus-visible:ring-2 focus-visible:ring-ring/35 sm:grid-cols-[6.5rem_1fr] sm:py-8"
                >
                  <div className="w-[5.5rem] sm:w-[6.5rem]">
                    <ProductThumb slug={kit.slug} alt="" />
                  </div>
                  <div>
                    <h3 className="type-h4">{kit.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {kit.copy}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
