const demos = [
  {
    quote:
      "A beautifully simple routine that feels considered from the first step.",
    focus: "Face ritual",
  },
  {
    quote:
      "The textures feel calm and refined — nothing harsh, nothing hurried.",
    focus: "Daily care",
  },
  {
    quote:
      "Packaging that looks as considered as the formulas themselves.",
    focus: "Ritual kits",
  },
];

export function SocialProof() {
  return (
    <section className="border-y border-border/60 bg-muted/25 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.22em] text-primary/70 uppercase">
            Loved by the community
          </p>
          <h2 className="mt-3 font-heading text-4xl tracking-tight sm:text-5xl">
            Soft words for soft rituals
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Demonstration content for storefront presentation — not real
            customer reviews.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {demos.map((item) => (
            <figure
              key={item.focus}
              className="flex flex-col border-t border-border/80 pt-8"
            >
              <p className="text-[0.65rem] font-medium tracking-[0.2em] text-primary/60 uppercase">
                Demo review
              </p>
              <p
                className="mt-3 text-sm tracking-[0.2em] text-primary/80"
                aria-label="5 out of 5 stars (demo)"
              >
                ★★★★★
              </p>
              <blockquote className="mt-5 flex-1 font-heading text-2xl leading-snug tracking-tight text-balance">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                {item.focus}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
