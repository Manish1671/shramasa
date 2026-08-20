import Link from "next/link";

const SHOP_LINKS = [
  ["/shop", "Shop"],
  ["/shop?category=face-care", "Face Care"],
  ["/shop?category=hair-care", "Hair Care"],
  ["/shop?category=body-care", "Body Care"],
  ["/shop?category=ritual-kits", "Rituals"],
] as const;

const ABOUT_LINKS = [
  ["/about", "Our Story"],
  ["/about#ingredients", "Ingredients"],
  ["/contact", "Contact"],
] as const;

const CARE_LINKS = [
  ["/care#shipping", "Shipping"],
  ["/care#returns", "Returns"],
  ["/care#faq", "FAQs"],
  ["/orders", "Orders"],
] as const;

function FooterNav({
  label,
  links,
}: {
  label: string;
  links: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <nav aria-label={label}>
      <h2 className="text-[0.66rem] font-medium tracking-[0.2em] text-primary-foreground/50 uppercase">
        {label}
      </h2>
      <ul className="mt-6 space-y-3.5 text-sm text-primary-foreground/70">
        {links.map(([href, text]) => (
          <li key={`${href}-${text}`}>
            <Link
              href={href}
              className="transition-colors duration-300 hover:text-primary-foreground"
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-ink px-6 text-primary-foreground sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[80rem] py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_0.7fr_0.7fr_0.7fr] lg:gap-16">
          <div>
            <Link
              href="/"
              className="font-heading text-[1.85rem] tracking-[-0.01em] text-primary-foreground transition-opacity duration-300 hover:opacity-80"
            >
              Shramasa
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7 text-primary-foreground/68">
              Thoughtful skincare and haircare for calm, confident everyday
              rituals.
            </p>
          </div>

          <FooterNav label="Shop" links={SHOP_LINKS} />
          <FooterNav label="About" links={ABOUT_LINKS} />
          <FooterNav label="Customer Care" links={CARE_LINKS} />
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-primary-foreground/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8rem] text-primary-foreground/45">
            © 2026 Shramasa. All rights reserved.
          </p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap gap-x-6 gap-y-2 text-[0.8rem] text-primary-foreground/55"
          >
            <Link
              href="/privacy"
              className="transition-colors duration-300 hover:text-primary-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors duration-300 hover:text-primary-foreground"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
