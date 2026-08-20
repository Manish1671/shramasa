"use client";

import Link from "next/link";
import { useActionState } from "react";

import { forgotPasswordAction } from "@/app/auth/actions";
import { initialPasswordResetState } from "@/app/auth/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    initialPasswordResetState,
  );

  if (state.success) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm leading-6 text-muted-foreground">
          If an account exists for that email, we sent reset instructions. The
          link expires in one hour.
        </p>
        {process.env.NODE_ENV !== "production" ? (
          <p className="text-xs leading-5 text-muted-foreground">
            In local development without SMTP, the link is printed in the
            backend terminal.
          </p>
        ) : null}
        <Link
          href="/login"
          className="inline-flex text-sm font-medium underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className="h-10"
          required
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
