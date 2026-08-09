"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ProductCard } from "@/components/commerce/ProductCard";
import {
  getConcernBySlug,
  getProductSlugsForConcern,
} from "@/lib/concerns";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type ShopCatalogProps = {
  products: Product[];
  wishlistIds: string[];
};

/**
 * Shop filters are driven by the URL:
 * - /shop?concern=…
 * - /shop?category=…
 * Concern and category are mutually exclusive — never both.
 */
export function ShopCatalog({ products, wishlistIds }: ShopCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const concernParam = searchParams.get("concern")?.trim() ?? "";
  const categoryParam = searchParams.get("category")?.trim() ?? "";

  // If a stale URL has both, concern wins for display/filtering.
  const concern = concernParam;
  const category = concern ? "" : categoryParam;

  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState<"all" | "in" | "out">("all");
  const [sort, setSort] = useState("newest");

  // Normalize illegal combined query strings.
  useEffect(() => {
    if (concernParam && categoryParam) {
      router.replace(`/shop?concern=${encodeURIComponent(concernParam)}`);
    }
  }, [concernParam, categoryParam, router]);

  const activeConcern = useMemo(
    () => getConcernBySlug(concern),
    [concern],
  );

  const concernSlugs = useMemo(
    () => getProductSlugsForConcern(concern),
    [concern],
  );

  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category.slug))].map(
        (slug) => {
          const match = products.find(
            (product) => product.category.slug === slug,
          );
          return {
            slug,
            name: match?.category.name ?? slug,
          };
        },
      ),
    [products],
  );

  const filtered = useMemo(() => {
    let next = [...products];

    // Concern OR category — never intersect the two.
    if (concernSlugs) {
      const allowed = new Set(concernSlugs);
      next = next.filter((product) => allowed.has(product.slug));
    } else if (category) {
      next = next.filter((product) => product.category.slug === category);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      next = next.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      );
    }

    if (availability === "in") {
      next = next.filter((product) => product.stock > 0);
    }
    if (availability === "out") {
      next = next.filter((product) => product.stock <= 0);
    }

    next.sort((a, b) => {
      if (sort === "price-low") {
        return Number(a.price) - Number(b.price);
      }
      if (sort === "price-high") {
        return Number(b.price) - Number(a.price);
      }
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return next;
  }, [products, search, category, availability, sort, concernSlugs]);

  const wishlistSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);

  function replaceShopQuery(next: {
    concern?: string;
    category?: string;
  }) {
    const params = new URLSearchParams();
    if (next.concern) {
      params.set("concern", next.concern);
    } else if (next.category) {
      params.set("category", next.category);
    }
    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop");
  }

  function selectCategory(nextCategory: string) {
    // Selecting a category (or All) always clears concern.
    replaceShopQuery({
      category: nextCategory || undefined,
    });
  }

  function clearConcern() {
    replaceShopQuery({});
  }

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[14.5rem_1fr] xl:gap-16">
      <aside
        className="h-fit border border-border/60 bg-card/50 p-6 lg:sticky lg:top-28"
        aria-label="Product filters"
      >
        <div>
          <label
            htmlFor="shop-search"
            className="text-xs font-medium tracking-[0.18em] uppercase"
          >
            Search
          </label>
          <input
            id="shop-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find a ritual…"
            className="mt-3 h-10 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <fieldset className="mt-9">
          <legend className="text-xs font-medium tracking-[0.18em] uppercase">
            Categories
          </legend>
          <div className="mt-4 flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => selectCategory("")}
              className={cn(
                "rounded-sm px-3 py-2.5 text-left text-sm transition-colors",
                category === ""
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              All
            </button>
            {categories.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => selectCategory(item.slug)}
                className={cn(
                  "rounded-sm px-3 py-2.5 text-left text-sm transition-colors",
                  category === item.slug
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-9 border-t border-border/60 pt-8">
          <legend className="text-xs font-medium tracking-[0.18em] uppercase">
            Availability
          </legend>
          <div className="mt-4 space-y-2.5">
            {(
              [
                ["all", "All"],
                ["in", "In Stock"],
                ["out", "Out of Stock"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <input
                  type="radio"
                  name="availability"
                  checked={availability === value}
                  onChange={() => setAvailability(value)}
                  className="size-4 accent-[oklch(0.34_0.045_152)]"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </aside>

      <section aria-label="Products">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-6">
          <div>
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Shop
            </p>
            {activeConcern ? (
              <>
                <h2 className="mt-2 font-heading text-3xl tracking-tight sm:text-4xl">
                  {activeConcern.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "product" : "products"}
                </p>
                <button
                  type="button"
                  onClick={clearConcern}
                  className="mt-4 text-sm text-primary underline-offset-4 transition-colors hover:underline"
                >
                  Clear concern
                </button>
              </>
            ) : (
              <p className="mt-1 font-heading text-3xl tracking-tight">
                {filtered.length}{" "}
                {filtered.length === 1 ? "product" : "products"}
              </p>
            )}
          </div>
          <label className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-9 rounded-sm border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="price-low">Price Low to High</option>
              <option value="price-high">Price High to Low</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-dashed border-border px-6 py-24 text-center">
            <h2 className="font-heading text-2xl">No products found</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Try another search or clear your filters.
            </p>
            {activeConcern ? (
              <button
                type="button"
                onClick={clearConcern}
                className="mt-6 text-sm text-primary underline-offset-4 hover:underline"
              >
                Clear concern
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wishlisted={wishlistSet.has(product.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
