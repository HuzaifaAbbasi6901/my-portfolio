"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Clock, Search, Tag } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Blog index with live search and tag filtering. */
export function BlogIndex({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
    return [...tags].sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = !activeTag || post.tags.includes(activeTag);
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [posts, query, activeTag]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts…"
            aria-label="Search posts"
            className="w-full liquid rounded-full py-3 pl-11 pr-4 text-sm outline-none backdrop-blur-md transition-all duration-300 placeholder:text-muted focus:border-accent/60 focus:shadow-glow"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300",
              activeTag === null
                ? "border-accent bg-accent text-white"
                : "border-border/15 text-muted hover:border-accent/40 hover:text-foreground"
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300",
                activeTag === tag
                  ? "border-accent bg-accent text-white"
                  : "border-border/15 text-muted hover:border-accent/40 hover:text-foreground"
              )}
            >
              <Tag className="h-3 w-3" aria-hidden />
              {tag}
            </button>
          ))}
        </div>
      </div>

      <motion.ul layout className="grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((post) => (
            <motion.li
              key={post.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-3xl liquid p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
              >
                <div className="flex items-center gap-3 text-xs text-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-border/30" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {post.readingMinutes} min read
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {post.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/10 px-2.5 py-1 font-mono text-[11px] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted">
          No posts match “{query}”. Try a different search.
        </p>
      ) : null}
    </div>
  );
}
