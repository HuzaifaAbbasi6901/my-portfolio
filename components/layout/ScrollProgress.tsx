"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gradient progress bar fixed to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setVisible(v > 0.01));
    return unsub;
  }, [scrollYProgress]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[85] h-[3px] origin-left bg-gradient-to-r from-accent via-cyan to-gold"
    />
  );
}
