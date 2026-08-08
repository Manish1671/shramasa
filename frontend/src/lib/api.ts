import { cookies } from "next/headers";

import { API_BASE_URL, AUTH_COOKIE_NAME } from "@/lib/config";
import type { SafeUser } from "@/lib/types";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getErrorMessage(payload: unknown): string {
  if (typeof payload !== "object" || payload === null) {
    return "Something went wrong. Please try again.";
  }

  if (!("message" in payload)) {
    return "Something went wrong. Please try again.";
  }

  const { message } = payload;

  if (typeof message === "string") {
    return message;
  }

  if (
    Array.isArray(message) &&
    message.every((item) => typeof item === "string")
  ) {
    return message.join(". ");
  }

  return "Something went wrong. Please try again.";
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  options?: { auth?: boolean },
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (options?.auth !== false) {
    const token = await getAccessToken();
    if (!token) {
      throw new ApiError("Please sign in to continue.", 401);
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("The service is temporarily unavailable.", 503);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload), response.status);
  }

  return payload as T;
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  try {
    return await apiFetch<SafeUser>("/auth/me");
  } catch {
    return null;
  }
}
