"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  siTypescript,
  siJavascript,
  siReact,
  siNextdotjs,
  siTailwindcss,
  siThreedotjs,
  siFramer,
  siNodedotjs,
  siPostgresql,
  siGraphql,
  siRedis,
  siPython,
  siDocker,
  siGit,
  siGithub,
  siVercel,
  siFigma,
  siPrisma,
  siVite,
  siVitest,
  siSass,
  siWebpack,
  siStorybook,
  siOpenai,
  type SimpleIcon,
} from "simple-icons";
import { skillCategories, featuredSkills, marqueeSkills } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const iconMap: Record<string, SimpleIcon> = {
  typescript: siTypescript,
  javascript: siJavascript,
  react: siReact,
  nextdotjs: siNextdotjs,
  tailwindcss: siTailwindcss,
  threedotjs: siThreedotjs,
  framer: siFramer,
  nodedotjs: siNodedotjs,
  postgresql: siPostgresql,
  graphql: siGraphql,
  redis: siRedis,
  python: siPython,
  docker: siDocker,
  git: siGit,
  github: siGithub,
  vercel: siVercel,
  figma: siFigma,
  prisma: siPrisma,
  vite: siVite,
  vitest: siVitest,
  sass: siSass,
  webpack: siWebpack,
  storybook: siStorybook,
  openai: siOpenai,
};

/** Animated SVG progress ring. */
function SkillRing({ name, level }: { name: string; level: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="6"
            className="stroke-border/15"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke="url(#skill-ring-gradient)"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference * (1 - level / 100) }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="skill-ring-gradient" x1="0" y1="0" x2="120" y2="120">
              <stop offset="0%" stopColor="#8B6DFF" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold tabular-nums">
          {level}%
        </span>
      </div>
      <p className="text-sm font-medium text-muted">{name}</p>
    </div>
  );
}

/** Animated proficiency bar. */
function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium">{name}</span>
        <span className="font-mono text-xs tabular-nums text-muted">{level}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-cyan"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

/** Icon tile resolved from a simple-icons slug. */
function SkillIcon({ slug }: { slug: string }) {
  const icon = iconMap[slug];
  if (!icon) return null;
  return (
    <svg
      role="img"
      aria-label={icon.title}
      viewBox="0 0 24 24"
      className="h-7 w-7 fill-current text-muted transition-colors duration-300 group-hover:text-foreground"
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}

type ViewMode = "rings" | "bars" | "icons";

export function Skills() {
  const [view, setView] = useState<ViewMode>("bars");

  const tabs: Array<{ id: ViewMode; label: string }> = [
    { id: "bars", label: "Proficiency" },
    { id: "rings", label: "Highlights" },
    { id: "icons", label: "Tech marquee" },
  ];

  return (
    <section id="skills" className="relative py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan/10 blur-[120px]"
      />
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Skills"
            title={<SplitText text="A toolkit refined across dozens of shipped products." as="span" onScroll />}
            className="mb-0"
          />
          <Reveal y={16} className="mb-2">
            <div
              role="tablist"
              aria-label="Skills view"
              className="flex liquid rounded-full p-1"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={view === tab.id}
                  onClick={() => setView(tab.id)}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-xs font-medium transition-colors duration-300",
                    view === tab.id ? "text-white" : "text-muted hover:text-foreground"
                  )}
                >
                  {view === tab.id ? (
                    <motion.span
                      layoutId="skills-tab"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative">{tab.label}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-14">
          {view === "rings" ? (
            <Reveal className="grid grid-cols-2 justify-items-center gap-10 sm:grid-cols-4" stagger={0.08}>
              {featuredSkills.map((skill) => (
                <SkillRing key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </Reveal>
          ) : null}

          {view === "bars" ? (
            <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
              {skillCategories.map((category) => (
                <Reveal key={category.id}>
                  <h3 className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                    <span aria-hidden className="h-px w-6 bg-gold/50" />
                    {category.label}
                  </h3>
                  <div className="space-y-5">
                    {category.skills.map((skill) => (
                      <SkillBar key={skill.name} name={skill.name} level={skill.level} />
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          ) : null}

          {view === "icons" ? (
            <Reveal>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
                {marqueeSkills.map((slug) => (
                  <div
                    key={slug}
                    className="group flex aspect-square items-center justify-center rounded-2xl liquid transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-card/10"
                  >
                    <SkillIcon slug={slug} />
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
