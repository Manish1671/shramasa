import { Section } from "@/components/layout/Section";

export function ManifestoStrip() {
  return (
    <Section space="compact" borderBottom aria-label="Brand philosophy">
      <div className="reveal mx-auto max-w-3xl text-center">
        <p className="eyebrow">The philosophy</p>
        <div className="editorial-rule mx-auto mt-5" />
        <p className="type-h3 mt-7 text-balance sm:text-[1.95rem] lg:text-[2.2rem]">
          Formulated with intention. Composed for the daily ritual — skin, hair,
          and body in quiet conversation.
        </p>
      </div>
    </Section>
  );
}
