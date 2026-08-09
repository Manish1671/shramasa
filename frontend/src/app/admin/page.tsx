import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiError, apiFetch } from "@/lib/api";
import { formatInr } from "@/lib/format";
import type { AdminStats } from "@/lib/types";

export default async function AdminDashboardPage() {
  let stats: AdminStats | null = null;
  let errorMessage: string | null = null;

  try {
    stats = await apiFetch<AdminStats>("/admin/stats");
  } catch (error) {
    errorMessage =
      error instanceof ApiError
        ? error.message
        : "Unable to load dashboard stats.";
  }

  if (errorMessage || !stats) {
    return (
      <main className="px-6 py-10 sm:px-8 lg:px-10">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-4 text-muted-foreground" role="alert">
          {errorMessage ?? "Unable to load dashboard stats."}
        </p>
      </main>
    );
  }

  const cards = [
    {
      label: "Total products",
      value: String(stats.totalProducts),
      hint: `${stats.activeProducts} active`,
    },
    {
      label: "Total orders",
      value: String(stats.totalOrders),
      hint: `${stats.pendingOrders} in progress`,
    },
    {
      label: "Delivered",
      value: String(stats.deliveredOrders),
      hint: "Completed orders",
    },
    {
      label: "Revenue",
      value: formatInr(stats.totalRevenue),
      hint: "Excludes cancelled",
    },
  ];

  return (
    <main className="px-6 py-10 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A calm snapshot of catalogue and order health.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products/new"
            className={buttonVariants({ size: "sm" })}
          >
            New product
          </Link>
          <Link
            href="/admin/orders"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View orders
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="bg-background/80">
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-3xl font-semibold tracking-tight">
                {card.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{card.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
