"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { MegaMenu } from "@/components/layout/MegaMenu";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/nav-menu";
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const searchInputId = useId();
  const closeTimer = useRef<number | undefined>(undefined);

  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const isHome = pathname === "/";

  function openMenu(id: string) {
    window.clearTimeout(closeTimer.current);
    setSearchOpen(false);
    setMenu(id);
  }

  function scheduleClose() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setMenu(null);
    }, 70);
  }

  function cancelClose() {
    window.clearTimeout(closeTimer.current);
  }

  useEffect(() => {
    setOpen(false);
    setMenu(null);
    setSearchOpen(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenu(null);
        setSearchOpen(false);
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const iconLinkClass =
    "inline-flex size-8 items-center justify-center text-foreground/70 transition-colors duration-300 hover:text-foreground";

  const activeMega = NAV_ITEMS.find((item) => item.id === menu && item.mega);

  return (
    <header
      className={cn(
        "z-50 border-b border-border bg-card text-foreground",
        isHome ? "fixed inset-x-0 top-9" : "sticky top-0",
      )}
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto grid h-[4.5rem] max-w-[80rem] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 sm:px-8 lg:px-10"
      >
        <Link
          href="/"
          className="font-heading text-[1.75rem] tracking-[-0.01em] text-foreground transition-opacity duration-300 hover:opacity-75"
        >
          Shramasa
        </Link>

        <div className="hidden justify-center lg:flex">
          <ul className="flex items-center gap-7 xl:gap-9">
            {NAV_ITEMS.map((item) => {
              const active =
                item.id === "bestsellers"
                  ? false
                  : item.href === "/shop"
                    ? pathname === "/shop" || pathname.startsWith("/shop/")
                    : item.href.startsWith("/shop?")
                      ? false
                      : pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));
              const isOpen = menu === item.id;

              return (
                <li
                  key={item.id}
                  onMouseEnter={() =>
                    item.mega ? openMenu(item.id) : setMenu(null)
                  }
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative py-1 text-[0.68rem] font-medium tracking-[0.12em] uppercase transition-colors duration-300",
                      active || isOpen
                        ? "text-foreground"
                        : "text-foreground/65 hover:text-foreground",
                    )}
                    aria-expanded={item.mega ? isOpen : undefined}
                    aria-haspopup={item.mega ? "true" : undefined}
                    aria-controls={item.mega ? `mega-${item.id}` : undefined}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-0 -bottom-0.5 mx-auto h-px bg-foreground/70 transition-[width,opacity] duration-300 ease-out",
                        active || isOpen
                          ? "w-full opacity-100"
                          : "w-0 opacity-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
            {isAdmin ? (
              <li>
                <Link
                  href="/admin"
                  className="text-[0.68rem] font-medium tracking-[0.12em] text-foreground/65 uppercase transition-colors duration-300 hover:text-foreground"
                >
                  Admin
                </Link>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={cn(iconLinkClass, "hidden sm:inline-flex")}
            aria-label="Search products"
            aria-expanded={searchOpen}
            onClick={() => {
              setMenu(null);
              setSearchOpen((value) => !value);
            }}
          >
            <Search aria-hidden="true" className="size-[1.05rem]" />
          </button>
          <Link
            href="/wishlist"
            className={iconLinkClass}
            aria-label="Wishlist"
          >
            <Heart aria-hidden="true" className="size-[1.05rem]" />
          </Link>
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            className={cn(iconLinkClass, "hidden sm:inline-flex")}
            aria-label={isAuthenticated ? "Account" : "Log in"}
          >
            <UserRound aria-hidden="true" className="size-[1.05rem]" />
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
              <span className="absolute top-1 right-0.5 min-w-3 text-center text-[0.58rem] font-medium text-foreground tabular-nums">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-secondary hover:text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </nav>

      {searchOpen ? (
        <div className="border-t border-border bg-card px-6 py-4">
          <form
            className="mx-auto flex max-w-[80rem] items-center gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const next = query.trim();
              setSearchOpen(false);
              router.push(
                next ? `/shop?q=${encodeURIComponent(next)}` : "/shop",
              );
            }}
          >
            <label htmlFor={searchInputId} className="sr-only">
              Search the collection
            </label>
            <input
              id={searchInputId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
              placeholder="Search the collection"
              className="h-11 w-full border-0 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="text-[0.72rem] tracking-[0.16em] text-foreground uppercase transition-colors duration-300 hover:text-foreground/70"
            >
              Search
            </button>
          </form>
        </div>
      ) : null}

      <div className="hidden" aria-hidden="true">
        {NAV_ITEMS.map((item) =>
          item.mega?.featured ? (
            <img key={item.id} src={item.mega.featured.image} alt="" />
          ) : null,
        )}
      </div>

      {activeMega ? (
        <div className="hidden lg:block">
          <MegaMenu item={activeMega} />
        </div>
      ) : null}

      {open ? (
        <div
          id="mobile-menu"
          className="max-h-[calc(100svh-7.5rem)] overflow-y-auto border-t border-border bg-card px-6 py-8 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                className="border-b border-border py-4 last:border-b-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href={item.href}
                    className="font-heading text-2xl tracking-tight text-foreground"
                  >
                    {item.label}
                  </Link>
                  {item.mega ? (
                    <button
                      type="button"
                      className="text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase"
                      aria-expanded={mobileSection === item.id}
                      onClick={() =>
                        setMobileSection((current) =>
                          current === item.id ? null : item.id,
                        )
                      }
                    >
                      {mobileSection === item.id ? "Close" : "Explore"}
                    </button>
                  ) : null}
                </div>
                {item.mega && mobileSection === item.id ? (
                  <div className="mt-4 grid gap-6 pb-2">
                    {item.mega.columns.map((column) => (
                      <div key={column.title}>
                        <p className="eyebrow">{column.title}</p>
                        <ul className="mt-2.5 space-y-2">
                          {column.links.map((link) => (
                            <li key={`${column.title}-${link.href}-${link.label}`}>
                              <Link
                                href={link.href}
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <Link
              href={isAuthenticated ? "/account" : "/login"}
              className="pt-4 font-heading text-2xl tracking-tight text-foreground"
            >
              {isAuthenticated ? "Account" : "Login"}
            </Link>
            {isAdmin ? (
              <Link
                href="/admin"
                className="pt-3 font-heading text-2xl tracking-tight text-foreground"
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
