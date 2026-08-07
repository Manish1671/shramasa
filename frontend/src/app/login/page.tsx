import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
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
          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="h-10"
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
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <Label
                htmlFor="remember-me"
                className="font-normal text-muted-foreground"
              >
                <Checkbox id="remember-me" name="rememberMe" />
                Remember Me
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="button" size="lg" className="w-full">
              Login
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
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
