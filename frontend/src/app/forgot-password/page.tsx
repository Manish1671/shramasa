import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiError, apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset the password for your Shramasa account.",
};

async function isPasswordResetAvailable(): Promise<boolean> {
  try {
    const status = await apiFetch<{ emailDelivery: boolean }>(
      "/auth/password-reset-status",
      {},
      { auth: false },
    );
    return status.emailDelivery;
  } catch (error) {
    if (error instanceof ApiError) {
      return false;
    }
    return false;
  }
}

export default async function ForgotPasswordPage() {
  const emailDelivery = await isPasswordResetAvailable();

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Shramasa
          </p>
          <h1 className="type-h3 mt-3">Forgot password?</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {emailDelivery
              ? "Enter the email on your account. If you signed in with Google, use Google on the login page instead."
              : "Password reset emails are not active yet. If you use Google Sign-In, return to login and continue with Google. If you registered with email, write to us from the contact page and we will help you regain access."}
          </p>
        </CardHeader>

        <CardContent>
          {emailDelivery ? (
            <ForgotPasswordForm />
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
              >
                Contact us
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full",
                )}
              >
                Back to login
              </Link>
            </div>
          )}

          {emailDelivery ? (
            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to login
              </Link>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
