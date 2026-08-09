import Link from "next/link";

import { ProductForm } from "@/components/admin/ProductForm";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiError, apiFetch } from "@/lib/api";
import type { ProductCategory } from "@/lib/types";

export default async function AdminNewProductPage() {
  let categories: ProductCategory[] = [];
  let errorMessage: string | null = null;

  try {
    categories = await apiFetch<ProductCategory[]>("/admin/categories");
  } catch (error) {
    errorMessage =
      error instanceof ApiError
        ? error.message
        : "Unable to load categories.";
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
          New product
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a product to the Shramasa catalogue.
        </p>
      </div>

      {errorMessage ? (
        <p className="text-muted-foreground" role="alert">
          {errorMessage}
        </p>
      ) : (
        <Card className="max-w-3xl bg-background/80">
          <CardHeader>
            <h2 className="text-lg font-semibold">Product details</h2>
          </CardHeader>
          <CardContent>
            <ProductForm categories={categories} />
          </CardContent>
        </Card>
      )}
    </main>
  );
}
