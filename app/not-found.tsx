"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, MousePointer2 } from "lucide-react";

/** Creative 404: interactive particle canvas that reacts to the cursor. */
export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth * devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * devicePixelRatio);
    const mouse = { x: -9999, y: -9999 };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }

    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1 + Math.random() * 2.2,
    }));

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth * devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * devicePixelRatio;
    };

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) * devicePixelRatio;
      mouse.y = (event.clientY - rect.top) * devicePixelRatio;
    };

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Gentle repulsion from the cursor.
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 * devicePixelRatio && dist > 0) {
          const force = ((140 * devicePixelRatio - dist) / (140 * devicePixelRatio)) * 0.6;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139, 109, 255, 0.55)";
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full"
      />
      <div aria-hidden className="noise-overlay" />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-mono text-sm uppercase tracking-[0.35em] text-gold"
      >
        Error 404
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 font-display text-[clamp(6rem,22vw,14rem)] font-bold leading-none tracking-tighter"
      >
        <span className="bg-gradient-to-r from-accent via-[#b49aff] to-cyan bg-clip-text text-transparent">
          404
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="mt-2 max-w-md text-lg text-muted"
      >
        This page drifted out of orbit. Move your cursor to stir the particles —
        or head back home.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white shadow-glow transition-all duration-300 hover:brightness-110 active:scale-95"
        >
          <Home className="h-4 w-4" aria-hidden />
          Back home
        </Link>
        <span className="flex items-center gap-2 text-sm text-muted">
          <MousePointer2 className="h-4 w-4 text-accent" aria-hidden />
          Psst — try the Konami code anywhere on the site.
        </span>
      </motion.div>
    </div>
  );
}
