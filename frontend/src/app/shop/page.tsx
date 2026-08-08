import Link from "next/link";

import { ProductCard } from "@/components/commerce/ProductCard";
import { apiFetch, getAccessToken } from "@/lib/api";
import type { Product, Wishlist } from "@/lib/types";

async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/products", {}, { auth: false });
}

async function getWishlistProductIds(): Promise<Set<string>> {
  const token = await getAccessToken();
  if (!token) {
    return new Set();
  }

  try {
    const wishlist = await apiFetch<Wishlist>("/wishlist");
    return new Set(wishlist.items.map((item) => item.productId));
  } catch {
    return new Set();
  }
}

export default async function ShopPage() {
  const [allProducts, wishlistIds] = await Promise.all([
    getProducts(),
    getWishlistProductIds(),
  ]);
  const products = allProducts.filter((product) => product.isActive);
  const categoryOptions = [
    ...new Set(products.map((product) => product.category.name)),
  ];
  const filterGroups = [
    {
      name: "Categories",
      options: categoryOptions,
    },
    {
      name: "Price",
      options: ["Under ₹500", "₹500 – ₹999", "₹1,000 and above"],
    },
    {
      name: "Availability",
      options: ["In Stock", "Out of Stock"],
    },
  ];

  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Shop Collection
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Explore thoughtful skincare, haircare, and body care essentials for
            your daily ritual.
          </p>
        </div>

        <div className="mt-12 flex items-center justify-between border-y border-border py-4">
          <p className="text-sm text-muted-foreground">
            {products.length} products
          </p>
          <label className="flex items-center gap-3 text-sm font-medium">
            <span>Sort by</span>
            <select
              defaultValue="popular"
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price Low to High</option>
              <option value="price-high">Price High to Low</option>
            </select>
          </label>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[14rem_1fr] xl:gap-14">
          <aside className="hidden lg:block" aria-label="Product filters">
            <form className="space-y-8">
              {filterGroups.map((group) => (
                <fieldset key={group.name}>
                  <legend className="text-sm font-semibold">{group.name}</legend>
                  <div className="mt-4 space-y-3">
                    {group.options.map((option) => {
                      const id = `${group.name}-${option}`
                        .toLowerCase()
                        .replaceAll(" ", "-")
                        .replaceAll("₹", "inr")
                        .replaceAll("–", "to")
                        .replaceAll(",", "");

                      return (
                        <label
                          key={option}
                          htmlFor={id}
                          className="flex items-center gap-3 text-sm text-muted-foreground"
                        >
                          <input
                            id={id}
                            name={group.name}
                            type="checkbox"
                            className="size-4 rounded border-border accent-foreground"
                          />
                          {option}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </form>
          </aside>

          <section aria-label="Products">
            {products.length === 0 ? (
              <div className="rounded-2xl border border-border px-6 py-16 text-center">
                <h2 className="text-xl font-semibold">No products found</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Check back soon for new arrivals.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
                >
                  Return home
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wishlisted={wishlistIds.has(product.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
