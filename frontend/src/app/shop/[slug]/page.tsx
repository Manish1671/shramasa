import Link from "next/link";
import { ChevronDown, Minus, Plus, Star } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const productDetails = [
  {
    title: "Description",
    content:
      "A refined daily serum designed to support brighter, smoother, and more balanced-looking skin.",
  },
  {
    title: "Ingredients",
    content:
      "A thoughtfully selected blend of hydrating, soothing, and antioxidant-rich ingredients.",
  },
  {
    title: "How to Use",
    content:
      "Apply a few drops to clean, dry skin morning or evening, then follow with moisturizer.",
  },
  {
    title: "Shipping & Returns",
    content:
      "Orders ship across India. Eligible unopened products may be returned according to our returns policy.",
  },
];

const recommendations = [
  {
    name: "Daily Defense Sunscreen",
    description: "Lightweight daily protection with a comfortable finish.",
    price: "₹749",
    rating: "4.8",
  },
  {
    name: "Hydrating Moisturizer",
    description: "Replenishes lasting moisture without feeling heavy.",
    price: "₹799",
    rating: "4.7",
  },
  {
    name: "Gentle Cleansing Gel",
    description: "Cleanses while respecting the natural skin barrier.",
    price: "₹549",
    rating: "4.8",
  },
  {
    name: "Nourishing Body Lotion",
    description: "Comforts dry skin with lightweight hydration.",
    price: "₹599",
    rating: "4.6",
  },
];

export default function ProductDetailsPage() {
  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div
              role="img"
              aria-label="Radiance Renewal Serum image placeholder"
              className="flex aspect-square items-center justify-center rounded-3xl bg-muted text-sm font-medium text-muted-foreground"
            >
              Product Image
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  role="img"
                  aria-label={`Product thumbnail ${index + 1} placeholder`}
                  className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted/60 text-xs text-muted-foreground"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:py-8">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Shramasa Skincare
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Radiance Renewal Serum
            </h1>

            <div className="mt-5 flex items-center gap-2">
              <div
                className="flex items-center gap-1"
                aria-label="4.9 out of 5 stars"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className="size-4 fill-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                4.9 · 128 reviews
              </span>
            </div>

            <p className="mt-6 text-2xl font-semibold">₹899</p>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              An elevated daily serum crafted to reveal a luminous,
              healthy-looking complexion while delivering weightless hydration
              and comfort.
            </p>

            <div className="mt-10">
              <p className="text-sm font-medium">Quantity</p>
              <div className="mt-3 inline-flex items-center rounded-lg border border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Decrease quantity"
                >
                  <Minus />
                </Button>
                <span className="w-10 text-center text-sm" aria-label="Quantity">
                  1
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Increase quantity"
                >
                  <Plus />
                </Button>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/cart"
                className={buttonVariants({ size: "lg", className: "w-full" })}
              >
                Add to Cart
              </Link>
              <Button type="button" variant="outline" size="lg">
                Buy Now
              </Button>
            </div>

            <div className="mt-12 border-t border-border">
              {productDetails.map((detail) => (
                <details key={detail.title} className="border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-semibold">
                    {detail.title}
                    <ChevronDown className="size-4" aria-hidden="true" />
                  </summary>
                  <p className="pb-5 pr-8 text-sm leading-6 text-muted-foreground">
                    {detail.content}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <section className="pt-24 sm:pt-28" aria-labelledby="recommendations">
          <h2
            id="recommendations"
            className="text-3xl font-semibold tracking-tight"
          >
            You May Also Like
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((product) => (
              <Card key={product.name} className="h-full">
                <div
                  role="img"
                  aria-label={`${product.name} image placeholder`}
                  className="mx-4 flex aspect-4/5 items-center justify-center rounded-xl bg-muted text-xs font-medium text-muted-foreground"
                >
                  Product Image
                </div>

                <CardHeader>
                  <h3 className="text-base font-semibold">{product.name}</h3>
                  <CardDescription className="leading-6">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto flex items-center justify-between">
                  <span className="font-semibold">{product.price}</span>
                  <span
                    className="flex items-center gap-1 text-sm"
                    aria-label={`${product.rating} out of 5 stars`}
                  >
                    <Star
                      className="size-4 fill-current"
                      aria-hidden="true"
                    />
                    {product.rating}
                  </span>
                </CardContent>

                <CardFooter>
                  <Link
                    href="/cart"
                    className={buttonVariants({ className: "w-full" })}
                  >
                    Add to Cart
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
