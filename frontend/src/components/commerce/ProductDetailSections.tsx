import { ChevronDown } from "lucide-react";

function formatHowToSteps(content: string): string[] {
  const sentences = content
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((part) => part.trim())
    .filter(Boolean);

  return sentences.length > 1 ? sentences : [content];
}

export function ProductDetailSections({
  benefits,
  ingredients,
  howToUse,
  delivery,
  faq,
}: {
  benefits: string;
  ingredients: string;
  howToUse: string;
  delivery: string;
  faq: string;
}) {
  const howToSteps = formatHowToSteps(howToUse);

  return (
    <section
      className="border-t border-border/55 pt-14 sm:pt-16 lg:pt-24"
      aria-labelledby="product-details-heading"
    >
      <div className="max-w-2xl">
        <p className="text-[0.65rem] font-medium tracking-[0.24em] text-primary/70 uppercase">
          The formula
        </p>
        <h2
          id="product-details-heading"
          className="mt-3 font-heading text-[2rem] tracking-tight sm:text-4xl lg:text-[2.75rem]"
        >
          Product details
        </h2>
      </div>

      <div className="mt-10 sm:mt-12 lg:mt-14">
        <article className="border-t border-border/55 py-9 sm:py-12 lg:py-14">
          <h3 className="font-heading text-[1.65rem] tracking-tight sm:text-2xl lg:text-[1.85rem]">
            Benefits
          </h3>
          <div className="editorial-rule mt-4" />
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-[0.95rem] sm:leading-8">
            {benefits}
          </p>
        </article>

        <article className="border-y border-border/70 bg-[oklch(0.965_0.01_92)] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <h3 className="font-heading text-[1.65rem] tracking-tight sm:text-2xl lg:text-[1.85rem]">
            Ingredients
          </h3>
          <div className="editorial-rule mt-4" />
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-[0.95rem] sm:leading-8">
            {ingredients}
          </p>
        </article>

        <article className="border-b border-border/55 py-9 sm:py-12 lg:py-14">
          <h3 className="font-heading text-[1.65rem] tracking-tight sm:text-2xl lg:text-[1.85rem]">
            How to Use
          </h3>
          <div className="editorial-rule mt-4" />
          {howToSteps.length > 1 ? (
            <ol className="mt-5 max-w-2xl space-y-4 sm:mt-6 sm:space-y-5">
              {howToSteps.map((step, index) => (
                <li
                  key={`how-to-${index}`}
                  className="flex gap-4 text-sm leading-7 text-muted-foreground sm:text-[0.95rem] sm:leading-8"
                >
                  <span
                    className="mt-0.5 font-heading text-base text-primary/55 tabular-nums"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-[0.95rem] sm:leading-8">
              {howToUse}
            </p>
          )}
        </article>
      </div>

      <div className="mt-4 sm:mt-6">
        {[
          { title: "Delivery & Returns", content: delivery },
          { title: "FAQ", content: faq },
        ].map((detail) => (
          <details
            key={detail.title}
            className="group border-b border-border/55"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-heading text-[1.2rem] tracking-tight transition-colors duration-300 hover:text-primary sm:py-6 sm:text-[1.4rem]">
              {detail.title}
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <p className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-muted-foreground sm:pb-7 sm:leading-8">
              {detail.content}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
