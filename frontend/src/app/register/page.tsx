"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";

import { registerAction } from "@/app/auth/actions";
import { initialAuthState } from "@/app/auth/state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function RegisterForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialAuthState,
  );

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Shramasa
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Create Account
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Join Shramasa for a more personal care experience.
        </p>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="grid gap-5 sm:grid-cols-2">
          {nextPath ? (
            <input type="hidden" name="next" value={nextPath} />
          ) : null}

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              name="fullName"
              placeholder="Enter your full name"
              autoComplete="name"
              className="h-10"
              minLength={2}
              maxLength={100}
              required
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 00000 00000"
              autoComplete="tel"
              className="h-10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              className="h-10"
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="h-10"
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          {state.error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2"
            >
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full sm:col-span-2"
            disabled={isPending}
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Or
          </span>
          <Separator className="flex-1" />
        </div>

        <Button type="button" variant="outline" size="lg" className="w-full">
          Continue with Google
        </Button>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={
              nextPath
                ? `/login?next=${encodeURIComponent(nextPath)}`
                : "/login"
            }
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
      <Suspense
        fallback={
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                Create Account
              </h1>
            </CardHeader>
          </Card>
        }
      >
        <RegisterForm />
      </Suspense>
    </main>
  );
}
