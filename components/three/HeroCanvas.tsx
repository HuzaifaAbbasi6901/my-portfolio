"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useScroll } from "framer-motion";
import HeroScene from "@/components/three/HeroScene";

/** CSS-only stand-in shown before mount, for no-WebGL devices and reduced motion. */
function FallbackOrb() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <div className="animate-float relative">
        <div className="h-64 w-64 rounded-full bg-gradient-to-br from-accent via-[#a78bfa] to-cyan opacity-70 blur-[2px] sm:h-80 sm:w-80" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-cyan/40 to-transparent blur-2xl" />
      </div>
    </div>
  );
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Client shell around the 3D scene. HeroScene is imported statically but only
 * RENDERED after mount — the server never renders the R3F canvas, and no
 * chunk-loading machinery (next/dynamic, React.lazy) is involved, which keeps
 * hydration deterministic. WebGL probing and reduced-motion preference decide
 * between the scene and the CSS fallback orb.
 */
export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mountable, setMountable] = useState(false);
  const [inView, setInView] = useState(true);
  const { resolvedTheme } = useTheme();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    setMounted(true);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setMountable(!reduceMotion && hasWebGL());
  }, []);

  // Pause rendering while off-screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !mountable) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mountable]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0"
      data-testid="hero-canvas"
    >
      {mounted && mountable ? (
        <HeroScene
          active={inView}
          scrollProgress={scrollYProgress}
          theme={resolvedTheme === "light" ? "light" : "dark"}
        />
      ) : (
        <FallbackOrb />
      )}
    </div>
  );
}
