import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductDetailSections } from "@/components/commerce/ProductDetailSections";
import { ProductPurchaseControls } from "@/components/commerce/ProductPurchaseControls";
import { apiFetch, getAccessToken } from "@/lib/api";
import { formatInr } from "@/lib/format";
import { productImagePath } from "@/lib/product-image";
import type { Product, Wishlist } from "@/lib/types";

type ProductDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const LOW_STOCK_THRESHOLD = 12;

const TRUST_ITEMS = [
  "Secure checkout",
  "Easy returns",
  "Carefully packed",
  "Everyday delivery",
] as const;

const DELIVERY_COPY =
  "Orders ship across India via cash on delivery. Eligible unopened products may be returned according to our returns policy.";

const FAQ_COPY =
  "Demo note: For ingredient sensitivities or routine questions, write to us from the Contact page. We respond with considered guidance — never medical advice.";

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await apiFetch<Product>(
      `/products/${encodeURIComponent(slug)}`,
      {},
      { auth: false },
    );
    return {
      title: product.name,
      description: product.description.slice(0, 160),
      openGraph: {
        title: `${product.name} | Shramasa`,
        description: product.description.slice(0, 160),
      },
    };
  } catch {
    return { title: "Product" };
  }
}

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

function ritualPairings(product: Product, catalog: Product[]): Product[] {
  const preferredByCategory: Record<string, string[]> = {
    "face-care": [
      "vitamin-c-serum",
      "hydrating-gel-cream",
      "spf-50-sunscreen",
      "ceramide-moisturizer",
      "gentle-gel-cleanser",
    ],
    "hair-care": [
      "strengthening-shampoo",
      "nourishing-conditioner",
      "repair-hair-mask",
      "nourishing-hair-oil",
    ],
    "body-care": [
      "gentle-body-wash",
      "smoothing-body-scrub",
      "hydrating-body-lotion",
    ],
    "lip-fragrance": [
      "nourishing-lip-balm",
      "spf-30-lip-balm",
      "overnight-lip-mask",
    ],
    "ritual-kits": [
      "glow-ritual-kit",
      "barrier-repair-kit",
      "hair-repair-ritual-kit",
    ],
  };

  const preferred = preferredByCategory[product.category.slug] ?? [];
  const fromPreferred = preferred
    .map((slug) => catalog.find((item) => item.slug === slug))
    .filter(
      (item): item is Product =>
        item != null && item.isActive && item.id !== product.id,
    );

  if (fromPreferred.length >= 2) {
    return fromPreferred.slice(0, 3);
  }

  return catalog
    .filter(
      (item) =>
        item.isActive &&
        item.id !== product.id &&
        item.category.slug === product.category.slug,
    )
    .slice(0, 3);
}

function stockLabel(stock: number): string {
  if (stock <= 0) {
    return "Currently unavailable";
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return `Only ${stock} left`;
  }
  return "In stock";
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
  const imageSrc = productImagePath(product.slug);
  const imageAlt = product.images[0]?.altText ?? product.name;
  const related = ritualPairings(product, products);
  const inStock = product.stock > 0;

  return (
    <main className="px-6 py-10 sm:py-14 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Breadcrumb"
          className="text-[0.68rem] tracking-[0.08em] text-muted-foreground"
        >
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link
                href="/"
                className="transition-colors duration-300 hover:text-primary"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li>
              <Link
                href="/shop"
                className="transition-colors duration-300 hover:text-primary"
              >
                Shop
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category.slug)}`}
                className="transition-colors duration-300 hover:text-primary"
              >
                {product.category.name}
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li className="text-foreground/70">{product.name}</li>
          </ol>
        </nav>

        <section className="mt-8 grid items-start gap-8 sm:gap-10 lg:mt-12 lg:grid-cols-[1.14fr_0.86fr] lg:gap-14 xl:gap-16">
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[linear-gradient(165deg,oklch(0.955_0.014_95)_0%,oklch(0.92_0.02_145)_100%)] ring-1 ring-border/50">
              <div className="absolute inset-0 pdp-image-enter">
                <Image
                  key={product.slug}
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  priority
                  unoptimized
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-contain object-center p-5 sm:p-8 lg:p-9"
                />
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square overflow-hidden rounded-sm bg-[oklch(0.95_0.012_92)] ring-1 ring-border/50"
                  >
                    <Image
                      src={productImagePath(product.slug)}
                      alt={image.altText ?? product.name}
                      fill
                      unoptimized
                      sizes="120px"
                      className="object-contain object-center p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:py-2">
            <p className="text-[0.68rem] font-medium tracking-[0.22em] text-primary/75 uppercase">
              {product.category.name}
            </p>

            <h1 className="mt-3 font-heading text-[2.4rem] leading-[1.06] tracking-tight text-balance sm:mt-4 sm:text-[3.15rem] lg:text-[3.55rem] lg:leading-[1.04]">
              {product.name}
            </h1>

            <div className="mt-7 flex flex-wrap items-baseline gap-x-3.5 gap-y-1 sm:mt-8">
              <p className="font-heading text-[2.05rem] tracking-tight sm:text-[2.35rem]">
                {formatInr(product.price)}
              </p>
              {product.compareAtPrice ? (
                <p className="text-[0.95rem] text-muted-foreground line-through sm:text-base">
                  {formatInr(product.compareAtPrice)}
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex items-center gap-2.5 text-sm text-muted-foreground sm:mt-5">
              <span
                className={`size-1.5 rounded-full ${
                  inStock ? "bg-primary" : "bg-muted-foreground/70"
                }`}
                aria-hidden="true"
              />
              <span>{stockLabel(product.stock)}</span>
            </div>

            <div className="editorial-rule mt-7 sm:mt-8" />

            <p className="mt-6 max-w-xl text-[0.95rem] leading-7 text-muted-foreground sm:mt-7 sm:text-base sm:leading-[1.85]">
              {product.description}
            </p>

            <ProductPurchaseControls
              productId={product.id}
              stock={product.stock}
              initialWishlisted={wishlisted}
            />

            <ul className="mt-9 grid grid-cols-1 gap-2.5 border-t border-border/55 pt-7 sm:mt-10 sm:grid-cols-2 sm:gap-3 sm:pt-8">
              {TRUST_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-[0.78rem] tracking-[0.04em] text-muted-foreground"
                >
                  <span
                    className="font-heading text-sm leading-none text-primary/55"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ProductDetailSections
          benefits={
            product.description ||
            "Designed to support everyday comfort and a refined finish."
          }
          ingredients={
            product.ingredients ?? "Ingredient information is coming soon."
          }
          howToUse={product.howToUse ?? "Usage instructions are coming soon."}
          delivery={DELIVERY_COPY}
          faq={FAQ_COPY}
        />

        {related.length > 0 && (
          <section
            className="mt-4 border-t border-border/50 pt-16 sm:mt-6 sm:pt-20 lg:pt-24"
            aria-labelledby="complete-ritual"
          >
            <div className="max-w-2xl">
              <p className="text-[0.65rem] font-medium tracking-[0.22em] text-primary/70 uppercase">
                Continue the ritual
              </p>
              <h2
                id="complete-ritual"
                className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl lg:text-[2.75rem]"
              >
                Complete your ritual
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-[0.95rem] sm:leading-8">
                Pair your essential with thoughtful complementary care for a
                considered routine.
              </p>
              <div className="editorial-rule mt-6" />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:mt-12 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
              {related.map((recommendation) => (
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
