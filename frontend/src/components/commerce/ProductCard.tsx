import Link from "next/link";

import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { ProductPhotoFrame } from "@/components/commerce/ProductPhotoFrame";
import { WishlistToggleButton } from "@/components/commerce/WishlistToggleButton";
import { formatInr } from "@/lib/format";
import { productImagePath } from "@/lib/product-image";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  wishlisted?: boolean;
  showDescription?: boolean;
};

export function ProductCard({
  product,
  wishlisted = false,
  showDescription = false,
}: ProductCardProps) {
  const imageAlt = product.images[0]?.altText ?? product.name;
  const imageSrc = productImagePath(product.slug);
  const outOfStock = product.stock <= 0;

  return (
    <article className="group relative flex h-full min-h-0 flex-col">
      <Link
        href={`/shop/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-0 z-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />

      <ProductPhotoFrame src={imageSrc} alt={imageAlt} slug={product.slug}>
        <div className="absolute top-2 right-2 z-10">
          <WishlistToggleButton
            productId={product.id}
            initialSaved={wishlisted}
            className="size-8 rounded-full bg-background/45 text-foreground/80 shadow-none hover:bg-background/70 hover:text-foreground"
          />
        </div>
      </ProductPhotoFrame>

      <div className="mt-5 flex flex-1 flex-col">
        <p className="eyebrow">{product.category.name}</p>
        <h3 className="type-h4 mt-2.5">{product.name}</h3>
        {showDescription ? (
          <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {product.description}
          </p>
        ) : (
          <p className="mt-2 text-[0.78rem] tracking-[0.04em] text-muted-foreground">
            {outOfStock ? "Out of stock" : "In stock"}
          </p>
        )}
        <div className="mt-auto flex items-baseline gap-2.5 pt-4">
          <span className="text-[0.9rem] tabular-nums">
            {formatInr(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-[0.8rem] text-muted-foreground line-through tabular-nums">
              {formatInr(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
        <div className="relative z-10 mt-4">
          <AddToCartButton
            productId={product.id}
            disabled={outOfStock}
            label={outOfStock ? "Out of stock" : "Add to cart"}
            size="lg"
            className="h-11 text-[0.68rem] font-medium tracking-[0.16em] uppercase"
          />
        </div>
      </div>
    </article>
  );
}
