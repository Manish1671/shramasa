import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const features = [
  {
    title: "Face Ritual",
    copy: "Cleanse, brighten, protect — a calm trio for luminous skin.",
    href: "/shop?category=face-care",
    image: "/products/ceramide-moisturizer.png",
    imageSecondary: "/products/vitamin-c-serum.png",
  },
  {
    title: "Hair Ritual",
    copy: "Nourish scalp and lengths with restorative botanical care.",
    href: "/shop?category=hair-care",
    image: "/products/hair-growth-serum.png",
    imageSecondary: "/products/strengthening-shampoo.png",
  },
];

export function FeaturedCollection() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium tracking-[0.22em] text-primary/70 uppercase">
              Featured collections
            </p>
            <h2 className="mt-4 font-heading text-4xl tracking-tight sm:text-5xl">
              Curated for daily elegance
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            Two considered paths through the Shramasa cupboard — edited for
            simplicity, finished for presence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative min-h-96 overflow-hidden rounded-sm bg-muted/70 ring-1 ring-border/70 transition-shadow duration-500 hover:shadow-[0_24px_60px_-36px_oklch(0.3_0.04_150_/0.55)]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,oklch(0.22_0.03_150_/0.55)_100%)]" />
              <div className="absolute inset-0 flex items-center justify-center gap-4 p-10">
                <div className="relative h-56 w-40 -rotate-3 overflow-hidden rounded-sm bg-background/50 shadow-lg transition-transform duration-700 group-hover:-translate-y-2 sm:h-72 sm:w-48">
                  <Image
                    src={feature.image}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-contain p-4"
                  />
                </div>
                <div className="relative mt-10 hidden h-48 w-36 rotate-3 overflow-hidden rounded-sm bg-background/40 shadow-md transition-transform duration-700 group-hover:translate-y-1 sm:block sm:h-60 sm:w-44">
                  <Image
                    src={feature.imageSecondary}
                    alt=""
                    fill
                    sizes="180px"
                    className="object-contain p-4"
                  />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-8 text-primary-foreground">
                <p className="text-xs tracking-[0.2em] uppercase opacity-80">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-heading text-3xl">{feature.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-primary-foreground/85">
                  {feature.copy}
                </p>
                <span
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                    className:
                      "mt-5 rounded-sm bg-background/90 text-foreground",
                  })}
                >
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
