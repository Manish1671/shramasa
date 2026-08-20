"use client";

import { ProductThumb } from "@/components/commerce/ProductThumb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState, useTransition } from "react";

import {
  clearCartAction,
  removeCartItemAction,
  updateCartItemAction,
} from "@/app/commerce/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatInr } from "@/lib/format";
import type { Cart } from "@/lib/types";

type CartViewProps = {
  initialCart: Cart;
};

export function CartView({ initialCart }: CartViewProps) {
  const router = useRouter();
  const [cart, setCart] = useState(initialCart);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<{ ok: boolean; error: string | null; data: Cart | null }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok || !result.data) {
        setError(result.error);
        return;
      }
      setCart(result.data);
      router.refresh();
    });
  }

  if (cart.items.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex size-16 items-center justify-center border border-border bg-card">
            <ShoppingBag
              className="size-9 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <h1 className="type-h3 mt-8">
            Your cart is empty
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Discover thoughtful skincare and haircare essentials made for your
            everyday rituals.
          </p>
          <Link
            href="/shop"
            className={buttonVariants({ size: "lg", className: "mt-8" })}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="type-h2">
              Shopping Cart
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              Review your selected essentials before checkout.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={() => run(() => clearCartAction())}
          >
            Clear cart
          </Button>
        </div>

        {error ? (
          <p className="mt-6 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <section aria-labelledby="cart-items-heading">
            <div className="flex items-center justify-between">
              <h2 id="cart-items-heading" className="text-xl font-semibold">
                Cart Items
              </h2>
              <span className="text-sm text-muted-foreground">
                {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="mt-6 border-y border-border">
              {cart.items.map((item, index) => {
                const imageAlt =
                  item.product.images[0]?.altText ?? item.product.name;

                return (
                  <div key={item.id}>
                    <article className="grid gap-5 py-6 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
                      <Link href={`/shop/${item.product.slug}`} className="w-28">
                        <ProductThumb
                          slug={item.product.slug}
                          alt={imageAlt}
                          sizes="112px"
                          className="w-28"
                        />
                      </Link>

                      <div>
                        <Link href={`/shop/${item.product.slug}`}>
                          <h3 className="type-h4 decoration-foreground/30 underline-offset-[6px] hover:underline">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {item.product.description}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-4 px-0 text-muted-foreground"
                          disabled={pending}
                          onClick={() =>
                            run(() => removeCartItemAction(item.productId))
                          }
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                        <p className="font-semibold">
                          {formatInr(item.lineTotal)}
                        </p>
                        <div
                          className="inline-flex items-center rounded-lg border border-border"
                          aria-label={`Quantity for ${item.product.name}`}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={pending || item.quantity <= 1}
                            aria-label={`Decrease ${item.product.name} quantity`}
                            onClick={() =>
                              run(() =>
                                updateCartItemAction(
                                  item.productId,
                                  item.quantity - 1,
                                ),
                              )
                            }
                          >
                            <Minus aria-hidden="true" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={
                              pending || item.quantity >= item.product.stock
                            }
                            aria-label={`Increase ${item.product.name} quantity`}
                            onClick={() =>
                              run(() =>
                                updateCartItemAction(
                                  item.productId,
                                  item.quantity + 1,
                                ),
                              )
                            }
                          >
                            <Plus aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                    </article>
                    {index < cart.items.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="lg:sticky lg:top-24" aria-label="Order summary">
            <Card>
              <CardHeader>
                <h2 className="type-h4">Order Summary</h2>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatInr(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {Number(cart.shipping) === 0
                      ? "Free"
                      : formatInr(cart.shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-semibold">
                    {formatInr(cart.total)}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-3">
                <Link
                  href="/checkout"
                  className={buttonVariants({
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/shop"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  Continue Shopping
                </Link>
              </CardFooter>
            </Card>

            <div className="mt-6 space-y-3 px-2 text-sm text-muted-foreground">
              {["Secure checkout", "Ships across India", "Easy returns"].map(
                (item) => (
                  <p key={item} className="flex items-center gap-2">
                    <Check className="size-4" aria-hidden="true" />
                    {item}
                  </p>
                ),
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
