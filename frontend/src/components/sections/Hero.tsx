import { Leaf, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="px-6 py-20 sm:py-28 lg:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm font-medium">
            🌿 Premium Skincare &amp; Haircare
          </span>

          <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
            Healthy Skin.
            <br />
            Beautiful Hair.
            <br />
            Naturally.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Discover science-backed skincare and haircare products crafted with
            carefully selected ingredients for everyday confidence.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              type="button"
              size="lg"
              className="transition-none active:translate-y-0"
            >
              Shop Now
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="transition-none active:translate-y-0"
            >
              Explore Collection
            </Button>
          </div>

          <ul className="mt-10 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="flex items-start gap-2">
              <Leaf className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>Natural Ingredients</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <span>Dermatologically Inspired</span>
            </li>
            <li className="flex items-start gap-2">
              <Truck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>Fast Shipping Across India</span>
            </li>
          </ul>
        </div>

        <div className="flex min-h-96 flex-col items-center justify-between rounded-3xl border border-[#e7ddcc] bg-[#f7f2e8] p-8 text-center sm:min-h-120 sm:p-10">
          <span className="self-start rounded-full border border-[#d9cbb5] bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700">
            Coming Soon
          </span>
          <div
            className="h-64 w-40 rounded-[2rem] border border-[#d4c5ad] bg-[#e5dac8] sm:h-72 sm:w-44"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-neutral-600">
            Premium Lifestyle Photography
          </p>
        </div>
      </div>
    </section>
  );
}
