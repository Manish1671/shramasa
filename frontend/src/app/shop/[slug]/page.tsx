import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductPurchaseControls } from "@/components/commerce/ProductPurchaseControls";
import { apiFetch, getAccessToken } from "@/lib/api";
import { formatInr } from "@/lib/format";
import type { Product, Wishlist } from "@/lib/types";

type ProductDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProduct(slug: string): Promise<Product> {
  try {
    return await apiFetch<Product>(
      `/products/${encodeURIComponent(slug)}`,
      {},
      { auth: false },
    );
  } catch {
    notFound();
    throw new Error("Product not found");
  }
}

async function getRecommendations(): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>("/products", {}, { auth: false });
  } catch {
    return [];
  }
}

async function isWishlisted(productId: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) {
    return false;
  }

  try {
    const wishlist = await apiFetch<Wishlist>("/wishlist");
    return wishlist.items.some((item) => item.productId === productId);
  } catch {
    return false;
  }
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;
  const [product, products] = await Promise.all([
    getProduct(slug),
    getRecommendations(),
  ]);
  const wishlisted = await isWishlisted(product.id);
  const primaryImage = product.images[0];
  const recommendations = products
    .filter(
      (recommendation) =>
        recommendation.isActive && recommendation.id !== product.id,
    )
    .slice(0, 4);
  const productDetails = [
    {
      title: "Description",
      content: product.description,
    },
    {
      title: "Ingredients",
      content: product.ingredients ?? "Ingredient information is coming soon.",
    },
    {
      title: "How to Use",
      content: product.howToUse ?? "Usage instructions are coming soon.",
    },
    {
      title: "Shipping & Returns",
      content:
        "Orders ship across India. Eligible unopened products may be returned according to our returns policy.",
    },
  ];

  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.altText ?? product.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-medium text-muted-foreground">
                  Product Image
                </div>
              )}
            </div>

            {product.images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    <Image
                      src={image.url}
                      alt={image.altText ?? product.name}
                      fill
                      sizes="(min-width: 1024px) 12vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:py-8">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              {product.category.name}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className={`size-2 rounded-full ${
                  product.stock > 0 ? "bg-emerald-600" : "bg-muted-foreground"
                }`}
                aria-hidden="true"
              />
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Currently out of stock"}
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <p className="text-2xl font-semibold">
                {formatInr(product.price)}
              </p>
              {product.compareAtPrice && (
                <p className="text-base text-muted-foreground line-through">
                  {formatInr(product.compareAtPrice)}
                </p>
              )}
            </div>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              {product.description}
            </p>

            <ProductPurchaseControls
              productId={product.id}
              stock={product.stock}
              initialWishlisted={wishlisted}
            />

            <div className="mt-12 border-t border-border">
              {productDetails.map((detail) => (
                <details key={detail.title} className="border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-semibold">
                    {detail.title}
                    <ChevronDown className="size-4" aria-hidden="true" />
                  </summary>
                  <p className="pb-5 pr-8 text-sm leading-6 text-muted-foreground">
                    {detail.content}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <section className="pt-24 sm:pt-28" aria-labelledby="recommendations">
            <h2
              id="recommendations"
              className="text-3xl font-semibold tracking-tight"
            >
              You May Also Like
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommendations.map((recommendation) => (
                <ProductCard
                  key={recommendation.id}
                  product={recommendation}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
