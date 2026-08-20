import Link from "next/link";

import { ProductPhotoFrame } from "@/components/commerce/ProductPhotoFrame";
import type { NavItem } from "@/lib/nav-menu";
import { productImagePath } from "@/lib/product-image";
import { cn } from "@/lib/utils";

type MegaMenuProps = {
  item: NavItem;
};

export function MegaMenu({ item }: MegaMenuProps) {
  const mega = item.mega;
  if (!mega) return null;

  const columnCount = mega.columns.length + (mega.featured ? 1 : 0);

  return (
    <div
      id={`mega-${item.id}`}
      role="region"
      aria-label={`${item.label} menu`}
      className="mega-panel border-t border-border bg-card text-foreground"
    >
      <div
        className={cn(
          "mx-auto grid max-w-[80rem] gap-10 px-6 py-12 sm:px-8 lg:gap-14 lg:px-10 lg:py-14",
          columnCount >= 4
            ? "lg:grid-cols-4"
            : columnCount === 3
              ? "lg:grid-cols-3"
              : "lg:grid-cols-2",
        )}
      >
        {mega.columns.map((column) => (
          <div key={column.title}>
            <p className="eyebrow">{column.title}</p>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-[0.95rem] leading-6 text-foreground transition-colors duration-300 hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {mega.featured ? (
          <Link href={mega.featured.href} className="group block lg:pl-2">
            <ProductPhotoFrame
              src={productImagePath(mega.featured.href.replace("/shop/", ""))}
              alt=""
              slug={mega.featured.href.replace("/shop/", "")}
            />
            <p className="eyebrow mt-4">{mega.featured.eyebrow}</p>
            <p className="type-h4 mt-2 group-hover:opacity-70">
              {mega.featured.title}
            </p>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
