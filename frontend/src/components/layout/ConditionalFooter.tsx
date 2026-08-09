"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Client gate only — pass Footer as children so it stays a Server Component
 * and is not re-executed as part of the client bundle (avoids SSR/client
 * date and markup drift in the footer).
 */
export function ConditionalFooter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return children;
}
