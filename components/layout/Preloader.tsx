"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { setSessionFlag } from "@/hooks/useSessionFlag";

const PRELOADER_KEY = "portfolio-preloaded";

/**
 * Session preloader: monogram draw-in + percentage counter, then a curtain
 * reveal into the hero. Shown once per browser session.
 */
export function Preloader() {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("loading");
  const [skip, setSkip] = useState(false);
  const reduceMotion = useReducedMotion();
  const startedRef = useRef(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(PRELOADER_KEY) === "1";
    if (seen || reduceMotion) {
      // Signal the hero immediately so its entrance isn't lost.
      setSessionFlag(PRELOADER_KEY);
      window.dispatchEvent(new Event("preloader:done"));
      setSkip(true);
      setPhase("done");
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    document.documentElement.style.overflow = "hidden";
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out for satisfying deceleration.
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setSessionFlag(PRELOADER_KEY);
        window.dispatchEvent(new Event("preloader:done"));
        setPhase("done");
        document.documentElement.style.overflow = "";
      }
    };
    requestAnimationFrame(tick);

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [reduceMotion]);

  if (skip) return null;

  const progress = count / 100;

  return (
    <AnimatePresence>
      {phase !== "done" || count < 100 ? (
        <motion.div
          key="preloader"
          aria-hidden={phase === "done"}
          initial={{ opacity: 1 }}
          animate={phase === "done" ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            if (phase === "done") setSkip(true);
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Monogram draw-in */}
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            fill="none"
            className="mb-8"
          >
            <defs>
              <linearGradient id="preload-grad" x1="0" y1="0" x2="96" y2="96">
                <stop offset="0%" stopColor="#8B6DFF" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <motion.rect
              x="4"
              y="4"
              width="88"
              height="88"
              rx="24"
              stroke="url(#preload-grad)"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M34 30V66M62 30V66M34 48H62"
              stroke="url(#preload-grad)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          <p className="font-display text-sm uppercase tracking-[0.35em] text-muted">
            {siteConfig.name} — Portfolio
          </p>

          {/* Counter + progress line */}
          <div className="absolute bottom-12 left-1/2 w-56 -translate-x-1/2">
            <div className="mb-3 flex items-end justify-between">
              <span className="text-xs uppercase tracking-widest text-muted">
                Loading
              </span>
              <span className="font-display text-2xl font-semibold tabular-nums text-foreground">
                {count}%
              </span>
            </div>
            <div className="h-px w-full overflow-hidden rounded bg-border/15">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-cyan"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
