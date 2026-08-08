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
    <div>
      <div className="mt-10">
        <p className="text-sm font-medium">Quantity</p>
        <div className="mt-3 inline-flex items-center rounded-lg border border-border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Decrease quantity"
            disabled={outOfStock || quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus />
          </Button>
          <span className="w-10 text-center text-sm" aria-label="Quantity">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Increase quantity"
            disabled={outOfStock || quantity >= stock}
            onClick={() =>
              setQuantity((value) => Math.min(stock, value + 1))
            }
          >
            <Plus />
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <AddToCartButton
          productId={productId}
          quantity={quantity}
          disabled={outOfStock}
          size="lg"
        />
        <AddToCartButton
          productId={productId}
          quantity={quantity}
          disabled={outOfStock}
          size="lg"
          variant="outline"
          label="Buy Now"
          redirectToCart
        />
      </div>

      <div className="mt-3">
        <WishlistToggleButton
          productId={productId}
          initialSaved={initialWishlisted}
          showLabel
        />
      </div>
    </div>
  );
}
