"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  activateProductAction,
  deactivateProductAction,
  deleteProductAction,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

type ProductRowActionsProps = {
  productId: string;
  isActive: boolean;
};

export function ProductRowActions({
  productId,
  isActive,
}: ProductRowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(
    action: () => Promise<{ ok: boolean; error: string | null }>,
  ) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error ?? "Action failed.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-2">
        {isActive ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => run(() => deactivateProductAction(productId))}
          >
            Deactivate
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => run(() => activateProductAction(productId))}
          >
            Activate
          </Button>
        )}
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={pending}
          onClick={() => {
            if (
              !window.confirm(
                "Delete this product? This cannot be undone if it has no orders.",
              )
            ) {
              return;
            }
            run(() => deleteProductAction(productId));
          }}
        >
          Delete
        </Button>
      </div>
      {error ? (
        <p className="max-w-48 text-right text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
