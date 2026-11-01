"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const PHRASES = [
  "Available for freelance",
  "Web apps",
  "3D experiences",
  "Design systems",
  "Performance obsessing",
  "Open to collaborations",
];

/**
 * Infinite marquee band whose speed and direction react to scroll velocity.
 */
export function MarqueeBand() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let speed = 1;
    let targetSpeed = 1;

    const content = track.innerHTML;

    const tick = () => {
      // Ease actual speed toward the velocity-derived target.
      speed += (targetSpeed - speed) * 0.08;
      // Speed decays back to a gentle drift.
      targetSpeed += (1 - targetSpeed) * 0.02;

      const half = track.scrollWidth / 2;
      if (half <= 0) return;
      x -= speed;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      gsap.set(track, { x });
    };
    gsap.ticker.add(tick);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        if (Math.abs(velocity) > 100) {
          targetSpeed = gsap.utils.clamp(-5, 5, velocity / 350);
          if (Math.abs(targetSpeed) < 1) {
            targetSpeed = Math.sign(targetSpeed || 1) * 1;
          }
        }
      },
    });

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      track.innerHTML = content;
    };
  }, []);

  const items = [...PHRASES, ...PHRASES];

  return (
    <section
      ref={sectionRef}
      aria-label="Services marquee"
      className="relative overflow-hidden border-y border-border/10 bg-card/[0.03] py-6"
    >
      <div
        ref={trackRef}
        className="flex w-max items-center gap-10 whitespace-nowrap will-change-transform"
      >
        {items.map((phrase, index) => (
          <span
            key={`${phrase}-${index}`}
            className="flex items-center gap-10 font-display text-2xl font-semibold tracking-tight text-foreground/70 sm:text-3xl"
          >
            {phrase}
            <span aria-hidden className="text-accent">
              ✦
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
