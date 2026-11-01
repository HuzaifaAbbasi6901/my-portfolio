"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  maxTilt?: number;
  glare?: boolean;
  spotlight?: boolean;
}

/**
 * 3D-tilting card with cursor glare and a soft spotlight that follows the
 * pointer. Falls back to a static card for touch and reduced motion.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 8,
  glare = true,
  spotlight = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || reduceMotion || (event.nativeEvent as PointerEvent).pointerType === "touch")
      return;

    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - py) * maxTilt * 2;

    el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(
      2
    )}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--glare-opacity", glare ? "0.25" : "0");
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    el.style.setProperty("--glare-opacity", "0");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "liquid liquid-hover group relative overflow-hidden rounded-3xl transition-transform duration-300 ease-out-expo will-change-transform",
        spotlight &&
          "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100 before:bg-[radial-gradient(560px_circle_at_var(--mx,50%)_var(--my,50%),rgb(var(--rgb-accent)/0.12),transparent_45%)]",
        className
      )}
    >
      {children}
      {glare ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 opacity-[var(--glare-opacity,0)] transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 48%, transparent 62%)",
          }}
        />
      ) : null}
    </div>
  );
}
