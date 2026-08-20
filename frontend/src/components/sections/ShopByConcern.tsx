import Link from "next/link";

import { StoreImage } from "@/components/commerce/StoreImage";
import { Section, SectionHeader } from "@/components/layout/Section";
import {
  CONCERN_GROUPS,
  CONCERNS,
  concernPhotoPath,
  shopConcernHref,
  type Concern,
  type ConcernGroup,
} from "@/lib/concerns";
import { cn } from "@/lib/utils";

function concernsForGroup(group: ConcernGroup) {
  return CONCERNS.filter((concern) => concern.group === group);
}

function ConcernTile({ concern }: { concern: Concern }) {
  return (
    <Link
      href={shopConcernHref(concern.slug)}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <StoreImage
          src={concernPhotoPath(concern.slug)}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
        />
      </div>
      <p className="mt-4 text-center font-heading text-[1.15rem] tracking-[-0.015em]">
        {concern.tileLabel}
      </p>
    </Link>
  );
}

export function ShopByConcern() {
  return (
    <Section>
      <div className="reveal">
        <SectionHeader
          eyebrow="Targeted care"
          title="Shop by concern"
          description="Start from what your skin and hair are asking for."
        />

        <div className="mt-14 space-y-16 lg:mt-16 lg:space-y-20">
          {CONCERN_GROUPS.map((group) => {
            const items = concernsForGroup(group.id);

            return (
              <div key={group.id}>
                <p className="eyebrow mb-6">{group.label}</p>
                <ul
                  className={cn(
                    "grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-7 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12",
                    group.id === "body" && "lg:w-1/2 lg:pr-4",
                  )}
                >
                  {items.map((concern) => (
                    <li key={concern.slug}>
                      <ConcernTile concern={concern} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
