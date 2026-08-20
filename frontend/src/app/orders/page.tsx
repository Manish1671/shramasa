import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

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

export default async function OrdersPage() {
  const token = await getAccessToken();

  if (!token) {
    redirect("/login?next=/orders");
  }

  let orders: Order[] | null = null;
  let errorMessage: string | null = null;

  try {
    orders = await apiFetch<Order[]>("/orders");
  } catch (error) {
    errorMessage =
      error instanceof ApiError ? error.message : "Unable to load orders.";
  }

  if (errorMessage || !orders) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-md text-center">
          <h1 className="type-h3">
            Orders unavailable
          </h1>
          <p className="mt-4 text-muted-foreground">
            {errorMessage ?? "Unable to load orders."}
          </p>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted">
            <Package
              className="size-9 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <h1 className="type-h3 mt-8">
            No orders yet
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            When you place an order, it will appear here with tracking and
            details.
          </p>
          <Link
            href="/shop"
            className={buttonVariants({ size: "lg", className: "mt-8" })}
          >
            Start shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="type-h2">
          My Orders
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Review your past and current Shramasa orders.
        </p>

        <div className="mt-12 space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-medium">
                    {formatOrderStatus(order.status)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatInr(order.total)}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3"
                      >
                        <ProductThumb
                          slug={item.product.slug}
                          alt={item.productName}
                          sizes="56px"
                          className="w-14"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {item.productName}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Qty {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {formatInr(item.lineTotal)}
                        </span>
                      </div>
                    ))}
                </div>
                <Separator className="my-5" />
                <Link
                  href={`/orders/${order.id}`}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full sm:w-auto",
                  })}
                >
                  View details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
