import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6"
      >
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Shramasa
        </Link>

        <div className="flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground"
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
            href="/login"
            className={buttonVariants({
              variant: "ghost",
              className: "transition-none active:translate-y-0",
            })}
            aria-label="Log in"
          >
            <UserRound data-icon="inline-start" />
            Login
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="transition-none active:translate-y-0"
            aria-label="Shopping cart"
          >
            <ShoppingBag />
          </Button>
        </div>
      </nav>
    </header>
  );
}
