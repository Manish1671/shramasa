import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ApiError, apiFetch } from "@/lib/api";
import { formatInr, formatOrderStatus } from "@/lib/format";
import type { AdminOrder, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUSES: Array<OrderStatus | ""> = [
  "",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

type OrdersPageProps = {
  searchParams: Promise<{ status?: string }>;
};

function isOrderStatus(value: string): value is OrderStatus {
  return (
    value === "PENDING" ||
    value === "CONFIRMED" ||
    value === "PROCESSING" ||
    value === "SHIPPED" ||
    value === "DELIVERED" ||
    value === "CANCELLED"
  );
}

export default async function AdminOrdersPage({
  searchParams,
}: OrdersPageProps) {
  const params = await searchParams;
  const statusParam = params.status ?? "";
  const status = isOrderStatus(statusParam) ? statusParam : "";

  let orders: AdminOrder[] = [];
  let errorMessage: string | null = null;

  try {
    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    orders = await apiFetch<AdminOrder[]>(`/admin/orders${qs}`);
  } catch (error) {
    errorMessage =
      error instanceof ApiError ? error.message : "Unable to load orders.";
  }

  return (
    <main className="px-6 py-10 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Fulfillment
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Orders
          </h1>
        </div>
      </div>

      <form
        method="get"
        className="mt-8 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-background/80 p-4"
      >
        <div className="min-w-48 flex-1">
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {STATUSES.map((value) => (
              <option key={value || "all"} value={value}>
                {value ? formatOrderStatus(value) : "All statuses"}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "outline" }), "h-10")}
        >
          Filter
        </button>
      </form>

      {errorMessage ? (
        <p className="mt-8 text-muted-foreground" role="alert">
          {errorMessage}
        </p>
      ) : orders.length === 0 ? (
        <div className="mt-16 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            No orders found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Orders will appear here as customers check out.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-background">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-stone-50/80 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-4 font-medium">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-4">
                    <p>{order.user.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.user.email}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    {formatOrderStatus(order.status)}
                  </td>
                  <td className="px-4 py-4">{formatInr(order.total)}</td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
