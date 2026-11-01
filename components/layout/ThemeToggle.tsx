"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

/** Sun/moon morphing toggle with no hydration flash. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`liquid relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-colors hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className ?? ""}`}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ y: 14, opacity: 0, rotate: -30 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex"
      >
        {isDark ? (
          <Moon className="h-[18px] w-[18px] text-foreground" aria-hidden />
        ) : (
          <Sun className="h-[18px] w-[18px] text-foreground" aria-hidden />
        )}
      </motion.span>
    </button>
  );
}
