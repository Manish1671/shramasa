import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusControls } from "@/components/admin/OrderStatusControls";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApiError, apiFetch } from "@/lib/api";
import { formatInr, formatOrderStatus } from "@/lib/format";
import type { AdminOrder } from "@/lib/types";

type AdminOrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailsPage({
  params,
}: AdminOrderDetailsPageProps) {
  const { id } = await params;

  let order: AdminOrder | null = null;
  let errorMessage: string | null = null;
  let missing = false;

  try {
    order = await apiFetch<AdminOrder>(`/admin/orders/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      missing = true;
    } else {
      errorMessage =
        error instanceof ApiError
          ? error.message
          : "Unable to load this order.";
    }
  }

  if (missing) {
    notFound();
  }

  if (errorMessage || !order) {
    return (
      <main className="px-6 py-10 sm:px-8 lg:px-10">
        <Link
          href="/admin/orders"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          ← Back to orders
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Order unavailable
        </h1>
        <p className="mt-4 text-muted-foreground" role="alert">
          {errorMessage ?? "Unable to load this order."}
        </p>
      </main>
    );
  }

  return (
    <main className="px-6 py-10 sm:px-8 lg:px-10">
      <Link
        href="/admin/orders"
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        ← Back to orders
      </Link>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Order details
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Placed{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <p className="text-sm font-medium">
          {formatOrderStatus(order.status)}
        </p>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Card className="bg-background/80">
            <CardHeader>
              <h2 className="text-lg font-semibold">Items</h2>
            </CardHeader>
            <CardContent className="space-y-5">
              {order.items.map((item) => {
                const image = item.product.images[0];
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[4rem_1fr_auto] items-center gap-4"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={image.altText ?? item.productName}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatInr(item.price)} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatInr(item.lineTotal)}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-background/80">
            <CardHeader>
              <h2 className="text-lg font-semibold">Customer</h2>
            </CardHeader>
            <CardContent className="space-y-1 text-sm leading-6">
              <p className="font-medium">{order.user.name}</p>
              <p className="text-muted-foreground">{order.user.email}</p>
              <p className="text-muted-foreground">{order.user.phone}</p>
            </CardContent>
          </Card>

          <Card className="bg-background/80">
            <CardHeader>
              <h2 className="text-lg font-semibold">Shipping address</h2>
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
        </div>

        <div className="space-y-6">
          <Card className="bg-background/80">
            <CardHeader>
              <h2 className="text-lg font-semibold">Update status</h2>
            </CardHeader>
            <CardContent>
              <OrderStatusControls
                orderId={order.id}
                currentStatus={order.status}
              />
            </CardContent>
          </Card>

          <Card className="bg-background/80">
            <CardHeader>
              <h2 className="text-lg font-semibold">Payment</h2>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Method</span>
                <span>
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : "Online"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Status</span>
                <span>{formatOrderStatus(order.paymentStatus)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80">
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
              {Number(order.discount) > 0 ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-{formatInr(order.discount)}</span>
                </div>
              ) : null}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatInr(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
