"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, projectCategories, type Project } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard className="h-full" maxTilt={6}>
      <Link
        href={`/projects/${project.slug}`}
        data-cursor-label="View"
        className="flex h-full flex-col"
        aria-label={`Open case study: ${project.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl">
          <Image
            src={project.image}
            alt={`${project.title} preview artwork`}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30rem"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            {project.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-lg font-semibold tracking-tight">
              {project.title}
            </h3>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/15 text-muted transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">
            {project.summary}
          </p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {project.tech.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/10 bg-card/50 px-2.5 py-1 font-mono text-[11px] text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

export function ProjectsSection() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section id="work" className="relative py-28 sm:py-36">
      <div className="container">
        <SectionHeading
          eyebrow="All projects"
          title={
            <SplitText text="Work that shipped, scaled and won attention." as="span" onScroll />
          }
          description="Filter by discipline — every card opens a full case study with the problem, the approach and the results."
        />

        <Reveal y={16} className="mb-10">
          <div
            role="tablist"
            aria-label="Filter projects"
            className="flex flex-wrap gap-2"
          >
            {projectCategories.map((category) => (
              <button
                key={category}
                role="tab"
                aria-selected={filter === category}
                onClick={() => setFilter(category)}
                className={cn(
                  "rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300",
                  filter === category
                    ? "border-accent bg-accent text-white shadow-glow"
                    : "border-border/15 bg-card/40 text-muted hover:border-accent/40 hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
