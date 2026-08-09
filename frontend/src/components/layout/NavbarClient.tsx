"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const iconLinkClass =
  "inline-flex size-8 items-center justify-center rounded-sm text-foreground transition-colors duration-300 hover:bg-muted hover:text-foreground";

type NavbarClientProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  cartCount: number;
};

export function NavbarClient({
  isAuthenticated,
  isAdmin,
  cartCount,
}: NavbarClientProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Keep initial SSR + first client paint identical; apply scroll styles only after mount.
  const [scrolled, setScrolled] = useState(false);
  const [scrollReady, setScrollReady] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    setScrollReady(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrollReady && scrolled
          ? "border-border/70 bg-background/94 shadow-[0_12px_32px_-28px_oklch(0.3_0.04_150_/0.5)] backdrop-blur-md"
          : "border-border/40 bg-background/80 backdrop-blur-sm",
      )}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-6 px-6 lg:gap-12"
      >
        <Link
          href="/"
          className="font-heading text-[1.85rem] tracking-tight transition-opacity duration-300 hover:opacity-75"
        >
          Shramasa
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-1 text-[0.72rem] tracking-[0.18em] uppercase transition-colors duration-300",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 mx-auto h-px bg-primary transition-all duration-300",
                    active ? "w-full opacity-100" : "w-0 opacity-0",
                  )}
                />
              </Link>
            );
          })}
          {isAdmin ? (
            <Link
              href="/admin"
              className="text-[0.72rem] tracking-[0.18em] text-muted-foreground uppercase transition-colors duration-300 hover:text-foreground"
            >
              Admin
            </Link>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/shop"
            className={cn(iconLinkClass, "hidden sm:inline-flex")}
            aria-label="Search products"
          >
            <Search aria-hidden="true" className="size-[1.05rem]" />
          </Link>
          <Link
            href="/wishlist"
            className={iconLinkClass}
            aria-label="Wishlist"
          >
            <Heart aria-hidden="true" className="size-[1.05rem]" />
          </Link>
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            className={cn(
              "hidden items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-foreground transition-colors duration-300 hover:bg-muted hover:text-foreground sm:inline-flex",
            )}
            aria-label={isAuthenticated ? "Account" : "Log in"}
          >
            <UserRound aria-hidden="true" className="size-[1.05rem]" />
            <span className="text-[0.72rem] tracking-[0.14em] uppercase">
              {isAuthenticated ? "Account" : "Login"}
            </span>
          </Link>
          <Link
            href="/cart"
            className={cn(iconLinkClass, "relative")}
            aria-label={
              cartCount > 0
                ? `Shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`
                : "Shopping cart"
            }
          >
            <ShoppingBag aria-hidden="true" className="size-[1.05rem]" />
            {cartCount > 0 ? (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-medium text-primary-foreground">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-sm md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X aria-hidden="true" />
            ) : (
              <Menu aria-hidden="true" />
            )}
          </Button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background px-6 py-10 md:hidden"
        >
          <div className="flex flex-col gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-heading text-3xl tracking-tight text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={isAuthenticated ? "/account" : "/login"}
              className="font-heading text-3xl tracking-tight text-foreground"
            >
              {isAuthenticated ? "Account" : "Login"}
            </Link>
            {isAdmin ? (
              <Link
                href="/admin"
                className="font-heading text-3xl tracking-tight text-foreground"
              >
                Admin
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
