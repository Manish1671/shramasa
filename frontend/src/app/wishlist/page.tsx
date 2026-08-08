import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";

import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WishlistToggleButton } from "@/components/commerce/WishlistToggleButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ApiError, apiFetch, getAccessToken } from "@/lib/api";
import { formatInr } from "@/lib/format";
import type { Wishlist } from "@/lib/types";

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
          <h1 className="text-3xl font-semibold tracking-tight">
            Wishlist unavailable
          </h1>
          <p className="mt-4 text-muted-foreground">
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
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted">
            <Heart
              className="size-9 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight">
            Your wishlist is empty
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Save the rituals you love and return to them anytime.
          </p>
          <Link
            href="/shop"
            className={buttonVariants({ size: "lg", className: "mt-8" })}
          >
            Explore the shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Wishlist
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          {wishlist.itemCount} saved{" "}
          {wishlist.itemCount === 1 ? "product" : "products"}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.items.map((item) => {
            const image = item.product.images[0];

            return (
              <Card key={item.id} className="relative h-full">
                <Link
                  href={`/shop/${item.product.slug}`}
                  className="absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`View ${item.product.name}`}
                />
                <div className="relative mx-4 aspect-4/5 overflow-hidden rounded-xl bg-muted">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.altText ?? item.product.name}
                      fill
                      sizes="(min-width: 1280px) 20vw, (min-width: 640px) 40vw, 90vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Product Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <WishlistToggleButton
                      productId={item.productId}
                      initialSaved
                    />
                  </div>
                </div>
                <CardHeader>
                  <h2 className="text-base font-semibold">
                    {item.product.name}
                  </h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {item.product.description}
                  </p>
                </CardHeader>
                <CardContent className="mt-auto flex items-center justify-between">
                  <span className="font-semibold">
                    {formatInr(item.product.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.product.stock > 0 ? "In stock" : "Out of stock"}
                  </span>
                </CardContent>
                <CardFooter className="relative z-10">
                  <AddToCartButton
                    productId={item.productId}
                    disabled={item.product.stock <= 0}
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
