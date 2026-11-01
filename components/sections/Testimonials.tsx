"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

const AUTOPLAY_MS = 5200;
const DRAG_THRESHOLD = 80;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const isTouch = useIsTouchDevice();
  const reduceMotion = useReducedMotion();
  const dragX = useRef(0);
  const canDrag = !isTouch && !reduceMotion;

  const go = useCallback(
    (next: number) => {
      const count = testimonials.length;
      setIndex(((next % count) + count) % count);
    },
    []
  );

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => go(index + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [index, paused, go]);

  return (
    <section aria-label="Testimonials" className="relative overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]"
      />
      <div className="container">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <SplitText text="Kind words from good people." as="span" onScroll />
          }
          align="center"
        />

        <div
          className="relative mx-auto max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            className="cursor-grab active:cursor-grabbing"
            drag={canDrag ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragStart={() => setPaused(true)}
            onDragEnd={(_, info) => {
              dragX.current = info.offset.x;
              setPaused(false);
              if (info.offset.x < -DRAG_THRESHOLD) go(index + 1);
              else if (info.offset.x > DRAG_THRESHOLD) go(index - 1);
            }}
          >
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `-${index * 100}%` }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              >
                {testimonials.map((testimonial) => (
                  <figure
                    key={testimonial.name}
                    className="w-full shrink-0 px-1"
                    aria-hidden={testimonials[index].name !== testimonial.name}
                  >
                    <div className="relative rounded-[2rem] liquid p-8 backdrop-blur-sm sm:p-12">
                      <Quote
                        className="absolute -top-5 left-10 h-10 w-10 rounded-2xl border border-border/10 bg-surface p-2 text-accent"
                        aria-hidden
                      />
                      <blockquote className="text-lg leading-relaxed text-foreground/90 sm:text-xl">
                        “{testimonial.quote}”
                      </blockquote>
                      <figcaption className="mt-8 flex items-center gap-4">
                        <span
                          aria-hidden
                          className="flex h-12 w-12 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                          style={{
                            background: `linear-gradient(135deg, ${testimonial.accent}, ${testimonial.accent}88)`,
                          }}
                        >
                          {testimonial.initials}
                        </span>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted">
                            {testimonial.role} · {testimonial.company}
                          </p>
                        </div>
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center gap-2.5" role="tablist" aria-label="Choose testimonial">
            {testimonials.map((testimonial, dotIndex) => (
              <button
                key={testimonial.name}
                type="button"
                role="tab"
                aria-selected={dotIndex === index}
                aria-label={`Testimonial from ${testimonial.name}`}
                onClick={() => go(dotIndex)}
                className={cn(
                  "h-2 rounded-full transition-all duration-400",
                  dotIndex === index
                    ? "w-8 bg-accent"
                    : "w-2 bg-border/25 hover:bg-border/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
