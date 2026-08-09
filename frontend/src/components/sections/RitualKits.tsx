import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const kits = [
  {
    name: "Glow Ritual Kit",
    slug: "glow-ritual-kit",
    copy: "Vitamin C Serum, Hydrating Gel Cream, and SPF 50 — a daytime radiance set.",
    image: "/products/glow-ritual-kit.png",
    featured: true,
  },
  {
    name: "Hair Repair Ritual Kit",
    slug: "hair-repair-ritual-kit",
    copy: "Wash, condition, mask, and oil — strength and softness in one cupboard.",
    image: "/products/hair-repair-ritual-kit.png",
    featured: false,
  },
  {
    name: "Barrier Repair Kit",
    slug: "barrier-repair-kit",
    copy: "Gentle cleanse, hyaluronic hydration, ceramide seal for comfort.",
    image: "/products/barrier-repair-kit.png",
    featured: false,
  },
  {
    name: "Everyday Body Ritual Kit",
    slug: "everyday-body-ritual-kit",
    copy: "Wash, polish, and moisturize — soft skin from shower to evening.",
    image: "/products/everyday-body-ritual-kit.png",
    featured: false,
  },
];

export function RitualKits() {
  const [featured, ...rest] = kits;

  return (
    <section className="border-y border-border/60 bg-primary text-primary-foreground">
      <div className="reveal mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Curated rituals, considered together.
            </h2>
            <p className="mt-3 text-sm leading-7 text-primary-foreground/75 sm:text-base">
              Thoughtfully paired essentials for simple, intentional routines.
            </p>
          </div>
          <Link
            href="/shop?category=ritual-kits"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "rounded-sm transition-opacity duration-300 hover:opacity-90",
            )}
          >
            Shop ritual kits →
          </Link>
        </div>

        <div className="mt-10 grid items-stretch gap-4 sm:mt-12 lg:grid-cols-[1.35fr_1fr] lg:gap-5">
          <Link
            href={`/shop/${featured.slug}`}
            className="group relative min-h-[24rem] overflow-hidden rounded-sm bg-primary-foreground/8 ring-1 ring-primary-foreground/15 transition-[background-color] duration-300 hover:bg-primary-foreground/10 sm:min-h-[28rem] lg:min-h-full"
          >
            <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12 lg:p-14">
              <div className="relative h-full w-full max-w-sm">
                <Image
                  src={featured.image}
                  alt={featured.name}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-contain transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none"
                />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/95 via-primary/70 to-transparent p-7 sm:p-9">
              <p className="text-[0.65rem] tracking-[0.2em] uppercase opacity-70">
                Featured
              </p>
              <h3 className="mt-2 font-heading text-2xl sm:text-3xl">
                {featured.name}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-primary-foreground/80">
                {featured.copy}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.68rem] tracking-[0.16em] uppercase">
                View ritual
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
                >
                  →
                </span>
              </span>
            </div>
          </Link>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
            {rest.map((kit) => (
              <Link
                key={kit.slug}
                href={`/shop/${kit.slug}`}
                className="group grid grid-cols-[4.75rem_1fr] items-center gap-4 rounded-sm bg-primary-foreground/8 p-3.5 ring-1 ring-primary-foreground/12 transition-colors duration-300 hover:bg-primary-foreground/12 sm:grid-cols-1 sm:p-4 lg:grid-cols-[5rem_1fr]"
              >
                <div className="relative aspect-square overflow-hidden rounded-sm bg-primary-foreground/10">
                  <Image
                    src={kit.image}
                    alt={kit.name}
                    fill
                    unoptimized
                    sizes="120px"
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-lg leading-snug sm:text-xl">
                    {kit.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-primary-foreground/75">
                    {kit.copy}
                  </p>
                  <span className="mt-2.5 inline-flex text-[0.65rem] tracking-[0.14em] text-primary-foreground/80 uppercase">
                    View ritual →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
