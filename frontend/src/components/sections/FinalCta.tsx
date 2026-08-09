import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCta() {
  return (
    <section className="px-6 py-14 sm:py-16 lg:py-20">
      <div className="reveal mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-sm border border-border/55 bg-[oklch(0.955_0.012_95)] px-8 py-12 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_80%_50%,oklch(0.92_0.03_145_/0.55)_0%,transparent_70%)]"
          />
          <div className="relative mx-auto max-w-xl text-center">
            <div className="editorial-rule mx-auto" />
            <h2 className="mt-6 font-heading text-3xl tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
              Make space for your ritual.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
              Explore thoughtful skincare, haircare, and body essentials designed
              for everyday care.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/shop"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "rounded-sm bg-primary px-7 text-primary-foreground transition-colors duration-300 hover:bg-primary/90",
                )}
              >
                Shop the collection →
              </Link>
              <Link
                href="/shop?category=ritual-kits"
                className="group inline-flex items-center gap-2 text-sm tracking-wide text-foreground/80 transition-colors duration-300 hover:text-primary"
              >
                Explore rituals
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
