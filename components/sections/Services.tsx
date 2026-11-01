"use client";

import { useRef, type MouseEvent } from "react";
import { Code, Palette, Sparkles, Gauge } from "lucide-react";
import { siteConfig } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, SplitText } from "@/components/ui/Reveal";

const iconMap = {
  code: Code,
  palette: Palette,
  sparkles: Sparkles,
  gauge: Gauge,
} as const;

export function Services() {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  function trackCursor(event: MouseEvent<HTMLDivElement>, index: number) {
    const el = cardRefs.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <section aria-label="Services" className="relative py-28 sm:py-36">
      <div className="container">
        <SectionHeading
          eyebrow="Services"
          title={
            <SplitText text="What I can do for you." as="span" onScroll />
          }
          align="center"
          className="max-w-xl"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] ?? Code;
            return (
              <Reveal key={service.title} delay={index * 0.07}>
                <div
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  onMouseMove={(event) => trackCursor(event, index)}
                  className="group relative h-full overflow-hidden rounded-3xl liquid p-7 transition-colors duration-500 hover:border-accent/30"
                >
                  {/* Cursor glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--rgb-accent) / 0.12), transparent 60%)",
                    }}
                  />
                  <div className="relative">
                    <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-cyan/10 text-accent transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:shadow-glow">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="font-display text-lg font-semibold tracking-tight">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
