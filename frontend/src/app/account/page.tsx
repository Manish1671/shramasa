import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/commerce/actions";
import { AccountAddresses } from "@/components/commerce/AccountAddresses";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { ApiError, apiFetch, getCurrentUser } from "@/lib/api";
import type { Address } from "@/lib/types";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  let addresses: Address[] = [];
  let addressesError: string | null = null;

  try {
    addresses = await apiFetch<Address[]>("/addresses");
  } catch (error) {
    addressesError =
      error instanceof ApiError
        ? error.message
        : "Unable to load addresses.";
  }

  return (
    <main className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow">Your space</p>
        <h1 className="type-h2 mt-4">Account</h1>
        <p className="type-body mt-5">
          Manage your profile, addresses, orders, and wishlist.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { href: "/orders", label: "My Orders" },
            { href: "/wishlist", label: "Wishlist" },
            { href: "/cart", label: "Cart" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={buttonVariants({
                variant: "outline",
                className: "h-auto justify-start px-5 py-4",
              })}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Profile</h2>
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Log out
                </Button>
              </form>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="mt-1 font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="mt-1 font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="mt-1 font-medium">{user.phone ?? "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member since</p>
                <p className="mt-1 font-medium">
                  {new Intl.DateTimeFormat("en-IN", {
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(user.createdAt))}
                </p>
              </div>
            </CardContent>
          </Card>

          {addressesError ? (
            <Card>
              <CardContent className="py-6 text-sm text-destructive">
                {addressesError}
              </CardContent>
            </Card>
          ) : (
            <AccountAddresses addresses={addresses} user={user} />
          )}
        </div>
      </div>
    </main>
  );
}
