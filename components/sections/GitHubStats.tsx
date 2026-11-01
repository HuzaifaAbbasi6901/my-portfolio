"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, Users, FolderGit2 } from "lucide-react";
import type { GitHubStats as GitHubStatsData } from "@/lib/github";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";

const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Go: "#00add8",
  Python: "#3572a5",
  Rust: "#dea584",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Vue: "#41b883",
  Dart: "#00b4ab",
};

export function GitHubStats({ stats }: { stats: GitHubStatsData }) {
  const isFallback =
    stats.profile.publicRepos === 0 && stats.profile.followers === 0;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section aria-label="Open source activity" className="relative py-28 sm:py-36">
      <div className="container">
        <SectionHeading
          eyebrow="Open source"
          title={
            <SplitText text="Live from my GitHub." as="span" onScroll />
          }
          description={
            isFallback
              ? "Placeholder stats — set GITHUB_USERNAME in your environment to stream real numbers with hourly ISR caching."
              : undefined
          }
        />

        <Reveal className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Profile card */}
          <div className="rounded-3xl liquid p-8 backdrop-blur-sm">
            <div className="flex items-center gap-5">
              {stats.profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={stats.profile.avatarUrl}
                  alt={`${stats.profile.name} GitHub avatar`}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-2xl border border-border/15"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-cyan font-display text-xl font-bold text-white">
                  {"</>"}
                </span>
              )}
              <div>
                <p className="font-display text-lg font-semibold">{stats.profile.name}</p>
                <p className="text-sm text-muted">
                  {isFallback ? "Connect GitHub to go live" : "on GitHub"}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border/10 bg-background/40 p-4">
                <Users className="mb-2 h-4 w-4 text-accent" aria-hidden />
                <p className="font-display text-2xl font-bold tabular-nums">
                  {mounted ? <Counter value={stats.profile.followers} /> : "0"}
                </p>
                <p className="text-xs text-muted">Followers</p>
              </div>
              <div className="rounded-2xl border border-border/10 bg-background/40 p-4">
                <FolderGit2 className="mb-2 h-4 w-4 text-cyan" aria-hidden />
                <p className="font-display text-2xl font-bold tabular-nums">
                  {mounted ? <Counter value={stats.profile.publicRepos} /> : "0"}
                </p>
                <p className="text-xs text-muted">Repositories</p>
              </div>
            </div>

            {/* Language share */}
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                Top languages
              </p>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-border/10">
                {stats.topLanguages.map((lang) => (
                  <motion.div
                    key={lang.name}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.share}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: langColors[lang.name] ?? "#8B6DFF" }}
                    title={`${lang.name} ${lang.share}%`}
                  />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                {stats.topLanguages.map((lang) => (
                  <li key={lang.name} className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full"
                      style={{ background: langColors[lang.name] ?? "#8B6DFF" }}
                    />
                    {lang.name} · {lang.share}%
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top repositories */}
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.topRepos.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-3xl liquid p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
              >
                <p className="font-mono text-sm font-semibold text-accent">
                  {repo.name}
                </p>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
                  {repo.description || "No description provided."}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-gold" aria-hidden />
                    {repo.stars.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GitFork className="h-3.5 w-3.5" aria-hidden />
                    {repo.forks.toLocaleString()}
                  </span>
                  <span className="ml-auto font-mono">{repo.language}</span>
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
