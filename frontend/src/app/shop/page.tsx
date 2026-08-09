import type { Metadata } from "next";
import { Suspense } from "react";

import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { apiFetch, getAccessToken } from "@/lib/api";
import type { Product, Wishlist } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop Shramasa skincare and haircare essentials — serums, cleansers, SPF, oils, and more.",
};

async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/products", {}, { auth: false });
}

async function getWishlistProductIds(): Promise<string[]> {
  const token = await getAccessToken();
  if (!token) {
    return [];
  }

  try {
    const wishlist = await apiFetch<Wishlist>("/wishlist");
    return wishlist.items.map((item) => item.productId);
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const [allProducts, wishlistIds] = await Promise.all([
    getProducts(),
    getWishlistProductIds(),
  ]);
  const products = allProducts.filter((product) => product.isActive);

  return (
    <main className="px-6 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl border-b border-border/70 pb-10">
          <p className="text-xs font-medium tracking-[0.22em] text-primary/70 uppercase">
            Collection
          </p>
          <h1 className="mt-4 font-heading text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Shop Shramasa
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Explore thoughtful skincare, haircare, and body care essentials —
            edited for calm rituals and lasting comfort.
          </p>
        </div>

        <Suspense fallback={<p className="mt-12 text-sm text-muted-foreground">Loading products…</p>}>
          <ShopCatalog products={products} wishlistIds={wishlistIds} />
        </Suspense>
      </div>
    </main>
  );
}
