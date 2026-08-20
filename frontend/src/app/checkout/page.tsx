import Link from "next/link";
import { redirect } from "next/navigation";

import { CheckoutView } from "@/components/commerce/CheckoutView";
import { buttonVariants } from "@/components/ui/button";
import { ApiError, apiFetch, getCurrentUser } from "@/lib/api";
import type { Address, Cart } from "@/lib/types";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/checkout");
  }

  let cart: Cart | null = null;
  let addresses: Address[] = [];
  let errorMessage: string | null = null;

  try {
    const [cartResult, addressResult] = await Promise.all([
      apiFetch<Cart>("/cart"),
      apiFetch<Address[]>("/addresses"),
    ]);
    cart = cartResult;
    addresses = addressResult;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?next=/checkout");
    }

    errorMessage =
      error instanceof ApiError
        ? error.message
        : "Unable to load checkout right now.";
  }

  if (errorMessage || !cart) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-md text-center">
          <h1 className="type-h3">
            Checkout unavailable
          </h1>
          <p className="mt-4 text-muted-foreground">
            {errorMessage ?? "Unable to load checkout right now."}
          </p>
          <Link
            href="/cart"
            className={buttonVariants({ size: "lg", className: "mt-8" })}
          >
            Return to cart
          </Link>
        </div>
      </main>
    );
  }

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  return <CheckoutView user={user} cart={cart} addresses={addresses} />;
}
