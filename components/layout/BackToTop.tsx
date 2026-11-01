"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";

/** Circular-scroll-progress back-to-top button (appears after 600px). */
export function BackToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(p);
      setVisible(scrollTop > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const circumference = 2 * Math.PI * 22;

  return (
    <button
      type="button"
      onClick={() => scrollTo(0)}
      aria-label="Back to top"
      className={`fixed bottom-6 left-6 z-[85] flex h-12 w-12 items-center justify-center liquid rounded-full text-foreground shadow-soft transition-all duration-500 ease-out-expo hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          strokeWidth="2"
          className="stroke-border/20"
        />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-accent transition-[stroke-dashoffset] duration-150"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>
      <ArrowUp className="h-4 w-4" aria-hidden />
    </button>
  );
}
