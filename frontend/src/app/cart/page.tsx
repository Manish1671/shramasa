import Link from "next/link";
import { redirect } from "next/navigation";

import { CartView } from "@/components/commerce/CartView";
import { buttonVariants } from "@/components/ui/button";
import { ApiError, apiFetch, getAccessToken } from "@/lib/api";
import type { Cart } from "@/lib/types";

export default async function CartPage() {
  const token = await getAccessToken();

  if (!token) {
    redirect("/login?next=/cart");
  }

  let cart: Cart | null = null;
  let errorMessage: string | null = null;

  try {
    cart = await apiFetch<Cart>("/cart");
  } catch (error) {
    errorMessage =
      error instanceof ApiError
        ? error.message
        : "Unable to load your cart right now.";
  }

  if (errorMessage || !cart) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Cart unavailable
          </h1>
          <p className="mt-4 text-muted-foreground">
            {errorMessage ?? "Unable to load your cart right now."}
          </p>
          <Link
            href="/shop"
            className={buttonVariants({ size: "lg", className: "mt-8" })}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return <CartView initialCart={cart} />;
}
