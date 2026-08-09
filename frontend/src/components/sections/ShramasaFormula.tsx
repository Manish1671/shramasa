import Image from "next/image";

const pillars = [
  {
    title: "Thoughtful ingredients",
    body: "Purposeful formulas and considered ingredient choices.",
  },
  {
    title: "Everyday rituals",
    body: "Simple care designed to fit naturally into daily routines.",
  },
  {
    title: "Sensory calm",
    body: "Textures and fragrances designed to make everyday care feel considered.",
  },
];

export function ShramasaFormula() {
  return (
    <section className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 xl:gap-16">
          <div className="group relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-sm bg-[oklch(0.95_0.012_95)] ring-1 ring-border/45 lg:mx-0 lg:max-w-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,oklch(0.93_0.02_145)_0%,oklch(0.95_0.012_95)_70%)]" />
            <Image
              src="/products/ceramide-moisturizer.png"
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 38vw, 80vw"
              className="object-contain object-center p-8 transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none sm:p-10"
            />
          </div>

          <div>
            <h2 className="font-heading text-3xl tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
              The Shramasa formula
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Thoughtful care begins with what goes into every ritual.
            </p>

            <div className="mt-8 border-t border-border/55">
              {pillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="border-b border-border/55 py-5 sm:py-6"
                >
                  <h3 className="font-heading text-xl tracking-tight sm:text-2xl">
                    {pillar.title}
                  </h3>
                  <div className="editorial-rule mt-2.5" />
                  <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                    {pillar.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
