import Link from "next/link";

import { ProductRowActions } from "@/components/admin/ProductRowActions";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, apiFetch } from "@/lib/api";
import { formatInr } from "@/lib/format";
import type { AdminProduct, ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    isActive?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const categoryId = params.categoryId ?? "";
  const isActive = params.isActive ?? "";

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (categoryId) query.set("categoryId", categoryId);
  if (isActive === "true" || isActive === "false") {
    query.set("isActive", isActive);
  }
  const qs = query.toString();

  let products: AdminProduct[] = [];
  let categories: ProductCategory[] = [];
  let errorMessage: string | null = null;

  try {
    const [productResult, categoryResult] = await Promise.all([
      apiFetch<AdminProduct[]>(`/admin/products${qs ? `?${qs}` : ""}`),
      apiFetch<ProductCategory[]>("/admin/categories"),
    ]);
    products = productResult;
    categories = categoryResult;
  } catch (error) {
    errorMessage =
      error instanceof ApiError
        ? error.message
        : "Unable to load products.";
  }

  return (
    <main className="px-6 py-10 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Catalogue
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Products
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className={buttonVariants({ size: "sm" })}
        >
          New product
        </Link>
      </div>

      <form
        method="get"
        className="mt-8 grid gap-3 rounded-xl border border-border bg-background/80 p-4 sm:grid-cols-[1fr_12rem_10rem_auto]"
      >
        <Input
          name="search"
          defaultValue={search}
          placeholder="Search name or slug"
          className="h-10"
        />
        <select
          name="categoryId"
          defaultValue={categoryId}
          className="h-10 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          name="isActive"
          defaultValue={isActive}
          className="h-10 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "outline" }), "h-10")}
        >
          Filter
        </button>
      </form>

      {errorMessage ? (
        <p className="mt-8 text-muted-foreground" role="alert">
          {errorMessage}
        </p>
      ) : products.length === 0 ? (
        <div className="mt-16 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            No products found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Adjust filters or create a new product.
          </p>
          <Link
            href="/admin/products/new"
            className={buttonVariants({ className: "mt-6" })}
          >
            Create product
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-background">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-stone-50/80 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {product.slug}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {product.category.name}
                  </td>
                  <td className="px-4 py-4">{formatInr(product.price)}</td>
                  <td className="px-4 py-4">{product.stock}</td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-md px-2 py-1 text-xs font-medium",
                        product.isActive
                          ? "bg-stone-900 text-stone-50"
                          : "bg-stone-100 text-stone-600",
                      )}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "sm",
                        })}
                      >
                        Edit
                      </Link>
                      <ProductRowActions
                        productId={product.id}
                        isActive={product.isActive}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
