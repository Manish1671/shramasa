import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductThumb } from "@/components/commerce/ProductThumb";
import { ApiError, apiFetch, getAccessToken } from "@/lib/api";
import { formatInr, formatOrderStatus } from "@/lib/format";
import type { Order } from "@/lib/types";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;
  const token = await getAccessToken();

  if (!token) {
    redirect(`/login?next=/orders/${id}`);
  }

  let order: Order | null = null;
  let errorMessage: string | null = null;
  let notFoundOrder = false;

  try {
    order = await apiFetch<Order>(`/orders/${id}`);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 404 || error.status === 403)
    ) {
      notFoundOrder = true;
    } else {
      errorMessage =
        error instanceof ApiError
          ? error.message
          : "Unable to load this order.";
    }
  }

  if (notFoundOrder) {
    notFound();
  }

  if (errorMessage || !order) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-md text-center">
          <h1 className="type-h3">
            Order unavailable
          </h1>
          <p className="mt-4 text-muted-foreground">
            {errorMessage ?? "Unable to load this order."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Order details
        </p>
        <h1 className="type-h2 mt-3">
          Order #{order.id.slice(-8).toUpperCase()}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Items</h2>
            </CardHeader>
            <CardContent className="space-y-5">
              {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-4"
                  >
                    <Link href={`/shop/${item.product.slug}`} className="w-[4.5rem]">
                      <ProductThumb
                        slug={item.product.slug}
                        alt={item.productName}
                        sizes="72px"
                        className="w-[4.5rem]"
                      />
                    </Link>
                    <div>
                      <Link
                        href={`/shop/${item.product.slug}`}
                        className="font-medium hover:underline"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatInr(item.price)} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatInr(item.lineTotal)}
                    </span>
                  </div>
                ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Status</h2>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Order</span>
                  <span>{formatOrderStatus(order.status)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Payment</span>
                  <span>
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Payment status</span>
                  <span>{formatOrderStatus(order.paymentStatus)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Shipping</h2>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                <p className="font-medium text-foreground">
                  {order.address.fullName}
                </p>
                <p>{order.address.addressLine1}</p>
                {order.address.addressLine2 ? (
                  <p>{order.address.addressLine2}</p>
                ) : null}
                <p>
                  {order.address.city}, {order.address.state}{" "}
                  {order.address.pincode}
                </p>
                <p>{order.address.phone}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Totals</h2>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatInr(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {Number(order.shipping) === 0
                      ? "Free"
                      : formatInr(order.shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatInr(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/orders" className={buttonVariants({ variant: "outline" })}>
            Back to orders
          </Link>
          <Link href="/shop" className={buttonVariants()}>
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
