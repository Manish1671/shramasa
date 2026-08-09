"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useState, useTransition } from "react";

import {
  createAddressAction,
  placeOrderAction,
} from "@/app/commerce/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { formatInr } from "@/lib/format";
import { productImagePath } from "@/lib/product-image";
import type { Address, Cart, SafeUser } from "@/lib/types";

type CheckoutViewProps = {
  user: SafeUser;
  cart: Cart;
  addresses: Address[];
};

export function CheckoutView({ user, cart, addresses }: CheckoutViewProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((address) => address.isDefault)?.id ??
      addresses[0]?.id ??
      "",
  );
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("COD");
  const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0);

  function handlePlaceOrder() {
    setError(null);

    if (!selectedAddressId) {
      setError("Please select or add a shipping address.");
      return;
    }

    startTransition(async () => {
      const result = await placeOrderAction({
        addressId: selectedAddressId,
        paymentMethod,
      });

      if (!result.ok || !result.data) {
        setError(result.error);
        return;
      }

      router.push(`/orders/${result.data.id}/confirmation`);
      router.refresh();
    });
  }

  function handleCreateAddress(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createAddressAction({
        fullName: String(formData.get("fullName") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        addressLine1: String(formData.get("addressLine1") ?? "").trim(),
        addressLine2: String(formData.get("addressLine2") ?? "").trim() || undefined,
        city: String(formData.get("city") ?? "").trim(),
        state: String(formData.get("state") ?? "").trim(),
        pincode: String(formData.get("pincode") ?? "").trim(),
        isDefault: addresses.length === 0,
      });

      if (!result.ok || !result.data) {
        setError(result.error);
        return;
      }

      setSelectedAddressId(result.data.id);
      setShowNewAddress(false);
      router.refresh();
    });
  }

  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">
          Checkout
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Complete your details to place your order securely.
        </p>

        {error ? (
          <p className="mt-6 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-8">
            <Card>
              <CardHeader>
              <h2 className="font-heading text-2xl">Contact</h2>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Name</Label>
                  <Input value={user.name} disabled className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user.email} disabled className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={user.phone} disabled className="h-10" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <h2 className="font-heading text-2xl">Shipping Address</h2>
                {addresses.length > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewAddress((value) => !value)}
                  >
                    {showNewAddress ? "Use saved address" : "Add new"}
                  </Button>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-6">
                {!showNewAddress && addresses.length > 0 ? (
                  <RadioGroup
                    value={selectedAddressId}
                    onValueChange={(value) =>
                      setSelectedAddressId(value ?? "")
                    }
                    className="gap-3"
                  >
                    {addresses.map((address) => (
                      <Label
                        key={address.id}
                        htmlFor={`address-${address.id}`}
                        className="items-start rounded-xl border border-border p-4"
                      >
                        <RadioGroupItem
                          id={`address-${address.id}`}
                          value={address.id}
                        />
                        <span>
                          <span className="block font-medium">
                            {address.fullName}
                            {address.isDefault ? (
                              <span className="ml-2 text-xs font-normal text-muted-foreground">
                                Default
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-1 block text-sm font-normal text-muted-foreground">
                            {address.addressLine1}
                            {address.addressLine2
                              ? `, ${address.addressLine2}`
                              : ""}
                            , {address.city}, {address.state} {address.pincode}
                          </span>
                          <span className="mt-1 block text-sm font-normal text-muted-foreground">
                            {address.phone}
                          </span>
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                ) : (
                  <form action={handleCreateAddress} className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        name="fullName"
                        required
                        defaultValue={user.name}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        required
                        defaultValue={user.phone}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address-line-1">Address Line 1</Label>
                      <Input
                        id="address-line-1"
                        name="addressLine1"
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address-line-2">Address Line 2</Label>
                      <Input
                        id="address-line-2"
                        name="addressLine2"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" required className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2 sm:max-w-xs">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        required
                        inputMode="numeric"
                        pattern="\d{6}"
                        className="h-10"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Button type="submit" disabled={pending}>
                        {pending ? "Saving..." : "Save address"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-heading text-2xl">Payment Method</h2>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod((value as "COD" | "RAZORPAY") ?? "COD")
                  }
                  className="gap-3"
                >
                  <Label
                    htmlFor="payment-cod"
                    className="rounded-xl border border-border p-4"
                  >
                    <RadioGroupItem id="payment-cod" value="COD" />
                    Cash on Delivery
                  </Label>
                  <Label
                    htmlFor="payment-razorpay"
                    className="rounded-xl border border-border p-4 opacity-70"
                  >
                    <RadioGroupItem id="payment-razorpay" value="RAZORPAY" />
                    <span>
                      <span className="block">Pay Online</span>
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">
                        Razorpay (coming soon)
                      </span>
                    </span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-24" aria-label="Order summary">
            <Card>
              <CardHeader>
                <h2 className="font-heading text-2xl">Order Summary</h2>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {cart.items.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={productImagePath(item.product.slug)}
                            alt={
                              item.product.images[0]?.altText ??
                              item.product.name
                            }
                            fill
                            unoptimized
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">
                            {item.product.name}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Qty {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {formatInr(item.lineTotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatInr(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-semibold">
                      {formatInr(cart.total)}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  disabled={pending || cart.items.length === 0}
                  onClick={handlePlaceOrder}
                >
                  {pending ? "Placing order..." : "Place Order"}
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-6 rounded-xl border border-border p-5">
              <h2 className="font-semibold">Secure Checkout</h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                {[
                  "100% Secure Payments",
                  "SSL Protected",
                  "Easy Returns",
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <Check className="size-4" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
