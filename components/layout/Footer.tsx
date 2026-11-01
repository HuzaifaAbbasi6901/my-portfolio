"use client";

import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Twitter, Instagram, Mail } from "lucide-react";
import { siteConfig } from "@/data/site";
import { useCommandPalette } from "@/components/layout/CommandPalette";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";
import { Magnetic } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const socialIcons: Record<string, React.ReactNode> = {
  GitHub: <Github className="h-4 w-4" aria-hidden />,
  LinkedIn: <Linkedin className="h-4 w-4" aria-hidden />,
  "X / Twitter": <Twitter className="h-4 w-4" aria-hidden />,
  Instagram: <Instagram className="h-4 w-4" aria-hidden />,
};

export function Footer() {
  const { setOpen } = useCommandPalette();
  const { scrollTo } = useSmoothScroll();

  return (
    <footer className="relative overflow-hidden border-t border-border/10">
      {/* Glow blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]"
      />

      <div className="container relative py-24">
        {/* Big animated CTA */}
        <Reveal className="mb-20 text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Have an idea?
          </p>
          <Magnetic strength={0.12}>
            <Link
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#contact");
              }}
              className="group inline-block font-display text-display font-bold leading-[1.05] tracking-tight"
              data-cursor-label="Let's go"
            >
              Let&apos;s build something
              <br />
              <span className="bg-gradient-to-r from-accent via-cyan to-accent bg-[length:200%_100%] bg-clip-text text-transparent transition-[background-position] duration-700 ease-out-expo group-hover:bg-right">
                extraordinary
              </span>
              <ArrowUpRight
                className="ml-3 inline h-[0.7em] w-[0.7em] text-accent transition-transform duration-500 ease-out-expo group-hover:-translate-y-2 group-hover:translate-x-2"
                aria-hidden
              />
            </Link>
          </Magnetic>
        </Reveal>

        <div className="flex flex-col items-center justify-between gap-10 border-t border-border/10 pt-12 md:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-cyan font-display text-sm font-bold text-white">
              {siteConfig.initials}
            </span>
            <div>
              <p className="font-display text-sm font-semibold">
                {siteConfig.name}
                <span className="text-accent">.</span>
              </p>
              <p className="text-xs text-muted">{siteConfig.role}</p>
            </div>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <li>
                <Link href="/blog" className="transition-colors hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <a href={siteConfig.resumePath} download className="transition-colors hover:text-foreground">
                  Resume
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="transition-colors hover:text-foreground"
                >
                  Command menu{" "}
                  <kbd className="rounded border border-border/15 px-1 py-0.5 text-[10px]">
                    Ctrl + K
                  </kbd>
                </button>
              </li>
            </ul>
          </nav>

          <ul className="flex items-center gap-2">
            {siteConfig.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full liquid text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-foreground"
                >
                  {socialIcons[social.label] ?? <Mail className="h-4 w-4" aria-hidden />}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 text-xs text-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Built with Next.js, Three.js & GSAP — designed with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
