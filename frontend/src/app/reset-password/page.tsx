import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your Shramasa account.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;
  const resetToken = token?.trim().toLowerCase() ?? "";
  const isValidToken = /^[a-f0-9]{64}$/.test(resetToken);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Shramasa
          </p>
          <h1 className="type-h3 mt-3">Choose a new password</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {isValidToken
              ? "Enter a new password for your account. The reset link can be used once."
              : "This reset link is missing or invalid. Request a new one from the forgot password page."}
          </p>
        </CardHeader>

        <CardContent>
          {isValidToken ? (
            <ResetPasswordForm token={resetToken} />
          ) : (
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Forgot password
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
