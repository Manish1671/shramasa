"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ApiError, apiFetch, getAccessToken } from "@/lib/api";
import { AUTH_COOKIE_NAME } from "@/lib/config";
import type { Address, Cart, Order, Wishlist } from "@/lib/types";

export type ActionResult<T = null> = {
  ok: boolean;
  error: string | null;
  data: T | null;
};

function failure<T>(error: string): ActionResult<T> {
  return { ok: false, error, data: null };
}

function success<T>(data: T): ActionResult<T> {
  return { ok: true, error: null, data };
}

function handleError<T>(error: unknown): ActionResult<T> {
  if (error instanceof ApiError) {
    return failure<T>(error.message);
  }
  return failure<T>("Something went wrong. Please try again.");
}

function revalidateCommerce() {
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/wishlist");
  revalidatePath("/account");
  revalidatePath("/orders");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}

export async function addToCartAction(
  productId: string,
  quantity = 1,
): Promise<ActionResult<Cart>> {
  const token = await getAccessToken();
  if (!token) {
    return failure("Please sign in to add items to your cart.");
  }

  try {
    const cart = await apiFetch<Cart>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    revalidateCommerce();
    return success(cart);
  } catch (error) {
    return handleError<Cart>(error);
  }
}

export async function updateCartItemAction(
  productId: string,
  quantity: number,
): Promise<ActionResult<Cart>> {
  try {
    const cart = await apiFetch<Cart>(`/cart/items/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
    revalidateCommerce();
    return success(cart);
  } catch (error) {
    return handleError<Cart>(error);
  }
}

export async function removeCartItemAction(
  productId: string,
): Promise<ActionResult<Cart>> {
  try {
    const cart = await apiFetch<Cart>(`/cart/items/${productId}`, {
      method: "DELETE",
    });
    revalidateCommerce();
    return success(cart);
  } catch (error) {
    return handleError<Cart>(error);
  }
}

export async function clearCartAction(): Promise<ActionResult<Cart>> {
  try {
    const cart = await apiFetch<Cart>("/cart", {
      method: "DELETE",
    });
    revalidateCommerce();
    return success(cart);
  } catch (error) {
    return handleError<Cart>(error);
  }
}

export async function addToWishlistAction(
  productId: string,
): Promise<ActionResult<Wishlist>> {
  const token = await getAccessToken();
  if (!token) {
    return failure("Please sign in to save items to your wishlist.");
  }

  try {
    const wishlist = await apiFetch<Wishlist>("/wishlist/items", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    revalidateCommerce();
    return success(wishlist);
  } catch (error) {
    return handleError<Wishlist>(error);
  }
}

export async function removeFromWishlistAction(
  productId: string,
): Promise<ActionResult<Wishlist>> {
  try {
    const wishlist = await apiFetch<Wishlist>(`/wishlist/items/${productId}`, {
      method: "DELETE",
    });
    revalidateCommerce();
    return success(wishlist);
  } catch (error) {
    return handleError<Wishlist>(error);
  }
}

export async function createAddressAction(input: {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}): Promise<ActionResult<Address>> {
  try {
    const address = await apiFetch<Address>("/addresses", {
      method: "POST",
      body: JSON.stringify(input),
    });
    revalidatePath("/account");
    revalidatePath("/checkout");
    return success(address);
  } catch (error) {
    return handleError<Address>(error);
  }
}

export async function updateAddressAction(
  addressId: string,
  input: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string | null;
    city?: string;
    state?: string;
    pincode?: string;
    isDefault?: boolean;
  },
): Promise<ActionResult<Address>> {
  try {
    const address = await apiFetch<Address>(`/addresses/${addressId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    revalidatePath("/account");
    revalidatePath("/checkout");
    return success(address);
  } catch (error) {
    return handleError<Address>(error);
  }
}

export async function setDefaultAddressAction(
  addressId: string,
): Promise<ActionResult<Address>> {
  try {
    const address = await apiFetch<Address>(`/addresses/${addressId}/default`, {
      method: "POST",
    });
    revalidatePath("/account");
    revalidatePath("/checkout");
    return success(address);
  } catch (error) {
    return handleError<Address>(error);
  }
}

export async function deleteAddressAction(
  addressId: string,
): Promise<ActionResult<{ success: boolean }>> {
  try {
    const result = await apiFetch<{ success: boolean }>(
      `/addresses/${addressId}`,
      { method: "DELETE" },
    );
    revalidatePath("/account");
    revalidatePath("/checkout");
    return success(result);
  } catch (error) {
    return handleError<{ success: boolean }>(error);
  }
}

export async function placeOrderAction(input: {
  addressId: string;
  paymentMethod: "COD" | "RAZORPAY";
}): Promise<ActionResult<Order>> {
  try {
    const order = await apiFetch<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(input),
    });
    revalidateCommerce();
    return success(order);
  } catch (error) {
    return handleError<Order>(error);
  }
}
