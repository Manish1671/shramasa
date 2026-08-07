import Link from "next/link";

export function Newsletter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30 px-6">
      <div className="mx-auto max-w-7xl py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-semibold tracking-tight">
              Shramasa
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Premium skincare and haircare thoughtfully created for everyday
              confidence.
            </p>
          </div>

          <nav aria-label="Quick links">
            <h2 className="text-sm font-semibold">Quick Links</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Customer support">
            <h2 className="text-sm font-semibold">Customer Support</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/shipping">Shipping &amp; Delivery</Link>
              </li>
              <li>
                <Link href="/returns">Returns &amp; Refunds</Link>
              </li>
              <li>
                <Link href="/faq">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold">Contact</h2>
            <address className="mt-4 space-y-3 text-sm not-italic text-muted-foreground">
              <p>India</p>
              <p>
                <a href="mailto:support@shramasa.com">
                  support@shramasa.com
                </a>
              </p>
              <p>
                <Link href="/contact">Send us a message</Link>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            © 2026 Shramasa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
