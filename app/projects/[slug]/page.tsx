import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github, User } from "lucide-react";
import { getAdjacentProjects, getProject, projects } from "@/data/projects";
import { siteConfig, siteUrl } from "@/data/site";
import { Lightbox } from "@/components/projects/Lightbox";
import { Reveal } from "@/components/ui/Reveal";

interface CaseStudyProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: CaseStudyProps): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.summary,
      url: siteUrl(`projects/${project.slug}`),
      images: [
        { url: `/og/projects/${project.slug}.png`, width: 1200, height: 630 },
      ],
    },
  };
}

export default function CaseStudyPage({ params }: CaseStudyProps) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(project.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: siteUrl("#work"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: siteUrl(`projects/${project.slug}`),
      },
    ],
  };

  return (
    <article className="pb-28 pt-36 sm:pt-44">
      {/* Hero */}
      <div className="container">
        <Link
          href="/#work"
          className="group mb-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden
          />
          All projects
        </Link>

        <Reveal>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="rounded-full border border-border/15 px-3 py-1">
              {project.category}
            </span>
            <span>{project.year}</span>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-display font-bold leading-[1.06] tracking-tight">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {project.summary}
          </p>
        </Reveal>

        <Reveal y={32} className="relative mt-12">
          <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem] border border-border/10">
            <Image
              src={project.image}
              alt={`${project.title} hero artwork`}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>

        {/* Meta grid */}
        <Reveal className="mt-12 grid gap-8 border-y border-border/10 py-10 md:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Tech stack
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border/10 bg-card/[0.04] px-4 py-1.5 font-mono text-xs text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              <User className="h-3.5 w-3.5" aria-hidden /> My role
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">{project.role}</p>
          </div>
        </Reveal>

        {/* Narrative */}
        <div className="mt-16 grid gap-14 lg:grid-cols-3">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Overview</h2>
            <p className="mt-4 leading-relaxed text-muted">{project.description}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-2xl font-semibold tracking-tight">The problem</h2>
            <p className="mt-4 leading-relaxed text-muted">{project.problem}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <h2 className="font-display text-2xl font-semibold tracking-tight">The solution</h2>
            <p className="mt-4 leading-relaxed text-muted">{project.solution}</p>
          </Reveal>
        </div>

        {/* Results */}
        <Reveal className="mt-16 grid gap-4 sm:grid-cols-3">
          {project.results.map((result) => (
            <div
              key={result.label}
              className="rounded-3xl border border-border/10 bg-card/[0.04] p-7 text-center"
            >
              <p className="font-display text-3xl font-bold tracking-tight text-gradient">
                {result.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted">
                {result.label}
              </p>
            </div>
          ))}
        </Reveal>

        {/* Gallery */}
        <Reveal className="mt-16">
          <h2 className="mb-8 font-display text-2xl font-semibold tracking-tight">Gallery</h2>
          <Lightbox images={project.gallery} alt={project.title} />
        </Reveal>

        {/* Links */}
        <Reveal className="mt-16 flex flex-wrap gap-4">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white shadow-glow transition-all duration-300 hover:brightness-110 active:scale-[0.97]"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            View live site
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-border/15 bg-card/40 px-7 py-3.5 text-sm font-medium backdrop-blur-md transition-all duration-300 hover:border-accent/50"
          >
            <Github className="h-4 w-4" aria-hidden />
            Source code
          </a>
        </Reveal>
      </div>

      {/* Prev / next */}
      <nav
        aria-label="Project navigation"
        className="container mt-24 grid gap-4 border-t border-border/10 pt-10 sm:grid-cols-2"
      >
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group rounded-3xl border border-border/10 bg-card/[0.04] p-6 transition-all duration-300 hover:border-accent/40"
          >
            <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Previous
            </p>
            <p className="font-display text-lg font-semibold group-hover:text-accent">
              {prev.title}
            </p>
          </Link>
        ) : (
          <span aria-hidden />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group rounded-3xl border border-border/10 bg-card/[0.04] p-6 text-right transition-all duration-300 hover:border-accent/40"
          >
            <p className="mb-2 flex items-center justify-end gap-2 text-xs uppercase tracking-widest text-muted">
              Next <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </p>
            <p className="font-display text-lg font-semibold group-hover:text-accent">
              {next.title}
            </p>
          </Link>
        ) : null}
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
