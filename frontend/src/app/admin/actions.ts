"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiFetch } from "@/lib/api";
import type {
  AdminOrder,
  AdminProduct,
  ContactMessage,
  CreateProductInput,
  OrderStatus,
  UpdateProductInput,
} from "@/lib/types";

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

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/messages");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function createProductAction(
  input: CreateProductInput,
): Promise<ActionResult<AdminProduct>> {
  try {
    const product = await apiFetch<AdminProduct>("/admin/products", {
      method: "POST",
      body: JSON.stringify(input),
    });
    revalidateAdmin();
    return success(product);
  } catch (error) {
    return handleError<AdminProduct>(error);
  }
}

export async function updateProductAction(
  id: string,
  input: UpdateProductInput,
): Promise<ActionResult<AdminProduct>> {
  try {
    const product = await apiFetch<AdminProduct>(`/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    revalidateAdmin();
    revalidatePath(`/admin/products/${id}/edit`);
    return success(product);
  } catch (error) {
    return handleError<AdminProduct>(error);
  }
}

export async function activateProductAction(
  id: string,
): Promise<ActionResult<AdminProduct>> {
  try {
    const product = await apiFetch<AdminProduct>(
      `/admin/products/${id}/activate`,
      { method: "POST" },
    );
    revalidateAdmin();
    return success(product);
  } catch (error) {
    return handleError<AdminProduct>(error);
  }
}

export async function deactivateProductAction(
  id: string,
): Promise<ActionResult<AdminProduct>> {
  try {
    const product = await apiFetch<AdminProduct>(
      `/admin/products/${id}/deactivate`,
      { method: "POST" },
    );
    revalidateAdmin();
    return success(product);
  } catch (error) {
    return handleError<AdminProduct>(error);
  }
}

export async function deleteProductAction(
  id: string,
): Promise<ActionResult<{ success: boolean }>> {
  try {
    const result = await apiFetch<{ success: boolean }>(
      `/admin/products/${id}`,
      { method: "DELETE" },
    );
    revalidateAdmin();
    return success(result);
  } catch (error) {
    return handleError<{ success: boolean }>(error);
  }
}

export async function updateOrderStatusAction(
  id: string,
  status: OrderStatus,
): Promise<ActionResult<AdminOrder>> {
  try {
    const order = await apiFetch<AdminOrder>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    revalidateAdmin();
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath(`/orders/${id}`);
    return success(order);
  } catch (error) {
    return handleError<AdminOrder>(error);
  }
}

export async function markContactMessageReadAction(
  id: string,
): Promise<ActionResult<ContactMessage>> {
  try {
    const message = await apiFetch<ContactMessage>(
      `/admin/contact-messages/${id}/read`,
      { method: "PATCH" },
    );
    revalidateAdmin();
    return success(message);
  } catch (error) {
    return handleError<ContactMessage>(error);
  }
}
