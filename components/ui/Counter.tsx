"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

/** Animated number that counts up when scrolled into view. */
export function Counter({
  value,
  suffix = "",
  prefix = "",
  className,
  duration = 1.8,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [spring, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
