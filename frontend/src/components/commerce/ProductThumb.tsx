import { ProductPhotoFrame } from "@/components/commerce/ProductPhotoFrame";
import { productImagePath } from "@/lib/product-image";
import { cn } from "@/lib/utils";

type ProductThumbProps = {
  slug: string;
  alt: string;
  sizes?: string;
  className?: string;
};

/** Compact product photo in a square contain frame — never stretched. */
export function ProductThumb({ slug, alt, className }: ProductThumbProps) {
  return (
    <ProductPhotoFrame
      src={productImagePath(slug)}
      alt={alt}
      slug={slug}
      variant="thumb"
      className={cn(className)}
    />
  );
}
