import Link from "next/link";
import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { apiFetch, getAccessToken, getCurrentUser } from "@/lib/api";
import type { Cart } from "@/lib/types";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function Navbar() {
  const token = await getAccessToken();
  const user = token ? await getCurrentUser() : null;

  let cartCount = 0;
  if (user) {
    try {
      const cart = await apiFetch<Cart>("/cart");
      cartCount = cart.itemCount;
    } catch {
      cartCount = 0;
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6"
      >
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Shramasa
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="transition-none active:translate-y-0"
            aria-label="Search"
          >
            <Search />
          </Button>
          <Link
            href="/wishlist"
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
              className: "transition-none active:translate-y-0",
            })}
            aria-label="Wishlist"
          >
            <Heart />
          </Link>
          <Link
            href={user ? "/account" : "/login"}
            className={buttonVariants({
              variant: "ghost",
              className: "transition-none active:translate-y-0",
            })}
            aria-label={user ? "Account" : "Log in"}
          >
            <UserRound data-icon="inline-start" />
            <span className="hidden sm:inline">
              {user ? "Account" : "Login"}
            </span>
          </Link>
          <Link
            href="/cart"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "relative transition-none active:translate-y-0",
              }),
            )}
            aria-label={
              cartCount > 0
                ? `Shopping cart, ${cartCount} items`
                : "Shopping cart"
            }
          >
            <ShoppingBag />
            {cartCount > 0 ? (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[0.625rem] font-medium text-background">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </nav>
    </header>
  );
}
