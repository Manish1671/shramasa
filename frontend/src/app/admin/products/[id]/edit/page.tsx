import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/ProductForm";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiError, apiFetch } from "@/lib/api";
import type { AdminProduct, ProductCategory } from "@/lib/types";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  let product: AdminProduct | null = null;
  let categories: ProductCategory[] = [];
  let errorMessage: string | null = null;
  let missing = false;

  try {
    const [productResult, categoryResult] = await Promise.all([
      apiFetch<AdminProduct>(`/admin/products/${id}`),
      apiFetch<ProductCategory[]>("/admin/categories"),
    ]);
    product = productResult;
    categories = categoryResult;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      missing = true;
    } else {
      errorMessage =
        error instanceof ApiError
          ? error.message
          : "Unable to load this product.";
    }
  }

  if (missing) {
    notFound();
  }

  return (
    <main className="px-6 py-10 sm:px-8 lg:px-10">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          ← Back to products
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Edit product
        </h1>
        {product ? (
          <p className="mt-2 text-sm text-muted-foreground">{product.name}</p>
        ) : null}
      </div>

      {errorMessage || !product ? (
        <p className="text-muted-foreground" role="alert">
          {errorMessage ?? "Unable to load this product."}
        </p>
      ) : (
        <Card className="max-w-3xl bg-background/80">
          <CardHeader>
            <h2 className="text-lg font-semibold">Product details</h2>
          </CardHeader>
          <CardContent>
            <ProductForm categories={categories} product={product} />
          </CardContent>
        </Card>
      )}
    </main>
  );
}
