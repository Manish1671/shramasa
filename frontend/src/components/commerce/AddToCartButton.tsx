"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { addToCartAction } from "@/app/commerce/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  productId: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  redirectToCart?: boolean;
};

export function AddToCartButton({
  productId,
  quantity = 1,
  disabled = false,
  className,
  label = "Add to Cart",
  variant = "default",
  size = "default",
  redirectToCart = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleClick() {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await addToCartAction(productId, quantity);
      if (!result.ok) {
        if (result.error?.includes("sign in")) {
          router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
        setError(result.error);
        return;
      }
      setSuccess(true);
      if (redirectToCart) {
        router.push("/cart");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="w-full">
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn("w-full", className)}
        disabled={disabled || pending}
        onClick={handleClick}
      >
        {pending ? "Adding..." : success ? "Added" : label}
      </Button>
      {error ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
