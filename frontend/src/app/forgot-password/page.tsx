import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Shramasa
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Forgot Password?
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Enter your email and we&apos;ll send you a secure password reset
            link.
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

            <Button type="button" size="lg" className="w-full">
              Send Reset Link
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
