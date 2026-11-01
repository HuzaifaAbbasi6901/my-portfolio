"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sound";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element pulls toward the cursor (0–1). */
  strength?: number;
}

/**
 * Wraps children in a container that pulls toward the cursor with a spring.
 * Disabled for touch devices and users who prefer reduced motion.
 */
export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
  const reduceMotion = useReducedMotion();

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    if ((event.nativeEvent as PointerEvent).pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  external?: boolean;
  download?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const buttonStyles = {
  primary:
    "bg-accent text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_0_40px_-8px_rgb(var(--rgb-accent)/0.6)] hover:brightness-110",
  secondary:
    "liquid text-foreground hover:border-accent/40",
  ghost: "text-foreground/80 hover:text-foreground",
} as const;

/** Magnetic button with press feedback and optional sound tick. */
export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  external,
  download,
  ariaLabel,
  type = "button",
  disabled,
}: ButtonProps) {
  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 ease-out-expo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    buttonStyles[variant],
    className
  );

  const handleClick = () => {
    playSound("click");
    onClick?.();
  };

  const inner = (
    <>
      {children}
    </>
  );

  return (
    <Magnetic>
      {href ? (
        <a
          href={href}
          onClick={handleClick}
          className={classes}
          aria-label={ariaLabel}
          download={download}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {inner}
        </a>
      ) : (
        <button
          type={type}
          onClick={handleClick}
          className={classes}
          aria-label={ariaLabel}
          disabled={disabled}
        >
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
