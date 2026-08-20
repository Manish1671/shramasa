import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-stone">
      {/* Native img so Next does not recompress or resample the hero. */}
      <img
        src="/hero-shramasa.jpg"
        alt="Shramasa face, hair, and body care arranged on stone with botanical light"
        className="hero-image-enter absolute inset-0 h-full w-full object-cover object-[center_34%]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[color-mix(in_srgb,#19352A_36%,transparent)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[80rem] px-6 pt-36 pb-28 sm:px-8 lg:px-10">
        <div className="reveal max-w-xl text-primary-foreground lg:max-w-[32rem]">
          <p className="text-[0.64rem] font-medium tracking-[0.16em] text-primary-foreground/75 uppercase">
            Since the first ritual
          </p>

          <h1 className="type-display mt-6 text-balance">
            Quiet luxury
            <br />
            for skin and hair.
          </h1>

          <p className="mt-6 max-w-md text-[0.95rem] leading-[1.85] text-primary-foreground/82 sm:text-base">
            Formulas composed with intention — for luminous skin, nourished
            hair, and rituals that feel as considered as they look.
          </p>

          <div className="mt-10">
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 bg-primary-foreground px-9 text-[0.68rem] tracking-[0.16em] text-primary uppercase hover:bg-primary-foreground/90",
              )}
            >
              Shop the collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
