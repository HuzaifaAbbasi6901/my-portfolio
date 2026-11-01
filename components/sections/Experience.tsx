"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, GraduationCap, Award, ChevronDown } from "lucide-react";
import { timeline, certifications, type TimelineItem } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const kindIcons = {
  work: Briefcase,
  education: GraduationCap,
  certification: Award,
} as const;

function TimelineEntry({ item, index }: { item: TimelineItem; index: number }) {
  const [expanded, setExpanded] = useState(item.current ?? false);
  const Icon = kindIcons[item.kind];

  return (
    <motion.li
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-14 sm:pl-20"
    >
      {/* Glowing node */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500",
          item.current
            ? "border-accent/60 bg-accent/15 shadow-glow"
            : "border-border/20 bg-surface"
        )}
      >
        <Icon className={cn("h-4 w-4", item.current ? "text-accent" : "text-muted")} aria-hidden />
        {item.current ? (
          <span className="animate-ping-soft absolute inset-0 rounded-full border border-accent/60" />
        ) : null}
      </span>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="group w-full rounded-3xl liquid p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-card/[0.08] sm:p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-accent">{item.org}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-border/10 bg-card/50 px-3 py-1 font-mono text-xs text-muted">
              {item.period}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted transition-transform duration-300",
                expanded && "rotate-180"
              )}
              aria-hidden
            />
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{item.summary}</p>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2.5 border-t border-border/10 pt-4">
                {item.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cyan" aria-hidden />
                    {highlight}
                  </li>
                ))}
              </div>
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </button>
    </motion.li>
  );
}

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // Timeline spine draws itself on scroll.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }
      );
    }, section);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-28 sm:py-36"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Experience"
          title={
            <SplitText text="A decade of shipping, in five chapters." as="span" onScroll />
          }
        />

        <div className="relative">
          {/* Static spine */}
          <div
            aria-hidden
            className="absolute bottom-4 left-[17px] top-4 w-px bg-border/10 sm:left-[23px]"
          />
          {/* Animated draw-in spine */}
          <div
            ref={lineRef}
            aria-hidden
            className="absolute bottom-4 left-[17px] top-4 w-px origin-top bg-gradient-to-b from-accent via-cyan to-transparent sm:left-[23px]"
            style={{ transform: "scaleY(0)" }}
          />

          <ol className="space-y-6">
            {timeline.map((item, index) => (
              <TimelineEntry key={item.id} item={item} index={index} />
            ))}
          </ol>
        </div>

        {/* Certifications */}
        <Reveal className="mt-16">
          <h3 className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            <span aria-hidden className="h-px w-6 bg-gold/50" />
            Certifications & awards
          </h3>
          <ul className="flex flex-wrap gap-2.5">
            {certifications.map((cert) => (
              <li
                key={cert}
                className="flex items-center gap-2 rounded-full liquid px-4 py-2 text-xs text-muted transition-colors duration-300 hover:border-gold/40 hover:text-foreground"
              >
                <Award className="h-3.5 w-3.5 text-gold" aria-hidden />
                {cert}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
