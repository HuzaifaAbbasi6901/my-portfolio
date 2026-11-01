"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { siteConfig } from "@/data/site";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Easter egg: Konami code triggers a confetti burst. */
export function KonamiEgg() {
  useEffect(() => {
    let index = 0;

    const onKey = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      index = key === KONAMI[index] ? index + 1 : key === KONAMI[0] ? 1 : 0;

      if (index === KONAMI.length) {
        index = 0;
        const colors = ["#8B6DFF", "#22D3EE", "#E8C898", "#ffffff"];
        confetti({
          particleCount: 180,
          spread: 100,
          startVelocity: 42,
          origin: { y: 0.6 },
          colors,
        });
        setTimeout(
          () =>
            confetti({
              particleCount: 80,
              angle: 60,
              spread: 60,
              origin: { x: 0, y: 0.7 },
              colors,
            }),
          150
        );
        setTimeout(
          () =>
            confetti({
              particleCount: 80,
              angle: 120,
              spread: 60,
              origin: { x: 1, y: 0.7 },
              colors,
            }),
          300
        );
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}

/** One-shot confetti helper shared by other interactions. */
export function burstConfetti(origin?: { x: number; y: number }) {
  confetti({
    particleCount: 90,
    spread: 70,
    origin: origin ?? { y: 0.7 },
    colors: ["#8B6DFF", "#22D3EE", "#E8C898"],
    zIndex: 120,
  });
}

export const konamiHint = `${siteConfig.name} loves easter eggs — try the Konami code.`;
