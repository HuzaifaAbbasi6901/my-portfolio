"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fade enter transition on every route change.
 * Deliberately opacity-only: a persistent `will-change: transform` here would
 * create a containing block that breaks GSAP's position:fixed pinning below.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
