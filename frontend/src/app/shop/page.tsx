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
    <main className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[80rem]">
        <Suspense
          fallback={
            <p className="mt-4 text-sm text-muted-foreground">
              Loading products…
            </p>
          }
        >
          <ShopCatalog products={products} wishlistIds={wishlistIds} />
        </Suspense>
      </div>
    </main>
  );
}
