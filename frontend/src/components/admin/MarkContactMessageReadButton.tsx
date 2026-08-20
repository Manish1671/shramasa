"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { markContactMessageReadAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

type MarkContactMessageReadButtonProps = {
  messageId: string;
};

export function MarkContactMessageReadButton({
  messageId,
}: MarkContactMessageReadButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await markContactMessageReadAction(messageId);
      if (!result.ok) {
        setError(result.error ?? "Unable to mark as read.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={handleClick}
      >
        {pending ? "Saving..." : "Mark as read"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
