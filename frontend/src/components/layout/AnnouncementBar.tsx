"use client";

import { usePathname } from "next/navigation";

export function AnnouncementBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="bg-primary px-4 py-2.5 text-center text-[0.7rem] tracking-[0.16em] text-primary-foreground uppercase sm:text-xs">
      Complimentary shipping across India
    </div>
  );
}
