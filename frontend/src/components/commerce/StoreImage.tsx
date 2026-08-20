import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

/** Storefront photos: never stretched. Fill uses contain unless the caller overrides. */
export function StoreImage({
  quality = 90,
  className,
  style,
  fill,
  ...props
}: ImageProps) {
  return (
    <Image
      {...props}
      fill={fill}
      quality={quality}
      className={cn(
        fill ? "object-contain object-center" : "block h-auto w-full",
        className,
      )}
      style={fill ? style : { backgroundColor: "transparent", ...style }}
    />
  );
}
