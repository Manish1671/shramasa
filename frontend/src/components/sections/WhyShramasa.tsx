const pillars = [
  {
    title: "Thoughtful Ingredients",
    body: "Actives chosen for purpose, bases chosen for comfort — never clutter for a longer label.",
  },
  {
    title: "Sensory Calm",
    body: "Textures and finishes designed to feel quietly luxurious in the hand and on the skin.",
  },
  {
    title: "Everyday Ritual",
    body: "Formulas made for consistency: simple steps you will keep, morning and night.",
  },
  {
    title: "Considered Care",
    body: "Every product is edited for feel as carefully as for function — beauty without noise.",
  },
];

export function WhyShramasa() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-primary/70 uppercase">
              Why Shramasa
            </p>
            <h2 className="mt-4 font-heading text-4xl tracking-tight sm:text-5xl">
              Beauty care with quiet confidence
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground lg:justify-self-end">
            We believe effective care does not need to feel aggressive. Each
            product is designed around a clear purpose and a finish that feels
            composed from the first use.
          </p>
        </div>

        <div className="mt-14 grid gap-0 border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="border-b border-border px-0 py-8 sm:border-r sm:px-6 sm:py-10 sm:odd:pl-0 lg:border-b-0 lg:last:border-r-0 lg:last:pr-0 lg:first:pl-0"
            >
              <span className="font-heading text-2xl text-primary/35">
                0{index + 1}
              </span>
              <h3 className="mt-4 font-heading text-2xl tracking-tight">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
