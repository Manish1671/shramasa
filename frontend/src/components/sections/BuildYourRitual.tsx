import Image from "next/image";
import Link from "next/link";

const rituals = [
  {
    title: "Hydration",
    copy: "Plump, comfort, and lasting softness for thirsty skin.",
    href: "/shop?category=ritual-kits",
    image: "/products/hyaluronic-hydration-serum.png",
    accent: "01",
  },
  {
    title: "Glow",
    copy: "Brighten and protect with a simple daytime radiance path.",
    href: "/shop/glow-ritual-kit",
    image: "/products/vitamin-c-serum.png",
    accent: "02",
  },
  {
    title: "Barrier Care",
    copy: "Gentle cleanse, hydrate deeply, seal with ceramides.",
    href: "/shop/barrier-repair-kit",
    image: "/products/ceramide-moisturizer.png",
    accent: "03",
  },
  {
    title: "Hair Repair",
    copy: "Wash, nourish, and restore length softness over time.",
    href: "/shop/hair-repair-ritual-kit",
    image: "/products/repair-hair-mask.png",
    accent: "04",
  },
];

export function BuildYourRitual() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.22em] text-primary/70 uppercase">
            Routine discovery
          </p>
          <h2 className="mt-3 font-heading text-4xl tracking-tight sm:text-5xl">
            Build your ritual
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Thoughtful routines, made simple.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rituals.map((ritual) => (
            <Link
              key={ritual.title}
              href={ritual.href}
              className="group flex flex-col overflow-hidden rounded-sm border border-border/60 bg-card transition-all duration-500 hover:border-primary/25 hover:bg-muted/40"
            >
              <div className="relative aspect-[5/4] bg-muted/60">
                <Image
                  src={ritual.image}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 22vw, 50vw"
                  className="object-contain p-7 transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none"
                />
              </div>
              <div className="flex flex-1 flex-col px-5 py-6">
                <span className="font-heading text-lg text-primary/45">
                  {ritual.accent}
                </span>
                <h3 className="mt-2 font-heading text-2xl tracking-tight">
                  {ritual.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {ritual.copy}
                </p>
                <span className="mt-5 text-xs tracking-[0.16em] text-primary uppercase">
                  Discover →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
