import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { ApiError, apiFetch, getAccessToken } from "@/lib/api";
import { formatInr, formatOrderStatus } from "@/lib/format";
import type { Order } from "@/lib/types";

type ConfirmationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { id } = await params;
  const token = await getAccessToken();

  if (!token) {
    redirect(`/login?next=/orders/${id}/confirmation`);
  }

  let order: Order | null = null;
  let errorMessage: string | null = null;
  let missing = false;

  try {
    order = await apiFetch<Order>(`/orders/${id}`);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 404 || error.status === 403)
    ) {
      missing = true;
    } else {
      errorMessage =
        error instanceof ApiError
          ? error.message
          : "Unable to load confirmation.";
    }
  }

  if (missing) {
    redirect("/orders");
  }

  if (errorMessage || !order) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Confirmation unavailable
          </h1>
          <p className="mt-4 text-muted-foreground">
            {errorMessage ?? "Unable to load confirmation."}
          </p>
          <Link href="/orders" className={buttonVariants({ className: "mt-8" })}>
            Go to my orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
          <Check className="size-7" aria-hidden="true" />
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight">
          Order confirmed
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Thank you for choosing Shramasa. Your order{" "}
          <span className="font-medium text-foreground">
            #{order.id.slice(-8).toUpperCase()}
          </span>{" "}
          is {formatOrderStatus(order.status).toLowerCase()}.
        </p>

        <Card className="mt-12 text-left">
          <CardHeader>
            <h2 className="text-xl font-semibold">Order summary</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span className="font-medium">{formatInr(item.lineTotal)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-semibold">
                {formatInr(order.total)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Payment:{" "}
              {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : "Online payment"}
            </p>
          </CardContent>
        </Card>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href={`/orders/${order.id}`}
            className={buttonVariants({ size: "lg" })}
          >
            View order details
          </Link>
          <Link
            href="/shop"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
