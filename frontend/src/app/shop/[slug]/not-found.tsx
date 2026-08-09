import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24 sm:py-32">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-sm bg-[oklch(0.95_0.012_92)] ring-1 ring-border/55">
          <PackageSearch
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <p className="mt-8 text-[0.65rem] font-medium tracking-[0.22em] text-primary/70 uppercase">
          Not found
        </p>
        <h1 className="mt-3 font-heading text-4xl tracking-tight sm:text-5xl">
          Product not found
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          This product may no longer be available, or the address may be
          incorrect.
        </p>
        <Link
          href="/shop"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-8 rounded-sm bg-primary px-8 text-primary-foreground transition-colors duration-300 hover:bg-primary/90",
          )}
        >
          Return to Shop
        </Link>
      </div>
    </main>
  );
}
