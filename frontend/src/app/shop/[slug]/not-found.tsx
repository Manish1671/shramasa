import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
          <PackageSearch
            className="size-7 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Product not found
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          This product may no longer be available or the address may be
          incorrect.
        </p>
        <Link
          href="/shop"
          className={buttonVariants({ size: "lg", className: "mt-8" })}
        >
          Return to Shop
        </Link>
      </div>
    </main>
  );
}
