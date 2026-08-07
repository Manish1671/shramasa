import { Check } from "lucide-react";

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

const orderItems = [
  {
    name: "Radiance Renewal Serum",
    variant: "30 ml · Quantity 1",
    price: "₹899",
  },
  {
    name: "Daily Defense Sunscreen",
    variant: "50 g · Quantity 1",
    price: "₹749",
  },
  {
    name: "Strengthening Hair Oil",
    variant: "100 ml · Quantity 2",
    price: "₹1,298",
  },
];

export default function CheckoutPage() {
  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Checkout
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Complete your details to place your order securely.
        </p>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Shipping Details</h2>
            </CardHeader>

            <CardContent>
              <form className="space-y-10">
                <fieldset>
                  <legend className="text-lg font-semibold">Contact</legend>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
                  </div>
                </fieldset>

                <Separator />

                <fieldset>
                  <legend className="text-lg font-semibold">
                    Shipping Address
                  </legend>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address-line-1">Address Line 1</Label>
                      <Input
                        id="address-line-1"
                        name="addressLine1"
                        placeholder="House number and street"
                        autoComplete="address-line1"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address-line-2">Address Line 2</Label>
                      <Input
                        id="address-line-2"
                        name="addressLine2"
                        placeholder="Apartment, suite, or landmark"
                        autoComplete="address-line2"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="City"
                        autoComplete="address-level2"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="State"
                        autoComplete="address-level1"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2 sm:max-w-xs">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        inputMode="numeric"
                        placeholder="000000"
                        autoComplete="postal-code"
                        className="h-10"
                      />
                    </div>
                  </div>
                </fieldset>

                <Separator />

                <fieldset>
                  <legend className="text-lg font-semibold">
                    Delivery Method
                  </legend>
                  <RadioGroup
                    name="deliveryMethod"
                    defaultValue="standard"
                    className="mt-6 grid gap-4 sm:grid-cols-2"
                  >
                    <Label
                      htmlFor="standard-delivery"
                      className="items-start rounded-xl border border-border p-4"
                    >
                      <RadioGroupItem
                        id="standard-delivery"
                        value="standard"
                      />
                      <span>
                        <span className="block">Standard Delivery</span>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">
                          3–5 business days
                        </span>
                      </span>
                    </Label>
                    <Label
                      htmlFor="express-delivery"
                      className="items-start rounded-xl border border-border p-4"
                    >
                      <RadioGroupItem id="express-delivery" value="express" />
                      <span>
                        <span className="block">Express Delivery</span>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">
                          1–2 business days
                        </span>
                      </span>
                    </Label>
                  </RadioGroup>
                </fieldset>

                <Separator />

                <fieldset>
                  <legend className="text-lg font-semibold">
                    Payment Method
                  </legend>
                  <RadioGroup
                    name="paymentMethod"
                    defaultValue="card"
                    className="mt-6 gap-3"
                  >
                    {[
                      ["card", "Credit/Debit Card"],
                      ["upi", "UPI"],
                      ["cash", "Cash on Delivery"],
                    ].map(([value, label]) => (
                      <Label
                        key={value}
                        htmlFor={`payment-${value}`}
                        className="rounded-xl border border-border p-4"
                      >
                        <RadioGroupItem
                          id={`payment-${value}`}
                          value={value}
                        />
                        {label}
                      </Label>
                    ))}
                  </RadioGroup>
                </fieldset>
              </form>
            </CardContent>
          </Card>

          <aside className="lg:sticky lg:top-24" aria-label="Order summary">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3"
                    >
                      <div
                        role="img"
                        aria-label={`${item.name} image placeholder`}
                        className="flex aspect-square items-center justify-center rounded-lg bg-muted text-[0.625rem] text-muted-foreground"
                      >
                        Image
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.variant}
                        </p>
                      </div>
                      <span className="text-sm font-medium">{item.price}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="promo-code">Promo Code</Label>
                  <Input
                    id="promo-code"
                    name="promoCode"
                    placeholder="Enter promo code"
                    className="h-10"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹2,946</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span>−₹200</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-semibold">₹2,746</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="button" size="lg" className="w-full">
                  Place Order
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-6 rounded-xl border border-border p-5">
              <h2 className="font-semibold">🔒 Secure Checkout</h2>
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
