import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const products = [
  {
    name: "Radiance Face Serum",
    benefit: "Brightens and supports an even-looking complexion.",
    price: "₹899",
    rating: "4.9",
  },
  {
    name: "Daily Defense Sunscreen",
    benefit: "Lightweight daily protection with a comfortable finish.",
    price: "₹749",
    rating: "4.8",
  },
  {
    name: "Strengthening Hair Oil",
    benefit: "Nourishes the scalp and helps reduce visible breakage.",
    price: "₹649",
    rating: "4.9",
  },
  {
    name: "Hydrating Moisturizer",
    benefit: "Replenishes lasting moisture without feeling heavy.",
    price: "₹799",
    rating: "4.7",
  },
];

export function BestSellers() {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold">Best sellers</h2>
        <p className="mt-4 text-base text-muted-foreground">
          Meet the customer favorites at the heart of Shramasa.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.name} className="h-full">
              <div
                role="img"
                aria-label={`${product.name} image placeholder`}
                className="mx-4 flex aspect-4/5 items-center justify-center rounded-xl bg-muted text-xs font-medium text-muted-foreground"
              >
                Product Image
              </div>

              <CardHeader>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <CardDescription className="leading-6">
                  {product.benefit}
                </CardDescription>
              </CardHeader>

              <CardContent className="mt-auto flex items-center justify-between">
                <span className="text-base font-semibold">{product.price}</span>
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
                <Button type="button" className="w-full">
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
