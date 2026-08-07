import Link from "next/link";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const cartItems = [
  {
    name: "Radiance Renewal Serum",
    description: "Brightening daily serum · 30 ml",
    price: "₹899",
    quantity: 1,
  },
  {
    name: "Daily Defense Sunscreen",
    description: "Lightweight broad-spectrum care · 50 g",
    price: "₹749",
    quantity: 1,
  },
  {
    name: "Strengthening Hair Oil",
    description: "Nourishing scalp and hair treatment · 100 ml",
    price: "₹649",
    quantity: 2,
  },
];

function EmptyCart() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag
            className="size-9 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">
          Your cart is empty
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Discover thoughtful skincare and haircare essentials made for your
          everyday rituals.
        </p>
        <Button type="button" size="lg" className="mt-8">
          Continue Shopping
        </Button>
      </div>
    </main>
  );
}

export default function CartPage() {
  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Shopping Cart
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Review your selected essentials before checkout.
        </p>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <section aria-labelledby="cart-items-heading">
            <div className="flex items-center justify-between">
              <h2 id="cart-items-heading" className="text-xl font-semibold">
                Cart Items
              </h2>
              <span className="text-sm text-muted-foreground">
                {cartItems.length} items
              </span>
            </div>

            <div className="mt-6 border-y border-border">
              {cartItems.map((item, index) => (
                <div key={item.name}>
                  <article className="grid gap-5 py-6 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
                    <div
                      role="img"
                      aria-label={`${item.name} image placeholder`}
                      className="flex aspect-4/5 w-28 items-center justify-center rounded-xl bg-muted text-center text-xs text-muted-foreground"
                    >
                      Product Image
                    </div>

                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-4 px-0 text-muted-foreground"
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                      <p className="font-semibold">{item.price}</p>
                      <div
                        className="inline-flex items-center rounded-lg border border-border"
                        aria-label={`Quantity for ${item.name}`}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus />
                        </Button>
                      </div>
                    </div>
                  </article>
                  {index < cartItems.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </section>

          <aside className="lg:sticky lg:top-24" aria-label="Order summary">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹2,946</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span>−₹200</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-semibold">₹2,746</span>
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-3">
                <Link
                  href="/checkout"
                  className={buttonVariants({ size: "lg", className: "w-full" })}
                >
                  Proceed to Checkout
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-6 space-y-3 px-2 text-sm text-muted-foreground">
              {["Secure Checkout", "Fast Delivery", "Easy Returns"].map(
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
