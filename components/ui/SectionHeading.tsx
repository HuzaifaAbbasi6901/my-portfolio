"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Consistent section header: gold eyebrow, display title, muted description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-14 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
        <span aria-hidden className="h-px w-8 bg-gold/60" />
        {eyebrow}
      </p>
      <h2 className="font-display text-display-sm font-semibold leading-[1.1] tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-muted">{description}</p>
      ) : null}
    </div>
  );
}
