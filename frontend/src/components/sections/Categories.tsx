import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Face Care",
    href: "/shop?category=face-care",
    description: "Cleanse, treat, and protect — for a calmer complexion.",
    image: "/products/vitamin-c-serum.png",
  },
  {
    name: "Hair Care",
    href: "/shop?category=hair-care",
    description: "Nourish scalp and lengths with botanical care.",
    image: "/products/nourishing-hair-oil.png",
  },
  {
    name: "Body Care",
    href: "/shop?category=body-care",
    description: "Soft, replenished skin from shower to evening.",
    image: "/products/hydrating-body-lotion.png",
  },
  {
    name: "Ritual Kits",
    href: "/shop?category=ritual-kits",
    description: "Curated sets for complete everyday care.",
    image: "/products/glow-ritual-kit.png",
  },
] as const;

export function Categories() {
  const [face, hair, body, kits] = categories;

  return (
    <section className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl tracking-tight sm:text-4xl lg:text-[2.75rem]">
            Shop by category
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
            Thoughtful essentials for every part of your daily ritual.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-12">
          <CategoryTile
            category={face}
            className="lg:col-span-7"
            imageSide="right"
          />
          <CategoryTile
            category={hair}
            className="lg:col-span-5"
            imageSide="right"
          />
          <CategoryTile
            category={body}
            className="lg:col-span-7"
            imageSide="left"
            compact
          />
          <CategoryTile
            category={kits}
            className="lg:col-span-5"
            imageSide="left"
            compact
          />
        </div>
      </div>
    </section>
  );
}

function CategoryTile({
  category,
  className,
  imageSide = "right",
  compact = false,
}: {
  category: (typeof categories)[number];
  className?: string;
  imageSide?: "left" | "right";
  compact?: boolean;
}) {
  const imageFirst = imageSide === "left";

  return (
    <Link
      href={category.href}
      className={cn(
        "group relative isolate grid overflow-hidden rounded-sm bg-[oklch(0.955_0.01_92)] ring-1 ring-border/45 transition-[transform,box-shadow,background-color] duration-500 hover:-translate-y-0.5 hover:bg-[oklch(0.948_0.012_95)] hover:shadow-[0_18px_40px_-32px_oklch(0.28_0.04_150_/0.45)] motion-reduce:transform-none",
        compact
          ? "min-h-[11.5rem] grid-cols-[1fr_0.9fr] sm:min-h-[12.5rem]"
          : "min-h-[15rem] grid-cols-1 sm:min-h-[17rem] sm:grid-cols-[1.05fr_0.95fr]",
        imageFirst && !compact && "sm:grid-cols-[0.95fr_1.05fr]",
        className,
      )}
    >
      <div
        className={cn(
          "relative z-10 flex flex-col justify-center px-5 py-5 sm:px-7 sm:py-6",
          imageFirst && !compact && "sm:order-2",
          compact && imageFirst && "order-2",
        )}
      >
        <h3
          className={cn(
            "font-heading tracking-tight",
            compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-[1.7rem]",
          )}
        >
          {category.name}
        </h3>
        <p className="mt-2 max-w-[16rem] text-sm leading-6 text-muted-foreground">
          {category.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.68rem] tracking-[0.16em] text-primary uppercase">
          Shop
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
          >
            →
          </span>
        </span>
      </div>

      <div
        className={cn(
          "relative overflow-hidden",
          compact
            ? "min-h-[11.5rem] sm:min-h-full"
            : "min-h-[12rem] sm:min-h-full",
          imageFirst && !compact && "sm:order-1",
          compact && imageFirst && "order-1",
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,oklch(0.93_0.02_145)_0%,oklch(0.955_0.01_92)_72%)]" />
        <Image
          src={category.image}
          alt=""
          fill
          unoptimized
          sizes={
            compact
              ? "(min-width: 1024px) 18vw, 40vw"
              : "(min-width: 1024px) 28vw, 90vw"
          }
          className={cn(
            "object-contain object-center transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none",
            compact ? "p-4 sm:p-5" : "p-5 sm:p-7 lg:p-8",
          )}
        />
      </div>
    </Link>
  );
}
