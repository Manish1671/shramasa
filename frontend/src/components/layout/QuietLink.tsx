import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type QuietLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Inverts to ivory for use over hero photography. */
  onDark?: boolean;
};

/** The single "read more" affordance used across the storefront. */
export function QuietLink({
  href,
  children,
  className,
  onDark = false,
}: QuietLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "link-quiet group",
        onDark && "text-primary-foreground/85 hover:text-primary-foreground",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
      >
        →
      </span>
    </Link>
  );
}
