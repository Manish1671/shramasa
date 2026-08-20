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

const CATEGORY_COPY: Record<string, { title: string; description: string }> = {
  "face-care": {
    title: "Face Care",
    description: "Rituals for a calmer, clearer complexion.",
  },
  "hair-care": {
    title: "Hair Care",
    description: "Botanical care for strength, softness, and shine.",
  },
  "body-care": {
    title: "Body Care",
    description: "Daily comfort from shower to evening.",
  },
  "ritual-kits": {
    title: "Rituals",
    description: "Complete, considered sets for simple routines.",
  },
  "lip-fragrance": {
    title: "Lip & Fragrance",
    description: "Small luxuries for lips and scent.",
  },
};

function filterClass(active: boolean) {
  return cn(
    "relative py-2.5 text-left text-sm transition-colors duration-300",
    active
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground",
  );
}

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
  const queryParam = searchParams.get("q")?.trim() ?? "";

  // If a stale URL has both, concern wins for display/filtering.
  const concern = concernParam;
  const category = concern ? "" : categoryParam;

  const [search, setSearch] = useState(queryParam);
  const [availability, setAvailability] = useState<"all" | "in" | "out">("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setSearch(queryParam);
  }, [queryParam]);

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

  const collectionCopy = category ? CATEGORY_COPY[category] : undefined;

  return (
    <div>
      <header className="max-w-2xl pb-12 sm:pb-16">
        {activeConcern ? (
          <>
            <p className="eyebrow">Concern</p>
            <h1 className="type-h2 mt-4">{activeConcern.name}</h1>
            <p className="type-body mt-5">{activeConcern.description}</p>
            <button
              type="button"
              onClick={clearConcern}
              className="mt-6 text-sm underline decoration-foreground/30 underline-offset-4 transition-opacity duration-300 hover:opacity-70"
            >
              View all products
            </button>
          </>
        ) : collectionCopy ? (
          <>
            <p className="eyebrow">Collection</p>
            <h1 className="type-h2 mt-4">{collectionCopy.title}</h1>
            <p className="type-body mt-5">{collectionCopy.description}</p>
          </>
        ) : (
          <>
            <p className="eyebrow">Collection</p>
            <h1 className="type-h2 mt-4">
              {search.trim() ? "Search" : "The Collection"}
            </h1>
            <p className="type-body mt-5">
              {search.trim()
                ? `${filtered.length} ${filtered.length === 1 ? "result" : "results"} for “${search.trim()}”`
                : "Thoughtful skincare, haircare, and body essentials — edited for calm rituals."}
            </p>
          </>
        )}
      </header>

      <div className="grid gap-10 border-t border-border pt-10 lg:grid-cols-[13rem_1fr] lg:gap-16 lg:pt-12">
      <aside
        className="h-fit lg:sticky lg:top-28"
        aria-label="Product filters"
      >
        <div>
          <label htmlFor="shop-search" className="eyebrow">
            Search
          </label>
          <input
            id="shop-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find a ritual…"
            className="mt-3 h-10 w-full border-b border-border bg-transparent text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-foreground"
          />
        </div>

        <fieldset className="mt-10">
          <legend className="eyebrow">Categories</legend>
          <div className="mt-4 flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => selectCategory("")}
              className={filterClass(category === "" && !concern)}
            >
              All
              {category === "" && !concern ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1 h-px w-8 bg-foreground/60"
                />
              ) : null}
            </button>
            {categories.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => selectCategory(item.slug)}
                className={filterClass(category === item.slug)}
              >
                {item.name}
                {category === item.slug ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-1 h-px w-8 bg-foreground/60"
                  />
                ) : null}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-10 border-t border-border pt-8">
          <legend className="eyebrow">Availability</legend>
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
                  className="size-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </aside>

      <section aria-label="Products">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {filtered.length}{" "}
            {filtered.length === 1 ? "product" : "products"}
          </p>
          <label className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-9 border border-border bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-foreground"
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
            <h2 className="type-h3">No products found</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Try another search or clear your filters.
            </p>
            {activeConcern ? (
              <button
                type="button"
                onClick={clearConcern}
                className="mt-6 text-sm underline decoration-foreground/30 underline-offset-4 transition-opacity duration-300 hover:opacity-70"
              >
                Clear concern
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
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
    </div>
  );
}
