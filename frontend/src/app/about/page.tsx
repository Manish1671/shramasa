import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Shramasa — a premium skincare and haircare brand focused on thoughtful ingredients and everyday rituals.",
};

const PILLARS: { id?: string; title: string; body: string }[] = [
  {
    title: "Our philosophy",
    body: "We believe effective care does not need to feel aggressive. Each product is designed around a clear purpose, balanced actives, and a finish that feels comfortable from the first use.",
  },
  {
    id: "ingredients",
    title: "Ingredient focus",
    body: "From niacinamide and vitamin C to restorative oils and modern UV filters, we choose ingredients for what they do — and leave out what does not belong.",
  },
  {
    title: "Premium positioning",
    body: "Shramasa is not about excess. It is about elevated everyday care: considered packaging, clear information, and a shopping experience that feels calm and trustworthy.",
  },
  {
    title: "Made for India",
    body: "Our collection is built for real climates and real routines — lightweight textures, practical SPF, and haircare that supports strength and softness.",
  },
];

export default function AboutPage() {
  return (
    <main className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[80rem]">
        <div className="max-w-2xl border-b border-border pb-12">
          <p className="eyebrow">About Shramasa</p>
          <h1 className="type-h2 mt-4 text-balance">
            Beauty care with quiet confidence
          </h1>
          <p className="type-body mt-6">
            Shramasa was created for people who want their rituals to feel
            intentional — formulas that respect skin and hair, textures that
            feel refined, and routines simple enough to keep.
          </p>
        </div>

        <div className="mt-16 grid max-w-5xl gap-x-14 md:grid-cols-2">
          {PILLARS.map((pillar) => (
            <section
              key={pillar.title}
              id={pillar.id}
              className="scroll-mt-28 border-b border-border py-9"
            >
              <h2 className="type-h3">{pillar.title}</h2>
              <div className="editorial-rule mt-4" />
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {pillar.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-2xl text-center">
          <p className="eyebrow">Begin</p>
          <h2 className="type-h2 mt-4">Begin your ritual</h2>
          <p className="type-body mt-5">
            Explore the collection or reach out with a question.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 px-9 text-[0.68rem] tracking-[0.18em] uppercase",
              )}
            >
              Shop now
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 border-border px-9 text-[0.68rem] tracking-[0.18em] uppercase",
              )}
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
