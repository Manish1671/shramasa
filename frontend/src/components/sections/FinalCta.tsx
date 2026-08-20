import Link from "next/link";

import { Section } from "@/components/layout/Section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCta() {
  return (
    <Section tone="forest">
      <div className="reveal mx-auto max-w-2xl text-center">
        <p className="eyebrow">Begin</p>
        <h2 className="type-h2 mt-5 text-balance">
          Make space for your ritual.
        </h2>
        <p className="type-body mx-auto mt-6 max-w-md">
          Explore thoughtful skincare, haircare, and body essentials designed
          for everyday care.
        </p>

        <div className="mt-11">
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
    </Section>
  );
}
