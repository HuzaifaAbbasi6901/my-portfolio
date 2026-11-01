"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { siteConfig } from "@/data/site";
import { SplitText } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { useCommandPalette } from "@/components/layout/CommandPalette";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";

/** Typewriter role rotator. */
function RoleRotator() {
  const roles = siteConfig.roles;
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex % roles.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text === "") {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    } else {
      const speed = deleting ? 32 : 64;
      timeout = setTimeout(
        () =>
          setText(
            deleting
              ? current.slice(0, text.length - 1)
              : current.slice(0, text.length + 1)
          ),
        speed
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, roles]);

  return (
    <p className="flex h-7 items-center font-mono text-sm text-muted sm:text-base">
      <span className="mr-2 text-gold" aria-hidden>
        {"//"}
      </span>
      {text}
      <span className="animate-caret ml-0.5 inline-block h-[1.1em] w-[2px] bg-cyan" aria-hidden />
    </p>
  );
}

export function Hero() {
  const { scrollTo } = useSmoothScroll();
  const { setOpen: setPaletteOpen } = useCommandPalette();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* 3D scene */}
      <HeroCanvas />

      {/* Gradient mesh blobs (parallax background) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: -60 }}
          className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-accent/20 blur-[140px]"
        />
        <motion.div
          style={{ y: 40 }}
          className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-cyan/15 blur-[130px]"
        />
      </div>

      {/* Film grain */}
      <div aria-hidden className="noise-overlay" />

      <div className="container relative z-10 pb-24 pt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="liquid mb-7 inline-flex items-center gap-3 rounded-full py-1.5 pl-3 pr-4"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-medium tracking-wide text-muted">
            {siteConfig.availability}
          </span>
        </motion.div>

        <h1 className="max-w-4xl font-display font-bold leading-[1.04] tracking-tight">
          <SplitText text="Crafting digital" className="block text-display-xl" delay={0.15} />
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em] text-display-xl">
            <motion.span
              className="block bg-gradient-to-r from-accent via-[#b49aff] to-cyan bg-clip-text text-transparent will-change-transform"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              experiences that
            </motion.span>
          </span>
          <SplitText text="feel alive." className="block text-display-xl" delay={0.45} />
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-2xl"
        >
          <RoleRotator />
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {siteConfig.tagline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button onClick={() => scrollTo("#work")}>
            View my work
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Button>
          <Button variant="secondary" onClick={() => scrollTo("#contact")}>
            Get in touch
          </Button>
          <Button variant="ghost" href={siteConfig.resumePath} download>
            <Download className="h-4 w-4" aria-hidden />
            Resume
          </Button>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="liquid ml-1 hidden items-center gap-2 rounded-full px-4 py-2 text-xs text-muted transition-colors hover:border-accent/40 hover:text-foreground lg:flex"
            aria-label="Open command palette"
          >
            Press
            <kbd className="rounded border border-border/25 bg-card/10 px-1.5 py-0.5 font-sans text-[10px] text-foreground/90">
              Ctrl + K
            </kbd>
            to explore
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        type="button"
        onClick={() => scrollTo("#about")}
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-foreground"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </motion.button>
    </section>
  );
}
