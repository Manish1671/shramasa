import type { ReactNode } from "react";

import { productImageOrientation } from "@/lib/product-image";
import { cn } from "@/lib/utils";

type ProductPhotoFrameProps = {
  src: string;
  alt: string;
  slug?: string;
  variant?: "card" | "stage" | "thumb";
  priority?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * 4:5 media region for every card. Source photos stay complete (contain).
 * Landscape shots sit at full media width with a photographic backdrop
 * so they are not a small strip in an empty ivory box.
 */
export function ProductPhotoFrame({
  src,
  alt,
  slug,
  variant = "card",
  priority = false,
  className,
  children,
}: ProductPhotoFrameProps) {
  const orientation = slug ? productImageOrientation(slug) : "portrait";
  const isListing = variant === "card";
  const showAtmosphere = isListing && orientation === "landscape";

  return (
    <div
      className={cn(
        "product-frame",
        variant === "stage" && "product-frame-stage",
        variant === "thumb" && "product-frame-thumb",
        className,
      )}
      data-orientation={isListing ? orientation : undefined}
    >
      {showAtmosphere ? (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="product-frame__atmosphere"
          decoding="async"
        />
      ) : null}
      <img
        src={src}
        alt={alt}
        className="product-frame__photo"
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
      {children}
    </div>
  );
}
