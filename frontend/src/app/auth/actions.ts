"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthActionState } from "@/app/auth/state";

const authApiUrl = "http://localhost:4000/auth";
const authCookieName = "shramasa_access_token";
const accessTokenLifetimeSeconds = 60 * 60 * 24;

function getFormValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
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

function getAccessToken(payload: unknown): string | null {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "accessToken" in payload &&
    typeof payload.accessToken === "string"
  ) {
    return payload.accessToken;
  }

  return null;
}

function resolveRedirectPath(nextPath: string | null): string {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/";
  }

  return nextPath;
}

async function authenticate(
  endpoint: "login" | "register",
  body: Record<string, string>,
  persistent: boolean,
  nextPath: string | null,
): Promise<AuthActionState> {
  let response: Response;

  try {
    response = await fetch(`${authApiUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return {
      error: "The authentication service is unavailable. Please try again.",
    };
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      error: getErrorMessage(payload),
    };
  }

  const accessToken = getAccessToken(payload);

  if (!accessToken) {
    return {
      error: "The authentication service returned an invalid response.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(authCookieName, accessToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    ...(persistent ? { maxAge: accessTokenLifetimeSeconds } : {}),
  });

  redirect(resolveRedirectPath(nextPath));
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getFormValue(formData, "email").toLowerCase();
  const password = getFormValue(formData, "password");
  const rememberMe = getFormValue(formData, "rememberMe") === "true";
  const nextPath = getFormValue(formData, "next") || null;

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  return authenticate(
    "login",
    {
      email,
      password,
    },
    rememberMe,
    nextPath,
  );
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = getFormValue(formData, "fullName");
  const email = getFormValue(formData, "email").toLowerCase();
  const phone = getFormValue(formData, "phone");
  const password = getFormValue(formData, "password");
  const confirmPassword = getFormValue(formData, "confirmPassword");
  const nextPath = getFormValue(formData, "next") || null;

  if (!name || !email || !phone || !password || !confirmPassword) {
    return {
      error: "Please complete all required fields.",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match.",
    };
  }

  return authenticate(
    "register",
    {
      name,
      email,
      phone,
      password,
    },
    false,
    nextPath,
  );
}
