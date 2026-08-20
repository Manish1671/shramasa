import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductDetailSections } from "@/components/commerce/ProductDetailSections";
import { ProductPurchaseControls } from "@/components/commerce/ProductPurchaseControls";
import { ProductStage } from "@/components/commerce/ProductStage";
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
  "Ships across India",
] as const;

const DELIVERY_COPY = (
  <>
    Complimentary shipping on every order within India. Pay online with Razorpay
    or choose Cash on Delivery. Unopened products may be returned within 7 days
    of delivery. See{" "}
    <Link href="/care" className="underline underline-offset-4">
      customer care
    </Link>
    .
  </>
);

const FAQ_COPY = (
  <>
    For ingredient sensitivities or routine questions, write to us from the{" "}
    <Link href="/contact" className="underline underline-offset-4">
      Contact page
    </Link>
    . We respond with considered guidance — never medical advice.
  </>
);

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
    <main className="px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[64rem]">
        <nav
          aria-label="Breadcrumb"
          className="text-[0.68rem] tracking-[0.08em] text-muted-foreground"
        >
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link
                href="/"
                className="transition-colors duration-300 hover:text-foreground"
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
                className="transition-colors duration-300 hover:text-foreground"
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
                className="transition-colors duration-300 hover:text-foreground"
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

        <section className="mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="w-full min-w-0">
            <ProductStage
              src={imageSrc}
              alt={imageAlt}
              slug={product.slug}
              priority
            />

            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={image.id}
                    className={
                      index === 0
                        ? "relative aspect-square w-[4.25rem] overflow-hidden border border-foreground/70 bg-card"
                        : "relative aspect-square w-[4.25rem] overflow-hidden border border-border bg-card"
                    }
                  >
                    <img
                      src={productImagePath(product.slug)}
                      alt={image.altText ?? product.name}
                      className="absolute inset-0 h-full w-full object-contain object-center p-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex w-full min-w-0 flex-col lg:pt-1">
            <p className="eyebrow">{product.category.name}</p>

            <h1 className="mt-3 font-heading text-[1.85rem] leading-[1.15] tracking-[-0.02em] text-balance sm:text-[2.15rem]">
              {product.name}
            </h1>

            <p className="mt-4 text-[0.92rem] leading-7 text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-[1.35rem] tabular-nums tracking-[0.01em]">
                {formatInr(product.price)}
              </p>
              {product.compareAtPrice ? (
                <p className="text-[0.9rem] text-muted-foreground line-through tabular-nums">
                  {formatInr(product.compareAtPrice)}
                </p>
              ) : null}
            </div>

            <p className="mt-2 text-[0.78rem] text-muted-foreground">
              MRP inclusive of all taxes
            </p>

            <div className="mt-4 flex items-center gap-2.5 text-sm text-muted-foreground">
              <span
                className={`size-1.5 rounded-full ${
                  inStock ? "bg-primary" : "bg-muted-foreground/70"
                }`}
                aria-hidden="true"
              />
              <span>{stockLabel(product.stock)}</span>
            </div>

            <ProductPurchaseControls
              productId={product.id}
              stock={product.stock}
              initialWishlisted={wishlisted}
            />

            <ul className="mt-6 grid grid-cols-2 gap-px border border-border bg-border">
              {TRUST_ITEMS.map((item) => (
                <li
                  key={item}
                  className="bg-background px-3 py-3 text-center text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ProductDetailSections
          ingredients={product.ingredients?.trim() || null}
          howToUse={product.howToUse?.trim() || null}
          delivery={DELIVERY_COPY}
          faq={FAQ_COPY}
        />

        {related.length > 0 && (
          <section
            className="mt-16 border-t border-border pt-14 sm:mt-20 sm:pt-16"
            aria-labelledby="complete-ritual"
          >
            <div className="max-w-2xl">
              <p className="eyebrow">Continue the ritual</p>
              <h2 id="complete-ritual" className="type-h3 mt-3">
                Complete your ritual
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                Pair this essential with complementary care for a considered
                routine.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
