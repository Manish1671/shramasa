"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/commerce/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Address, SafeUser } from "@/lib/types";

type AccountAddressesProps = {
  addresses: Address[];
  user: SafeUser;
};

export function AccountAddresses({ addresses, user }: AccountAddressesProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(addresses.length === 0);

  function handleCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createAddressAction({
        fullName: String(formData.get("fullName") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        addressLine1: String(formData.get("addressLine1") ?? "").trim(),
        addressLine2:
          String(formData.get("addressLine2") ?? "").trim() || undefined,
        city: String(formData.get("city") ?? "").trim(),
        state: String(formData.get("state") ?? "").trim(),
        pincode: String(formData.get("pincode") ?? "").trim(),
        isDefault: formData.get("isDefault") === "on" || addresses.length === 0,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setShowForm(false);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Addresses</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowForm((value) => !value)}
        >
          {showForm ? "Close" : "Add address"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {showForm ? (
          <form action={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="account-full-name">Full Name</Label>
              <Input
                id="account-full-name"
                name="fullName"
                defaultValue={user.name}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="account-phone">Phone</Label>
              <Input
                id="account-phone"
                name="phone"
                defaultValue={user.phone ?? ""}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="account-line-1">Address Line 1</Label>
              <Input
                id="account-line-1"
                name="addressLine1"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="account-line-2">Address Line 2</Label>
              <Input id="account-line-2" name="addressLine2" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-city">City</Label>
              <Input id="account-city" name="city" required className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-state">State</Label>
              <Input
                id="account-state"
                name="state"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-pincode">Pincode</Label>
              <Input
                id="account-pincode"
                name="pincode"
                required
                pattern="\d{6}"
                className="h-10"
              />
            </div>
            <div className="flex items-center gap-2 self-end">
              <input id="account-default" name="isDefault" type="checkbox" />
              <Label htmlFor="account-default">Set as default</Label>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save address"}
              </Button>
            </div>
          </form>
        ) : null}

        {addresses.length === 0 && !showForm ? (
          <p className="text-sm text-muted-foreground">
            No saved addresses yet.
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address, index) => (
              <div key={address.id}>
                {index > 0 ? <Separator className="mb-4" /> : null}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium">
                      {address.fullName}
                      {address.isDefault ? (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          Default
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {address.addressLine1}
                      {address.addressLine2
                        ? `, ${address.addressLine2}`
                        : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} {address.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.phone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!address.isDefault ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            const result = await setDefaultAddressAction(
                              address.id,
                            );
                            if (!result.ok) {
                              setError(result.error);
                              return;
                            }
                            router.refresh();
                          })
                        }
                      >
                        Set default
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          const result = await deleteAddressAction(address.id);
                          if (!result.ok) {
                            setError(result.error);
                            return;
                          }
                          router.refresh();
                        })
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Manage wishlist and orders from the links above, or{" "}
          <Link href="/checkout" className="underline underline-offset-4">
            continue to checkout
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
