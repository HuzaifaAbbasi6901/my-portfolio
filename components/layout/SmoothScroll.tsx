"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "framer-motion";

interface SmoothScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | number) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

/**
 * Lenis inertial scrolling wired into the GSAP ticker so ScrollTrigger stays
 * perfectly in sync. Disabled when the user prefers reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const instance = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenisRef.current = instance;
    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger measurements fresh after fonts/images settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  // Reset scroll between routes; honour #hash links arriving from other pages.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const target = hash;
      const timeout = setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, { duration: 1.2 });
        } else {
          document
            .querySelector(target)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        ScrollTrigger.refresh();
      }, 400);
      return () => clearTimeout(timeout);
    }
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  const scrollToTarget = (target: string | number) => {
    const instance = lenisRef.current;
    if (instance) {
      instance.scrollTo(target, { duration: 1.4 });
    } else if (typeof target === "string") {
      document
        .querySelector(target)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  return (
    <SmoothScrollContext.Provider
      value={{ lenis, scrollTo: scrollToTarget }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
