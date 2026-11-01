"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SoundToggle } from "@/components/layout/SoundToggle";
import { Magnetic } from "@/components/ui/Button";
import { playSound } from "@/lib/sound";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

const sectionIds = ["about", "skills", "work", "experience", "contact"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();
  const { scrollTo, lenis } = useSmoothScroll();

  // Shrink + hide/show on scroll direction.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > lastY.current && y > 140 && !menuOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    if (menuOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen, lenis]);

  // Active-section highlighting via IntersectionObserver.
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  const isHome = pathname === "/";

  function handleNavClick(event: React.MouseEvent, href: string) {
    playSound("click");
    setMenuOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (isHome) {
        event.preventDefault();
        scrollTo(`#${id}`);
      }
      // Otherwise let Next.js navigate home; SmoothScroll resets position.
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[80] flex justify-center px-4 pt-4"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "liquid liquid-hover flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ease-out-expo",
            scrolled || menuOpen
              ? "opacity-100"
              : "!bg-transparent !border-transparent !shadow-none backdrop-blur-none before:hidden"
          )}
        >
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            aria-label="Back to top — home"
            className="flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-cyan font-display text-sm font-bold text-white shadow-glow">
              {siteConfig.initials}
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-wide sm:block">
              {siteConfig.name}
              <span className="text-accent">.</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href.startsWith("/#") && isHome
                  ? active === link.href.slice(2)
                  : link.href === pathname;
              return (
                <li key={link.href}>
                  <Magnetic strength={0.25}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-sm transition-colors duration-300 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                        isActive ? "text-foreground" : "text-muted"
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-full bg-card/60"
                          transition={{ type: "spring", stiffness: 320, damping: 30 }}
                        />
                      ) : null}
                      <span className="relative">{link.label}</span>
                    </Link>
                  </Magnetic>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden md:block">
              <SoundToggle />
            </span>
            <ThemeToggle />
            <Link
              href="/#contact"
              onClick={(e) => handleNavClick(e, "/#contact")}
              className="ml-1 hidden rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-all duration-300 hover:brightness-110 active:scale-95 lg:block"
            >
              Hire me
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="liquid flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[75] flex flex-col justify-center bg-background/80 px-8 backdrop-blur-3xl md:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="space-y-2">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{
                      delay: 0.06 * index + 0.1,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="group flex items-center justify-between border-b border-border/10 py-4 font-display text-3xl font-semibold tracking-tight"
                    >
                      {link.label}
                      <ArrowUpRight
                        className="h-6 w-6 text-accent opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-10 flex items-center justify-between"
            >
              <p className="text-sm text-muted">{siteConfig.email}</p>
              <div className="flex gap-2">
                <SoundToggle />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
