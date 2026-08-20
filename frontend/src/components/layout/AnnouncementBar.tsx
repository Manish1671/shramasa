"use client";

import { usePathname } from "next/navigation";

export function AnnouncementBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      className={
        pathname === "/"
          ? "fixed inset-x-0 top-0 z-[60] h-9 bg-primary px-4 py-2 text-center text-[0.65rem] tracking-[0.2em] text-primary-foreground uppercase sm:text-[0.7rem]"
          : "h-9 bg-primary px-4 py-2 text-center text-[0.65rem] tracking-[0.2em] text-primary-foreground uppercase sm:text-[0.7rem]"
      }
    >
      Complimentary shipping across India
    </div>
  );
}
