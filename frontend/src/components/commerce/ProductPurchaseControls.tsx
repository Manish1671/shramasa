"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WishlistToggleButton } from "@/components/commerce/WishlistToggleButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductPurchaseControlsProps = {
  productId: string;
  stock: number;
  initialWishlisted: boolean;
};

export function ProductPurchaseControls({
  productId,
  stock,
  initialWishlisted,
}: ProductPurchaseControlsProps) {
  const [quantity, setQuantity] = useState(1);
  const outOfStock = stock <= 0;

  return (
    <div className="mt-8 space-y-7 sm:mt-10 sm:space-y-8">
      <div>
        <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Quantity
        </p>
        <div className="mt-3.5 inline-flex items-center overflow-hidden rounded-sm border border-border/80 bg-[oklch(0.985_0.006_92)]">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 rounded-none hover:bg-muted/70"
            aria-label="Decrease quantity"
            disabled={outOfStock || quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus className="size-3.5" />
          </Button>
          <span
            className="min-w-12 border-x border-border/80 px-3 text-center text-sm tabular-nums"
            aria-label="Quantity"
          >
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 rounded-none hover:bg-muted/70"
            aria-label="Increase quantity"
            disabled={outOfStock || quantity >= stock}
            onClick={() => setQuantity((value) => Math.min(stock, value + 1))}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="space-y-3.5">
        <AddToCartButton
          productId={productId}
          quantity={quantity}
          disabled={outOfStock}
          size="lg"
          label="Add to Cart"
          className={cn(
            "h-12 rounded-sm bg-primary text-[0.78rem] font-medium tracking-[0.14em] text-primary-foreground uppercase sm:h-[3.15rem]",
            "transition-colors duration-300 hover:bg-primary/90",
          )}
        />
        <AddToCartButton
          productId={productId}
          quantity={quantity}
          disabled={outOfStock}
          size="lg"
          variant="outline"
          label="Buy Now"
          redirectToCart
          className={cn(
            "h-12 rounded-sm border-border/90 bg-transparent text-[0.78rem] font-medium tracking-[0.14em] uppercase",
            "transition-colors duration-300 hover:border-primary/40 hover:bg-muted/40 hover:text-foreground",
          )}
        />
        <div className="pt-1">
          <WishlistToggleButton
            productId={productId}
            initialSaved={initialWishlisted}
            showLabel
            className="h-11 rounded-sm border-border/70 bg-transparent tracking-[0.08em] transition-colors duration-300 hover:border-primary/35 hover:bg-muted/30 hover:scale-100"
          />
        </div>
      </div>
    </div>
  );
}
