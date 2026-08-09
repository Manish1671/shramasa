import Link from "next/link";

import { ProductCard } from "@/components/commerce/ProductCard";
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
      preferred.length >= 4
        ? preferred.slice(0, 4)
        : active.slice(0, 4);
  } catch {
    products = [];
  }

  return (
    <section className="border-b border-border/45 bg-[oklch(0.97_0.01_92)] px-6 py-16 sm:py-20 lg:py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Bestsellers
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
              Everyday essentials, thoughtfully chosen.
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm tracking-wide text-foreground/80 transition-colors duration-300 hover:text-primary"
          >
            Shop all
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
            >
              →
            </span>
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="mt-12 text-sm text-muted-foreground">
            Bestsellers will appear here once products are available.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-x-7 gap-y-10 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
