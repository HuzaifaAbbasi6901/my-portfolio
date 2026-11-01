"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Download, MapPin } from "lucide-react";
import { siteConfig } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Button } from "@/components/ui/Button";

const statItems = [
  { value: siteConfig.stats.years, suffix: "+", label: "Years of experience" },
  { value: siteConfig.stats.projects, suffix: "+", label: "Projects shipped" },
  { value: siteConfig.stats.clients, suffix: "", label: "Happy clients" },
  { value: siteConfig.stats.certifications, suffix: "", label: "Certifications" },
];

export function About() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="container grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Portrait */}
        <Reveal className="relative mx-auto w-full max-w-md">
          <motion.div
            whileHover={reduceMotion ? undefined : { rotate: -1.5, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-accent/25 via-transparent to-cyan/25 blur-2xl"
            />
            <div className="relative overflow-hidden liquid rounded-[2rem] shadow-soft">
              <Image
                src="/images/about/portrait.svg"
                alt={`Portrait illustration of ${siteConfig.name}`}
                width={640}
                height={760}
                className="h-auto w-full"
                priority={false}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-5 left-1/2 flex w-max -translate-x-1/2 items-center gap-2 rounded-2xl border border-border/15 bg-surface/90 px-4 py-2.5 shadow-soft backdrop-blur-xl"
            >
              <MapPin className="h-4 w-4 text-accent" aria-hidden />
              <span className="text-xs font-medium">{siteConfig.location}</span>
            </motion.div>
          </motion.div>
        </Reveal>

        {/* Bio */}
        <div>
          <SectionHeading
            eyebrow="About me"
            title={
              <SplitText text="Design-minded engineer, motion-obsessed builder." as="span" onScroll />
            }
          />
          <Reveal className="space-y-5 text-base leading-relaxed text-muted sm:text-lg" stagger={0.12}>
            {siteConfig.bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </Reveal>

          {/* Stat counters */}
          <Reveal className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4" stagger={0.08}>
            {statItems.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl liquid p-4 text-center backdrop-blur-sm transition-colors duration-300 hover:border-accent/30"
              >
                <p className="font-display text-3xl font-bold tracking-tight">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1.5 text-xs leading-snug text-muted">{stat.label}</p>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-10" y={16}>
            <Button variant="secondary" href={siteConfig.resumePath} download>
              <Download className="h-4 w-4" aria-hidden />
              Download full resume
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
