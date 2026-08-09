"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type FormEvent } from "react";

import {
  createProductAction,
  updateProductAction,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  AdminProduct,
  CreateProductInput,
  ProductCategory,
  ProductImageInput,
} from "@/lib/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type ProductFormProps = {
  categories: ProductCategory[];
  product?: AdminProduct;
};

type FormState = {
  name: string;
  slug: string;
  description: string;
  ingredients: string;
  howToUse: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  categoryId: string;
  isActive: boolean;
  imageUrls: string[];
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(isEdit);

  const initialImages =
    product?.images.map((image) => image.url).filter(Boolean) ?? [""];

  const [form, setForm] = useState<FormState>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    ingredients: product?.ingredients ?? "",
    howToUse: product?.howToUse ?? "",
    price: product?.price ?? "",
    compareAtPrice: product?.compareAtPrice ?? "",
    stock: product ? String(product.stock) : "0",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    isActive: product?.isActive ?? true,
    imageUrls: initialImages.length > 0 ? initialImages : [""],
  });

  const slugPreview = useMemo(() => slugify(form.name), [form.name]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate(): string | null {
    if (form.name.trim().length < 2) {
      return "Name must be at least 2 characters.";
    }

    const slug = (slugTouched ? form.slug : slugPreview).trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return "Slug must be lowercase kebab-case.";
    }

    if (form.description.trim().length < 10) {
      return "Description must be at least 10 characters.";
    }

    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0.01) {
      return "Enter a valid price greater than zero.";
    }

    if (form.compareAtPrice.trim()) {
      const compareAtPrice = Number(form.compareAtPrice);
      if (!Number.isFinite(compareAtPrice) || compareAtPrice < 0.01) {
        return "Enter a valid compare-at price, or leave it blank.";
      }
      if (compareAtPrice < price) {
        return "Compare-at price must be greater than or equal to price.";
      }
    }

    const stock = Number(form.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      return "Stock must be a whole number of zero or more.";
    }

    if (!form.categoryId) {
      return "Select a category.";
    }

    const urls = form.imageUrls.map((url) => url.trim()).filter(Boolean);
    for (const url of urls) {
      if (!isValidUrl(url)) {
        return "Each image must be a valid http(s) URL.";
      }
    }

    return null;
  }

  function buildImages(): ProductImageInput[] | undefined {
    const urls = form.imageUrls.map((url) => url.trim()).filter(Boolean);
    if (urls.length === 0) {
      return undefined;
    }
    return urls.map((url, index) => ({
      url,
      altText: form.name.trim() || undefined,
      sortOrder: index,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const slug = (slugTouched ? form.slug : slugPreview).trim();
    const price = Number(form.price);
    const stock = Number(form.stock);
    const images = buildImages();

    const payload: CreateProductInput = {
      name: form.name.trim(),
      slug,
      description: form.description.trim(),
      ingredients: form.ingredients.trim() || undefined,
      howToUse: form.howToUse.trim() || undefined,
      price,
      compareAtPrice: form.compareAtPrice.trim()
        ? Number(form.compareAtPrice)
        : undefined,
      stock,
      categoryId: form.categoryId,
      isActive: form.isActive,
      images,
    };

    startTransition(async () => {
      const result = isEdit && product
        ? await updateProductAction(product.id, {
            ...payload,
            compareAtPrice: form.compareAtPrice.trim()
              ? Number(form.compareAtPrice)
              : null,
            ingredients: form.ingredients.trim() || null,
            howToUse: form.howToUse.trim() || null,
            images: images ?? [],
          })
        : await createProductAction(payload);

      if (!result.ok || !result.data) {
        setError(result.error ?? "Unable to save product.");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(event) => {
              const name = event.target.value;
              updateField("name", name);
              if (!slugTouched) {
                updateField("slug", slugify(name));
              }
            }}
            className="h-10"
            required
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true);
              updateField("slug", event.target.value);
            }}
            className="h-10 font-mono text-sm"
            required
          />
          <p className="text-xs text-muted-foreground">
            Lowercase kebab-case. Auto-filled from name until you edit it.
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            required
            rows={5}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="ingredients">Ingredients</Label>
          <textarea
            id="ingredients"
            value={form.ingredients}
            onChange={(event) => updateField("ingredients", event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="howToUse">How to use</Label>
          <textarea
            id="howToUse"
            value={form.howToUse}
            onChange={(event) => updateField("howToUse", event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (INR)</Label>
          <Input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
            className="h-10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="compareAtPrice">Compare-at price</Label>
          <Input
            id="compareAtPrice"
            type="number"
            min="0.01"
            step="0.01"
            value={form.compareAtPrice}
            onChange={(event) =>
              updateField("compareAtPrice", event.target.value)
            }
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={(event) => updateField("stock", event.target.value)}
            className="h-10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            value={form.categoryId}
            onChange={(event) => updateField("categoryId", event.target.value)}
            required
            className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {categories.length === 0 ? (
              <option value="">No categories available</option>
            ) : null}
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <Label
            htmlFor="isActive"
            className="font-normal text-muted-foreground"
          >
            <Checkbox
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(checked) =>
                updateField("isActive", checked === true)
              }
            />
            Active (visible in store)
          </Label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Label>Image URLs</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              updateField("imageUrls", [...form.imageUrls, ""].slice(0, 8))
            }
            disabled={form.imageUrls.length >= 8}
          >
            Add image
          </Button>
        </div>
        <div className="space-y-2">
          {form.imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(event) => {
                  const next = [...form.imageUrls];
                  next[index] = event.target.value;
                  updateField("imageUrls", next);
                }}
                className="h-10"
              />
              {form.imageUrls.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    updateField(
                      "imageUrls",
                      form.imageUrls.filter((_, i) => i !== index),
                    )
                  }
                >
                  Remove
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending
            ? "Saving..."
            : isEdit
              ? "Save changes"
              : "Create product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={pending}
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
