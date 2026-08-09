import Image from "next/image";
import Link from "next/link";

import {
  CONCERN_GROUPS,
  CONCERNS,
  shopConcernHref,
  type ConcernGroup,
} from "@/lib/concerns";
import { productImagePath } from "@/lib/product-image";

function concernsForGroup(group: ConcernGroup) {
  return CONCERNS.filter((concern) => concern.group === group);
}

export function ShopByConcern() {
  return (
    <section className="border-b border-border/45 bg-[oklch(0.965_0.01_92)] px-6 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.22em] text-primary/70 uppercase">
            Targeted care
          </p>
          <h2 className="mt-3 font-heading text-4xl tracking-tight sm:text-5xl">
            Shop by Concern
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Find targeted care for what your skin, hair, and body need today.
          </p>
        </div>

        <div className="mt-14 space-y-16 lg:space-y-20">
          {CONCERN_GROUPS.map((group) => {
            const items = concernsForGroup(group.id);
            return (
              <div key={group.id}>
                <div className="mb-7 flex items-center gap-4">
                  <h3 className="text-[0.7rem] font-medium tracking-[0.22em] text-foreground/70 uppercase">
                    {group.label}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-border/70"
                  />
                </div>

                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((concern) => (
                    <li key={concern.slug}>
                      <Link
                        href={shopConcernHref(concern.slug)}
                        className="group flex h-full gap-4 border border-border/55 bg-[oklch(0.98_0.006_92)] p-4 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card motion-reduce:transform-none"
                      >
                        <div className="relative size-[4.75rem] shrink-0 overflow-hidden bg-[linear-gradient(165deg,oklch(0.94_0.014_95)_0%,oklch(0.9_0.022_145)_100%)] sm:size-[5.25rem]">
                          <Image
                            src={productImagePath(concern.imageSlug)}
                            alt=""
                            fill
                            unoptimized
                            sizes="84px"
                            className="object-contain p-2.5 transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
                          <h4 className="font-heading text-xl leading-snug tracking-tight text-foreground">
                            {concern.name}
                          </h4>
                          <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                            {concern.description}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1 text-[0.68rem] tracking-[0.16em] text-primary uppercase">
                            Explore
                            <span
                              aria-hidden="true"
                              className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
                            >
                              →
                            </span>
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
