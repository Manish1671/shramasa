"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ShopErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ShopError({ error, reset }: ShopErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
          <AlertCircle
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Unable to load products
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          We couldn&apos;t retrieve the collection right now. Please try again
          in a moment.
        </p>
        <Button type="button" size="lg" className="mt-8" onClick={reset}>
          Try Again
        </Button>
      </div>
    </main>
  );
}
