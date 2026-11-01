"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, Tag } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { siteConfig } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { formatDate } from "@/lib/utils";

export function BlogPreview({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" aria-label="Latest writing" className="relative py-28 sm:py-36">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Writing"
            title={
              <SplitText text="Notes from the craft." as="span" onScroll />
            }
            className="mb-0"
          />
          <Reveal y={16} className="mb-2">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-border/15 px-5 py-2.5 text-sm text-muted transition-all duration-300 hover:border-accent/40 hover:text-foreground"
            >
              All posts
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </Reveal>
        </div>

        <Reveal className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.08}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-3xl liquid p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
            >
              <div className="flex items-center gap-3 text-xs text-muted">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden className="h-1 w-1 rounded-full bg-border/30" />
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {post.readingMinutes} min
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                {post.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full border border-border/10 px-2.5 py-1 text-[11px] text-muted"
                  >
                    <Tag className="h-3 w-3" aria-hidden />
                    {tag}
                  </span>
                ))}
                <ArrowUpRight
                  className="ml-auto h-4 w-4 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  aria-hidden
                />
              </div>
            </Link>
          ))}
        </Reveal>

        <p className="mt-8 text-center text-xs text-muted">
          RSS available at{" "}
          <a href="/feed.xml" className="text-accent hover:underline">
            /feed.xml
          </a>{" "}
          — {siteConfig.name}&apos;s field notes.
        </p>
      </div>
    </section>
  );
}
