"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateOrderStatusAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatOrderStatus } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

type OrderStatusControlsProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

export function OrderStatusControls({
  orderId,
  currentStatus,
}: OrderStatusControlsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const locked =
    currentStatus === "DELIVERED" || currentStatus === "CANCELLED";

  function handleUpdate() {
    if (status === currentStatus) {
      setMessage("Status is already set.");
      return;
    }

    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, status);
      if (!result.ok) {
        setError(result.error ?? "Unable to update status.");
        return;
      }
      setMessage(`Updated to ${formatOrderStatus(status)}.`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="order-status">Order status</Label>
        <select
          id="order-status"
          value={status}
          disabled={locked || pending}
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
          className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        >
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {formatOrderStatus(value)}
            </option>
          ))}
        </select>
        {locked ? (
          <p className="text-xs text-muted-foreground">
            {formatOrderStatus(currentStatus)} orders cannot change status.
          </p>
        ) : null}
      </div>

      <Button
        type="button"
        disabled={locked || pending || status === currentStatus}
        onClick={handleUpdate}
      >
        {pending ? "Updating..." : "Update status"}
      </Button>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
