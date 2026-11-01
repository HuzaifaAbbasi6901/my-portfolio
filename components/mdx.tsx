import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Component map passed to MDXRemote — styles rendered markdown to match the
 * site design system. Server-safe (no hooks).
 */

function Anchor({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  const external = href.startsWith("http");
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

function Callout({ children, type = "info" }: { children: ReactNode; type?: "info" | "warn" }) {
  return (
    <aside
      className="my-8 liquid rounded-2xl p-5 text-sm leading-relaxed text-muted"
      data-type={type}
    >
      {children}
    </aside>
  );
}

export const mdxComponents = {
  a: Anchor,
  Callout,
};
