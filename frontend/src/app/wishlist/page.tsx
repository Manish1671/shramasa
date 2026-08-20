import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";

import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { ProductPhotoFrame } from "@/components/commerce/ProductPhotoFrame";
import { WishlistToggleButton } from "@/components/commerce/WishlistToggleButton";
import { buttonVariants } from "@/components/ui/button";
import { ApiError, apiFetch, getAccessToken } from "@/lib/api";
import { formatInr } from "@/lib/format";
import { productImagePath } from "@/lib/product-image";
import type { Wishlist } from "@/lib/types";
import { cn } from "@/lib/utils";

export default async function WishlistPage() {
  const token = await getAccessToken();

  if (!token) {
    redirect("/login?next=/wishlist");
  }

  let wishlist: Wishlist | null = null;
  let errorMessage: string | null = null;

  try {
    wishlist = await apiFetch<Wishlist>("/wishlist");
  } catch (error) {
    errorMessage =
      error instanceof ApiError
        ? error.message
        : "Unable to load your wishlist.";
  }

  if (errorMessage || !wishlist) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-md text-center">
          <h1 className="type-h3">Wishlist unavailable</h1>
          <p className="type-body mt-4">
            {errorMessage ?? "Unable to load your wishlist."}
          </p>
        </div>
      </main>
    );
  }

  if (wishlist.items.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex size-16 items-center justify-center border border-border bg-secondary">
            <Heart
              className="size-6 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <p className="eyebrow mt-8">Wishlist</p>
          <h1 className="type-h3 mt-3">Your wishlist is empty</h1>
          <p className="type-body mt-4">
            Save the rituals you love and return to them anytime.
          </p>
          <Link
            href="/shop"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-9 h-12 px-9 text-[0.68rem] tracking-[0.18em] uppercase",
            )}
          >
            Explore the shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[80rem]">
        <div className="border-b border-border pb-12">
          <p className="eyebrow">Saved</p>
          <h1 className="type-h2 mt-4">Wishlist</h1>
          <p className="type-body mt-5">
            {wishlist.itemCount} saved{" "}
            {wishlist.itemCount === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.items.map((item) => (
            <article key={item.id} className="group relative flex h-full flex-col">
              <Link
                href={`/shop/${item.product.slug}`}
                className="absolute inset-0 z-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`View ${item.product.name}`}
              />

              <ProductPhotoFrame
                src={productImagePath(item.product.slug)}
                alt={item.product.images[0]?.altText ?? item.product.name}
                slug={item.product.slug}
              >
                <div className="absolute top-2 right-2 z-10">
                  <WishlistToggleButton
                    productId={item.productId}
                    initialSaved
                    className="size-8 rounded-full bg-background/45 text-foreground/80 shadow-none hover:bg-background/70 hover:text-foreground"
                  />
                </div>
              </ProductPhotoFrame>

              <div className="mt-5 flex flex-1 flex-col">
                <h2 className="type-h4 decoration-foreground/30 underline-offset-[6px] group-hover:underline">
                  {item.product.name}
                </h2>
                <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {item.product.description}
                </p>
                <div className="mt-auto flex items-baseline justify-between gap-3 pt-5">
                  <span className="text-[0.82rem] tracking-[0.04em] tabular-nums">
                    {formatInr(item.product.price)}
                  </span>
                  <span className="text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
                    {item.product.stock > 0 ? "In stock" : "Out of stock"}
                  </span>
                </div>
                <div className="relative z-10 mt-5">
                  <AddToCartButton
                    productId={item.productId}
                    disabled={item.product.stock <= 0}
                    className="h-11 text-[0.68rem] tracking-[0.16em] uppercase"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
