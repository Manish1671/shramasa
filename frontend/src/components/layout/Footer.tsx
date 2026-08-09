import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-[oklch(0.955_0.01_93)] px-6">
      <div className="mx-auto max-w-7xl py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr] lg:gap-12">
          <div>
            <Link href="/" className="font-heading text-3xl tracking-tight">
              Shramasa
            </Link>
            <div className="editorial-rule mt-5" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              Thoughtful skincare and haircare for calm, confident everyday
              rituals — composed with intention, finished with softness.
            </p>
          </div>

          <nav aria-label="Explore">
            <h2 className="text-xs font-medium tracking-[0.18em] text-foreground uppercase">
              Explore
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                ["/", "Home"],
                ["/shop", "Shop"],
                ["/about", "About"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    className="transition-colors duration-300 hover:text-foreground"
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account">
            <h2 className="text-xs font-medium tracking-[0.18em] text-foreground uppercase">
              Account
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                ["/account", "My account"],
                ["/orders", "Orders"],
                ["/wishlist", "Wishlist"],
                ["/cart", "Cart"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    className="transition-colors duration-300 hover:text-foreground"
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-medium tracking-[0.18em] text-foreground uppercase">
              Stay in touch
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Questions about ingredients, orders, or rituals? Reach us through
              the contact form.
            </p>
            <p className="mt-4 text-sm">
              <Link
                href="/contact"
                className="text-foreground underline underline-offset-4 transition-opacity duration-300 hover:opacity-70"
              >
                Write to us
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2026 Shramasa. All rights reserved.
          </p>
          <p className="font-heading text-lg text-muted-foreground">
            Healthy skin. Beautiful hair.
          </p>
        </div>
      </div>
    </footer>
  );
}
