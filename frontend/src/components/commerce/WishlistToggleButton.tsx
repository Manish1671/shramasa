"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/app/commerce/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WishlistToggleButtonProps = {
  productId: string;
  initialSaved: boolean;
  className?: string;
  showLabel?: boolean;
};

export function WishlistToggleButton({
  productId,
  initialSaved,
  className,
  showLabel = false,
}: WishlistToggleButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = saved
        ? await removeFromWishlistAction(productId)
        : await addToWishlistAction(productId);

      if (!result.ok) {
        if (result.error?.includes("sign in")) {
          router.push(
            `/login?next=${encodeURIComponent(window.location.pathname)}`,
          );
          return;
        }
        setError(result.error);
        return;
      }

      setSaved(!saved);
      router.refresh();
    });
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size={showLabel ? "lg" : "icon"}
        className={cn(showLabel && "w-full", className)}
        disabled={pending}
        onClick={handleClick}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={saved}
      >
        <Heart
          className={cn(saved && "fill-current")}
          data-icon={showLabel ? "inline-start" : undefined}
        />
        {showLabel ? (saved ? "Saved" : "Save") : null}
      </Button>
      {error ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
