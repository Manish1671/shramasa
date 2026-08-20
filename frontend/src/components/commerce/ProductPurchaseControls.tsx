"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WishlistToggleButton } from "@/components/commerce/WishlistToggleButton";
import { Button } from "@/components/ui/button";

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
    <div className="mt-7 space-y-5">
      <div>
        <p className="eyebrow">Quantity</p>
        <div className="mt-3 inline-flex items-center overflow-hidden border border-border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 hover:bg-secondary"
            aria-label="Decrease quantity"
            disabled={outOfStock || quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus className="size-3.5" />
          </Button>
          <span
            className="min-w-11 border-x border-border px-3 text-center text-sm tabular-nums"
            aria-label="Quantity"
          >
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 hover:bg-secondary"
            aria-label="Increase quantity"
            disabled={outOfStock || quantity >= stock}
            onClick={() => setQuantity((value) => Math.min(stock, value + 1))}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="space-y-2.5">
        <AddToCartButton
          productId={productId}
          quantity={quantity}
          disabled={outOfStock}
          size="lg"
          label="Add to Cart"
          className="h-12 text-[0.68rem] font-medium tracking-[0.16em] uppercase"
        />
        <AddToCartButton
          productId={productId}
          quantity={quantity}
          disabled={outOfStock}
          size="lg"
          variant="outline"
          label="Buy Now"
          redirectToCart
          className="h-12 border-foreground/80 bg-transparent text-[0.68rem] font-medium tracking-[0.16em] uppercase hover:bg-secondary hover:text-foreground"
        />
        <WishlistToggleButton
          productId={productId}
          initialSaved={initialWishlisted}
          showLabel
          className="h-10 border-transparent bg-transparent px-0 text-[0.68rem] tracking-[0.16em] uppercase hover:bg-transparent hover:text-foreground"
        />
      </div>
    </div>
  );
}
