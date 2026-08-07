import Link from "next/link";
import { Star } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const filterGroups = [
  {
    name: "Categories",
    options: ["Face Care", "Hair Care", "Body Care", "Hair Growth"],
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

const products = [
  {
    name: "Radiance Face Serum",
    slug: "radiance-face-serum",
    description: "Brightens and supports an even-looking complexion.",
    price: "₹899",
    rating: "4.9",
  },
  {
    name: "Daily Defense Sunscreen",
    slug: "daily-defense-sunscreen",
    description: "Lightweight daily protection with a comfortable finish.",
    price: "₹749",
    rating: "4.8",
  },
  {
    name: "Strengthening Hair Oil",
    slug: "strengthening-hair-oil",
    description: "Nourishes the scalp and helps reduce visible breakage.",
    price: "₹649",
    rating: "4.9",
  },
  {
    name: "Hydrating Moisturizer",
    slug: "hydrating-moisturizer",
    description: "Replenishes lasting moisture without feeling heavy.",
    price: "₹799",
    rating: "4.7",
  },
  {
    name: "Gentle Cleansing Gel",
    slug: "gentle-cleansing-gel",
    description: "Lifts away impurities while respecting the skin barrier.",
    price: "₹549",
    rating: "4.8",
  },
  {
    name: "Repair Hair Mask",
    slug: "repair-hair-mask",
    description: "Deeply conditions dry lengths for softer-looking hair.",
    price: "₹949",
    rating: "4.7",
  },
  {
    name: "Nourishing Body Lotion",
    slug: "nourishing-body-lotion",
    description: "Comforts dry skin with lightweight, lasting hydration.",
    price: "₹599",
    rating: "4.6",
  },
  {
    name: "Scalp Renewal Serum",
    slug: "scalp-renewal-serum",
    description: "Refreshes the scalp and supports healthier-looking roots.",
    price: "₹999",
    rating: "4.8",
  },
];

export default function ShopPage() {
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <Card key={product.slug} className="relative h-full">
                  <Link
                    href={`/shop/${product.slug}`}
                    aria-label={`View ${product.name}`}
                    className="absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                    <div
                      role="img"
                      aria-label={`${product.name} image placeholder`}
                      className="mx-4 flex aspect-4/5 items-center justify-center rounded-xl bg-muted text-xs font-medium text-muted-foreground"
                    >
                      Product Image
                    </div>

                    <CardHeader>
                      <h2 className="text-base font-semibold">{product.name}</h2>
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

                    <CardFooter className="relative z-10">
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
      </div>
    </main>
  );
}
