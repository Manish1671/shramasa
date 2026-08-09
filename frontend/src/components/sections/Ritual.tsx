import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const steps = [
  {
    title: "Cleanse",
    body: "Begin with a gentle reset — remove the day without stripping comfort.",
  },
  {
    title: "Treat",
    body: "Layer purposeful actives where they matter: skin, scalp, or strands.",
  },
  {
    title: "Protect",
    body: "Seal moisture and defend with formulas made for everyday climate.",
  },
];

export function Ritual() {
  return (
    <section className="border-y border-border/70 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
        <div>
          <p className="text-xs font-medium tracking-[0.22em] text-primary-foreground/70 uppercase">
            The Shramasa ritual
          </p>
          <h2 className="mt-4 font-heading text-4xl tracking-tight sm:text-5xl">
            Care that feels composed
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-primary-foreground/80">
            We design for consistency over complexity — a quieter kind of luxury
            that belongs in your bathroom, not a laboratory brochure.
          </p>

          <ol className="mt-10 space-y-6">
            {steps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-4">
                <span className="font-heading text-2xl text-primary-foreground/55">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-heading text-xl">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-primary-foreground/75">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href="/about"
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "mt-10 rounded-sm",
            })}
          >
            Read our story
          </Link>
        </div>

        <div className="relative mx-auto aspect-[5/6] w-full max-w-md overflow-hidden rounded-sm bg-primary-foreground/10 lg:max-w-none">
          <div className="absolute inset-6 overflow-hidden rounded-sm bg-background/10">
            <Image
              src="/products/hydrating-body-lotion.png"
              alt="Hydrating Body Lotion"
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-contain p-8"
            />
          </div>
          <div className="absolute right-4 bottom-4 left-4 rounded-sm bg-background/90 p-5 text-foreground backdrop-blur-sm sm:right-8 sm:bottom-8 sm:left-auto sm:w-64">
            <p className="font-heading text-2xl">Soft skin. Clear intention.</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Every formula is edited for feel as carefully as for function.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
