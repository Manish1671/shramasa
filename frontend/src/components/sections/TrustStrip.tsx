const TRUST_ITEMS = [
  "Secure checkout",
  "Cash on Delivery",
  "Easy returns",
  "Everyday delivery",
] as const;

export function TrustStrip() {
  return (
    <section
      aria-label="Shopping reassurance"
      className="border-y border-border/50 bg-[oklch(0.968_0.008_92)] px-6 py-6 sm:py-7"
    >
      <div className="mx-auto max-w-7xl">
        <ul className="grid grid-cols-2 divide-y divide-border/40 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {TRUST_ITEMS.map((item) => (
            <li
              key={item}
              className="flex items-center justify-center px-3 py-3 text-center sm:px-4 sm:py-1"
            >
              <span className="text-[0.7rem] tracking-[0.12em] text-muted-foreground uppercase sm:text-[0.72rem]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
