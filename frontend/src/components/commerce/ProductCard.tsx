import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WishlistToggleButton } from "@/components/commerce/WishlistToggleButton";
import { formatInr } from "@/lib/format";
import { productImagePath } from "@/lib/product-image";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  wishlisted?: boolean;
};

export function ProductCard({ product, wishlisted = false }: ProductCardProps) {
  const imageAlt = product.images[0]?.altText ?? product.name;
  const imageSrc = productImagePath(product.slug);

  return (
    <article className="group relative flex h-full flex-col">
      <Link
        href={`/shop/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-0 z-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {/*
        Uniform 3:4 frame with object-cover crops empty studio margins in the
        source photos so cards read edge-to-edge without letterboxing.
      */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[oklch(0.94_0.014_90)] ring-1 ring-border/50 transition-[box-shadow,transform] duration-500 group-hover:-translate-y-0.5 group-hover:shadow-[0_22px_44px_-34px_oklch(0.3_0.04_150_/0.55)] motion-reduce:transform-none">
        <Image
          key={product.slug}
          src={imageSrc}
          alt={imageAlt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
        />

        <div className="absolute top-3 right-3 z-10 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
          <WishlistToggleButton
            productId={product.id}
            initialSaved={wishlisted}
          />
        </div>

        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transform-none max-sm:translate-y-0 max-sm:opacity-100">
          <AddToCartButton
            productId={product.id}
            disabled={product.stock <= 0}
            label={product.stock <= 0 ? "Out of stock" : "Quick add"}
            size="sm"
            className="w-full rounded-sm shadow-sm"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-1 flex-col px-0.5">
        <p className="text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {product.category.name}
        </p>
        <h3 className="mt-2 font-heading text-[1.35rem] leading-snug tracking-tight transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-auto flex items-baseline gap-2.5 pt-5">
          <span className="text-sm font-semibold tracking-wide">
            {formatInr(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-xs text-muted-foreground line-through">
              {formatInr(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
