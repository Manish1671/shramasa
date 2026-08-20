import { Section } from "@/components/layout/Section";

const TRUST_ITEMS = [
  "Secure checkout",
  "Cash on Delivery",
  "Easy returns",
  "Delivery across India",
] as const;

export function TrustStrip() {
  return (
    <Section space="compact" aria-label="Shopping reassurance">
      <ul className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-0">
        {TRUST_ITEMS.map((item, index) => (
          <li
            key={item}
            className={
              index > 0
                ? "flex items-center justify-center px-3 text-center sm:border-l sm:border-border sm:px-6"
                : "flex items-center justify-center px-3 text-center sm:px-6"
            }
          >
            <span className="text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
