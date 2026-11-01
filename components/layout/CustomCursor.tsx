"use client";

import { useEffect, useRef, useState } from "react";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

/**
 * Custom cursor: instant dot + eased trailing ring that scales on
 * interactive elements and can show a label ("View", "Drag"...).
 * Disabled on touch devices and when reduced motion is preferred.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (isTouch) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");
    setActive(true);

    const pointer = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, calc(-50% - 44px))`;
      }

      const target = event.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor-label]");
      const interactive = target?.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor='hover']"
      );

      const label = labelled?.dataset.cursorLabel ?? "";
      if (labelRef.current) {
        labelRef.current.textContent = label;
        labelRef.current.style.opacity = label ? "1" : "0";
      }
      const scale = label ? 2.6 : interactive ? 1.7 : 1;
      ringRef.current?.style.setProperty("--cursor-scale", String(scale));
      ringRef.current?.classList.toggle("cursor-ring-active", Boolean(interactive || label));
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const loop = () => {
      ring.x += (pointer.x - ring.x) * 0.16;
      ring.y += (pointer.y - ring.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [isTouch]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden lg:block">
      <div
        ref={ringRef}
        className="cursor-ring absolute left-0 top-0 h-10 w-10 rounded-full border border-white mix-blend-difference will-change-transform"
        data-pressed={pressed}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
      />
      <div
        ref={labelRef}
        className="cursor-label absolute left-0 top-0 whitespace-nowrap rounded-full bg-accent px-3.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-widest text-white opacity-0 shadow-glow transition-opacity duration-200"
      />
    </div>
  );
}
