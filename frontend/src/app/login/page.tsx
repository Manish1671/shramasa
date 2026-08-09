"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";

import { loginAction } from "@/app/auth/actions";
import { initialAuthState } from "@/app/auth/state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialAuthState,
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Shramasa
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sign in to continue your premium care experience.
        </p>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          {nextPath ? (
            <input type="hidden" name="next" value={nextPath} />
          ) : null}

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className="h-10"
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label
              htmlFor="remember-me"
              className="font-normal text-muted-foreground"
            >
              <Checkbox id="remember-me" name="rememberMe" value="true" />
              Remember Me
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {state.error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Signing In..." : "Login"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={
              nextPath
                ? `/register?next=${encodeURIComponent(nextPath)}`
                : "/register"
            }
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome Back
              </h1>
            </CardHeader>
          </Card>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
