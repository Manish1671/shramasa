import { StoreImage } from "@/components/commerce/StoreImage";
import { Section } from "@/components/layout/Section";
import { productImageSize } from "@/lib/product-image";

const pillars = [
  {
    title: "Thoughtful ingredients",
    body: "Actives chosen for purpose, bases chosen for comfort — never clutter for a longer label.",
  },
  {
    title: "Everyday rituals",
    body: "Formulas made for consistency: simple steps you will keep, morning and night.",
  },
  {
    title: "Sensory calm",
    body: "Textures and finishes designed to feel quietly luxurious in the hand and on the skin.",
  },
];

const formulaImage = productImageSize("ceramide-moisturizer");

export function ShramasaFormula() {
  return (
    <Section tone="stone">
      <div className="reveal grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <StoreImage
          src="/products/ceramide-moisturizer.png"
          alt=""
          width={formulaImage.width}
          height={formulaImage.height}
          sizes="(min-width: 1024px) 420px, 70vw"
          className="mx-auto h-auto max-h-[32rem] w-auto max-w-full object-contain object-center lg:mx-0 lg:max-h-[40rem]"
          style={{ width: "auto", height: "auto", maxWidth: "100%" }}
        />

        <div>
          <p className="eyebrow">Why Shramasa</p>
          <h2 className="type-h2 mt-4 text-balance">The Shramasa formula</h2>
          <p className="type-body mt-5 max-w-xl">
            Effective care does not need to feel aggressive. Each product is
            designed around a clear purpose and a finish that feels composed from
            the first use.
          </p>

          <div className="mt-12 border-t border-border">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="border-b border-border py-8">
                <h3 className="type-h3">{pillar.title}</h3>
                <div className="editorial-rule mt-4" />
                <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-[0.95rem] sm:leading-8">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
