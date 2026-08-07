import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
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
          <form className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                name="fullName"
                placeholder="Enter your full name"
                autoComplete="name"
                className="h-10"
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
              />
            </div>

            <Button type="button" size="lg" className="w-full sm:col-span-2">
              Create Account
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
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
