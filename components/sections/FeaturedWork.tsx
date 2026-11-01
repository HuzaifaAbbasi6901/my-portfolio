"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * GSAP-pinned horizontal gallery for featured projects. On small screens it
 * degrades to a native horizontal snap scroller.
 */
export function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    if (!isDesktop || isReduced) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [isDesktop, isReduced]);

  const featured = projects.filter((p) => p.featured);

  return (
    <section
      ref={sectionRef}
      aria-label="Featured work"
      className="relative overflow-hidden py-28 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-0"
    >
      <div className="container mb-12 lg:mb-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              <span aria-hidden className="h-px w-8 bg-gold/60" />
              Featured work
            </p>
            <h2 className="font-display text-display-sm font-semibold leading-tight tracking-tight">
              Selected projects,
              <span className="text-muted"> scrolled like stories.</span>
            </h2>
          </div>
          <p className="hidden text-sm text-muted lg:block">
            Keep scrolling <span aria-hidden>→</span>
          </p>
        </div>
      </div>

      <div className="lg:overflow-visible">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-4 lg:overflow-visible lg:px-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featured.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              data-cursor-label="View"
              className="group relative w-[82vw] shrink-0 snap-center overflow-hidden rounded-3xl liquid sm:w-[26rem] lg:w-[34rem]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.title} preview artwork`}
                  fill
                  sizes="(max-width: 1024px) 82vw, 34rem"
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                />
                <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                  {String(index + 1).padStart(2, "0")} — {project.category}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {project.summary}
                  </p>
                  <p className="mt-3 font-mono text-xs text-accent">
                    {project.tech.slice(0, 3).join(" · ")}
                  </p>
                </div>
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/15 transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </Link>
          ))}

          <div className="hidden w-6 shrink-0 lg:block" aria-hidden />
        </div>
      </div>
    </section>
  );
}
