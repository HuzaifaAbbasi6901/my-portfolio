"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  /** Seconds before the animation starts. */
  delay?: number;
  once?: boolean;
  /** Animate on scroll into view instead of immediately. */
  onScroll?: boolean;
  /** When false, holds the text hidden until flipped true. */
  play?: boolean;
}

const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  span: motion.span,
  p: motion.p,
} as const;

/**
 * Splits text into words and characters, then staggers them in with a
 * masked rise. Falls back to plain text when reduced motion is preferred.
 */
export function SplitText({
  text,
  className,
  as: Tag = "span",
  delay = 0,
  once = true,
  onScroll = false,
  play = true,
}: SplitTextProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motionTags[Tag];

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.028, delayChildren: delay },
    },
  };

  const char: Variants = {
    hidden: { y: "110%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <MotionTag
      className={cn("inline-block", className)}
      variants={container}
      initial="hidden"
      {...(onScroll
        ? { whileInView: "visible", viewport: { once, margin: "-10% 0px" } }
        : { animate: play ? "visible" : "hidden" })}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom"
          aria-hidden
        >
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={`${letter}-${letterIndex}`}
              variants={char}
              className="inline-block will-change-transform"
            >
              {letter}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 ? (
            <motion.span variants={char} className="inline-block">
              &nbsp;
            </motion.span>
          ) : null}
        </span>
      ))}
    </MotionTag>
  );
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger children instead of animating as one block. */
  stagger?: number;
  delay?: number;
  y?: number;
  once?: boolean;
}

/** Scroll-triggered fade + rise. Wrap lists with `stagger` to cascade children. */
export function Reveal({
  children,
  className,
  stagger,
  delay = 0,
  y = 28,
  once = true,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay,
        ...(stagger !== undefined ? { staggerChildren: stagger } : {}),
      },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  if (stagger !== undefined) {
    return (
      <motion.div
        className={className}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-8% 0px" }}
      >
        {Array.isArray(children)
          ? children.map((child, index) => (
              <motion.div key={index} variants={childVariants}>
                {child}
              </motion.div>
            ))
          : children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-8% 0px" }}
    >
      {children}
    </motion.div>
  );
}
