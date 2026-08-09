import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Shramasa — a premium skincare and haircare brand focused on thoughtful ingredients and everyday rituals.",
};

export default function AboutPage() {
  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">
          About Shramasa
        </p>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Beauty care with quiet confidence
        </h1>
        <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
          Shramasa was created for people who want their rituals to feel
          intentional — formulas that respect skin and hair, textures that feel
          refined, and routines simple enough to keep.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-10 border-t border-border pt-12 md:grid-cols-2">
        <section>
          <h2 className="font-heading text-2xl font-semibold">Our philosophy</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            We believe effective care does not need to feel aggressive. Each
            product is designed around a clear purpose, balanced actives, and a
            finish that feels comfortable from the first use.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-semibold">
            Ingredient focus
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            From niacinamide and vitamin C to restorative oils and modern UV
            filters, we choose ingredients for what they do — and leave out what
            does not belong.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-semibold">
            Premium positioning
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Shramasa is not about excess. It is about elevated everyday care:
            considered packaging, clear information, and a shopping experience
            that feels calm and trustworthy.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-semibold">Made for India</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Our collection is built for real climates and real routines —
            lightweight textures, practical SPF, and haircare that supports
            strength and softness.
          </p>
        </section>
      </div>

      <div className="mx-auto mt-16 max-w-3xl rounded-sm border border-border bg-muted/40 px-6 py-10 text-center">
        <h2 className="font-heading text-2xl font-semibold">
          Begin your ritual
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Explore the collection or reach out with a question.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className={buttonVariants({ size: "lg" })}>
            Shop now
          </Link>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
