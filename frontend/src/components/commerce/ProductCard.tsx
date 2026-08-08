import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WishlistToggleButton } from "@/components/commerce/WishlistToggleButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatInr } from "@/lib/format";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  wishlisted?: boolean;
};

export function ProductCard({ product, wishlisted = false }: ProductCardProps) {
  const image = product.images[0];

  return (
    <Card className="relative h-full">
      <Link
        href={`/shop/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="relative mx-4 aspect-4/5 overflow-hidden rounded-xl bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-medium text-muted-foreground">
            Product Image
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <WishlistToggleButton
            productId={product.id}
            initialSaved={wishlisted}
          />
        </div>
      </div>

      <CardHeader>
        <h3 className="text-base font-semibold">{product.name}</h3>
        <CardDescription className="line-clamp-2 leading-6">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto flex items-center justify-between">
        <span className="font-semibold">{formatInr(product.price)}</span>
        <span className="text-xs text-muted-foreground">
          {product.stock > 0 ? "In stock" : "Out of stock"}
        </span>
      </CardContent>

      <CardFooter className="relative z-10">
        <AddToCartButton
          productId={product.id}
          disabled={product.stock <= 0}
        />
      </CardFooter>
    </Card>
  );
}
