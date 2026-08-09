import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function HeroCopy({ className }: { className?: string }) {
  return (
    <div className={cn("reveal", className)}>
      <p className="text-[0.65rem] font-medium tracking-[0.28em] text-primary uppercase sm:text-[0.68rem]">
        SHRAMASA
      </p>

      <h1 className="mt-3 font-heading text-[1.9rem] leading-[1.1] tracking-tight text-balance text-foreground sm:mt-5 sm:text-[2.75rem] lg:text-[3.15rem] xl:text-[3.35rem]">
        Premium skincare
        <br />
        &amp; haircare rituals
      </h1>

      <p className="mt-3 max-w-md text-[0.875rem] leading-6 text-foreground/75 sm:mt-5 sm:text-[0.95rem] sm:leading-7 lg:text-base lg:leading-8">
        Calm formulas for luminous skin and nourished hair — composed for
        everyday rituals, finished with quiet elegance.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-8 sm:gap-x-6">
        <Link
          href="/shop"
          className={cn(
            buttonVariants({ size: "lg" }),
            "rounded-sm bg-primary px-7 text-primary-foreground transition-colors duration-300 hover:bg-primary/90 sm:px-8",
          )}
        >
          Shop collection
        </Link>
        <Link
          href="/shop?category=ritual-kits"
          className="group inline-flex items-center gap-2 text-sm tracking-wide text-foreground/85 transition-colors duration-300 hover:text-primary"
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

      <ul className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-2 border-t border-foreground/10 pt-5 text-[0.62rem] tracking-[0.12em] text-foreground/55 uppercase sm:mt-8 sm:gap-x-3 sm:pt-6 sm:text-[0.68rem] sm:tracking-[0.14em]">
        <li>Thoughtful ingredients</li>
        <li aria-hidden="true" className="select-none text-primary/35">
          •
        </li>
        <li>Everyday rituals</li>
        <li aria-hidden="true" className="select-none text-primary/35">
          •
        </li>
        <li>Considered care</li>
      </ul>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/45 bg-[oklch(0.955_0.012_92)]">
      {/*
        Single HeroCopy tree: in normal flow above the image on small screens;
        absolutely overlaid on the image from lg up. Avoids duplicate h1/DOM.
      */}
      <div className="relative">
        <div className="px-6 pb-6 pt-10 sm:px-8 lg:absolute lg:inset-0 lg:z-10 lg:flex lg:items-center lg:px-8 lg:pb-0 lg:pt-0 xl:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <HeroCopy className="max-w-md lg:max-w-[26rem] xl:max-w-[28rem]" />
          </div>
        </div>

        <div className="relative aspect-[3/2] w-full">
          <div className="absolute inset-0 hero-image-enter">
            <Image
              src="/hero-shramasa.jpg"
              alt="Shramasa skincare and haircare products arranged on stone with soft botanical light"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(100deg,oklch(0.955_0.012_92_/_0.5)_0%,oklch(0.955_0.012_92_/_0.18)_30%,oklch(0.955_0.012_92_/_0.04)_50%,transparent_64%)] lg:block"
          />
        </div>
      </div>
    </section>
  );
}
