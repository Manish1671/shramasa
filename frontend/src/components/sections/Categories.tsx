import { Droplets, Heart, Scissors, Sprout } from "lucide-react";

const categories = [
  {
    name: "Face Care",
    description: "Daily essentials for balanced, healthy-looking skin.",
    icon: Droplets,
  },
  {
    name: "Hair Care",
    description: "Thoughtful care for smooth, nourished, resilient hair.",
    icon: Scissors,
  },
  {
    name: "Hair Growth",
    description: "Targeted formulas that support stronger-looking hair.",
    icon: Sprout,
  },
  {
    name: "Body Care",
    description: "Restorative essentials for soft, comfortable skin.",
    icon: Heart,
  },
];

export function Categories() {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold">Shop by category</h2>
        <p className="mt-4 text-base text-muted-foreground">
          Explore care essentials selected for every part of your routine.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <article
                key={category.name}
                className="flex min-h-52 h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/20 hover:bg-muted/40"
              >
                <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-8 text-xl font-semibold">{category.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
