import { ProductPhotoFrame } from "@/components/commerce/ProductPhotoFrame";

type ProductStageProps = {
  src: string;
  alt: string;
  slug?: string;
  priority?: boolean;
};

export function ProductStage({
  src,
  alt,
  slug,
  priority = false,
}: ProductStageProps) {
  return (
    <figure className="m-0">
      <ProductPhotoFrame
        src={src}
        alt={alt}
        slug={slug}
        variant="stage"
        priority={priority}
      />
    </figure>
  );
}
