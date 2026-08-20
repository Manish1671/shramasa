import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Visual register. Adjacent homepage sections should not share a tone. */
  tone?: "paper" | "stone" | "forest";
  space?: "default" | "compact";
  borderTop?: boolean;
  borderBottom?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function Section({
  children,
  id,
  className,
  tone = "paper",
  space = "default",
  borderTop = false,
  borderBottom = false,
  ...aria
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "px-6 sm:px-8 lg:px-10",
        space === "compact" ? "py-12 sm:py-14" : "py-16 sm:py-20 lg:py-24",
        tone === "paper" && "bg-background",
        tone === "stone" && "bg-secondary",
        tone === "forest" &&
          "bg-primary text-primary-foreground [&_.eyebrow]:text-primary-foreground/55 [&_.type-body]:text-primary-foreground/72 [&_.link-quiet]:text-primary-foreground/80 [&_.link-quiet]:hover:text-primary-foreground",
        borderTop && "border-t border-border",
        borderBottom && "border-b border-border",
        className,
      )}
      {...aria}
    >
      <div className="mx-auto w-full max-w-[80rem]">{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  action?: ReactNode;
  align?: "start" | "center";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  action,
  align = "start",
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered
          ? "items-center text-center"
          : action
            ? "sm:flex-row sm:items-end sm:justify-between"
            : null,
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "flex flex-col items-center")}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <Heading
          id={titleId}
          className={cn("type-h2 text-balance", eyebrow ? "mt-4" : null)}
        >
          {title}
        </Heading>
        {description ? (
          <p className={cn("type-body mt-5", centered && "mx-auto max-w-md")}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
