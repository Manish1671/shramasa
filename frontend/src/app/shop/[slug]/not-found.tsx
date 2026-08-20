import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24 sm:py-32">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center border border-border bg-secondary">
          <PackageSearch
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <p className="eyebrow mt-8">Not found</p>
        <h1 className="type-h3 mt-3">Product not found</h1>
        <p className="type-body mt-4">
          This product may no longer be available, or the address may be
          incorrect.
        </p>
        <Link
          href="/shop"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-9 h-12 px-9 text-[0.68rem] tracking-[0.18em] uppercase",
          )}
        >
          Return to Shop
        </Link>
      </div>
    </main>
  );
}
