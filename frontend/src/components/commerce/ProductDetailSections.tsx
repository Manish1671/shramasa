import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

function formatHowToSteps(content: string): string[] {
  const sentences = content
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((part) => part.trim())
    .filter(Boolean);

  return sentences.length > 1 ? sentences : [content];
}

function formatIngredientItems(content: string): string[] | null {
  const trimmed = content.trim();
  if (!trimmed || /^includes:/i.test(trimmed)) {
    return null;
  }

  const parts = trimmed
    .split(",")
    .map((part) => part.trim().replace(/\.$/, ""))
    .filter(Boolean);

  if (parts.length < 2 || parts.some((part) => part.length > 80)) {
    return null;
  }

  return parts;
}

function MissingCopy({ label }: { label: string }) {
  return (
    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
      {label}{" "}
      <Link href="/contact" className="underline underline-offset-4">
        Contact us
      </Link>{" "}
      if you need details before you buy. The on-pack list is the full
      composition.
    </p>
  );
}

export function ProductDetailSections({
  ingredients,
  howToUse,
  delivery,
  faq,
}: {
  ingredients: string | null;
  howToUse: string | null;
  delivery: ReactNode;
  faq: ReactNode;
}) {
  const ingredientItems = ingredients
    ? formatIngredientItems(ingredients)
    : null;
  const howToSteps = howToUse ? formatHowToSteps(howToUse) : [];

  return (
    <section
      className="mt-16 border-t border-border pt-14 sm:mt-20 lg:pt-16"
      aria-labelledby="product-details-heading"
    >
      <div className="max-w-2xl">
        <p className="eyebrow">The formula</p>
        <h2 id="product-details-heading" className="type-h3 mt-3">
          Product details
        </h2>
      </div>

      <article className="mt-10 border-t border-border py-10 sm:py-12">
        <h3 className="type-h4">Ingredients</h3>
        {ingredients ? (
          <>
            {ingredientItems ? (
              <ul className="mt-6 max-w-2xl space-y-2.5">
                {ingredientItems.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex gap-3 text-sm leading-7 text-muted-foreground"
                  >
                    <span
                      className="mt-2 size-1 shrink-0 rounded-full bg-foreground/35"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                {ingredients}
              </p>
            )}
            <p className="mt-5 max-w-2xl text-xs leading-6 text-muted-foreground">
              Key ingredients for guidance. The full composition is on the pack.
              Patch-test if you have sensitive skin.
            </p>
          </>
        ) : (
          <MissingCopy label="The key-ingredient list for this product is being completed." />
        )}
      </article>

      <article className="border-y border-border bg-secondary px-6 py-10 sm:px-8 sm:py-12">
        <h3 className="type-h4">How to use</h3>
        {howToUse && howToSteps.length > 1 ? (
          <ol className="mt-6 max-w-2xl space-y-4">
            {howToSteps.map((step, index) => (
              <li
                key={`how-to-${index}`}
                className="flex gap-4 text-sm leading-7 text-muted-foreground"
              >
                <span
                  className="mt-0.5 font-heading text-base text-foreground/40 tabular-nums"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        ) : howToUse ? (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            {howToUse}
          </p>
        ) : (
          <MissingCopy label="Usage notes for this product are being completed." />
        )}
      </article>

      <div className="mt-2">
        {[
          { title: "Delivery & Returns", content: delivery },
          { title: "FAQ", content: faq },
        ].map((detail) => (
          <details key={detail.title} className="group border-b border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[0.95rem] transition-opacity duration-300 hover:opacity-70">
              {detail.title}
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <p className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-muted-foreground">
              {detail.content}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
