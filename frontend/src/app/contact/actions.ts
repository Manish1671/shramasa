"use server";

import { ApiError, apiFetch } from "@/lib/api";

export type ContactActionResult = {
  ok: boolean;
  error: string | null;
};

export async function submitContactAction(input: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactActionResult> {
  try {
    await apiFetch<{ success: boolean }>(
      "/contact",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
      { auth: false },
    );
    return { ok: true, error: null };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return {
      ok: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
