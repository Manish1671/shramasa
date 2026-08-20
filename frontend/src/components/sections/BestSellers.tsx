import { ProductCard } from "@/components/commerce/ProductCard";
import { QuietLink } from "@/components/layout/QuietLink";
import { Section, SectionHeader } from "@/components/layout/Section";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/lib/types";

const FEATURED_SLUGS = [
  "vitamin-c-serum",
  "ceramide-moisturizer",
  "spf-50-sunscreen",
  "hair-growth-serum",
  "nourishing-hair-oil",
  "hydrating-body-lotion",
];

export async function BestSellers() {
  let products: Product[] = [];

  try {
    const all = await apiFetch<Product[]>("/products", {}, { auth: false });
    const active = all.filter((product) => product.isActive);
    const preferred = FEATURED_SLUGS.map((slug) =>
      active.find((product) => product.slug === slug),
    ).filter((product): product is Product => Boolean(product));

    products =
      preferred.length >= 4 ? preferred.slice(0, 4) : active.slice(0, 4);
  } catch {
    products = [];
  }

  return (
    <Section id="bestsellers" className="scroll-mt-24">
      <div className="reveal">
        <SectionHeader
          eyebrow="Most requested"
          title="Bestsellers"
          description="Four essentials that begin a considered daily ritual."
          action={<QuietLink href="/shop">Shop all</QuietLink>}
        />

        {products.length === 0 ? (
          <p className="mt-14 text-sm text-muted-foreground">
            Bestsellers will appear here once products are available.
          </p>
        ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showDescription={false}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
