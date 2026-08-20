"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type {
  AuthActionState,
  PasswordResetActionState,
} from "@/app/auth/state";
import { API_BASE_URL, AUTH_COOKIE_NAME } from "@/lib/config";

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

async function completeAuthFromResponse(
  response: Response,
  persistent: boolean,
  nextPath: string | null,
): Promise<AuthActionState> {
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
  cookieStore.set(AUTH_COOKIE_NAME, accessToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    ...(persistent ? { maxAge: accessTokenLifetimeSeconds } : {}),
  });

  redirect(resolveRedirectPath(nextPath));
}

async function authenticate(
  endpoint: "login" | "register" | "google",
  body: Record<string, string>,
  persistent: boolean,
  nextPath: string | null,
): Promise<AuthActionState> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
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

  return completeAuthFromResponse(response, persistent, nextPath);
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

export async function googleAuthAction(
  idToken: string,
  nextPath: string | null,
): Promise<AuthActionState> {
  const token = idToken.trim();

  if (!token) {
    return {
      error: "Google Sign-In was cancelled. Please try again.",
    };
  }

  return authenticate(
    "google",
    {
      idToken: token,
    },
    true,
    nextPath,
  );
}

export async function forgotPasswordAction(
  _previousState: PasswordResetActionState,
  formData: FormData,
): Promise<PasswordResetActionState> {
  const email = getFormValue(formData, "email").toLowerCase();

  if (!email) {
    return {
      error: "Please enter the email on your account.",
      success: false,
    };
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });
  } catch {
    return {
      error: "The authentication service is unavailable. Please try again.",
      success: false,
    };
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      error: getErrorMessage(payload),
      success: false,
    };
  }

  return {
    error: null,
    success: true,
  };
}

export async function resetPasswordAction(
  _previousState: PasswordResetActionState,
  formData: FormData,
): Promise<PasswordResetActionState> {
  const token = getFormValue(formData, "token").toLowerCase();
  const password = getFormValue(formData, "password");
  const confirmPassword = getFormValue(formData, "confirmPassword");

  if (!token) {
    return {
      error: "This reset link is invalid or has expired.",
      success: false,
    };
  }

  if (!password || !confirmPassword) {
    return {
      error: "Please choose a new password.",
      success: false,
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match.",
      success: false,
    };
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
      cache: "no-store",
    });
  } catch {
    return {
      error: "The authentication service is unavailable. Please try again.",
      success: false,
    };
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      error: getErrorMessage(payload),
      success: false,
    };
  }

  redirect("/login?reset=1");
}
