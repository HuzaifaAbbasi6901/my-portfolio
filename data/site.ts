/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — the single place to edit everything about you.
 *  Items marked `TODO:` are realistic placeholders; replace them with your
 *  real details and the whole site updates automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  // TODO: Replace with your full name
  name: "Huzaifa",
  // TODO: Your role / title
  role: "Full-Stack Developer & UI Engineer",
  initials: "H",

  // TODO: One line about what you do
  tagline:
    "I design and build elegant, high-performance web experiences — from pixel-perfect interfaces to resilient back ends and interactive 3D.",

  // TODO: 3–5 sentences about you
  bio: [
    "I'm a full-stack developer with a love for the details most people feel but never notice — the easing curve of a transition, the weight of a typeface, the 60fps scroll. For the past five years I've been shipping products for startups and studios, taking ideas from rough sketch to polished, production-ready software.",
    "My sweet spot sits where engineering meets design: design systems, motion-rich interfaces, WebGL experiments and the APIs that power them. I care deeply about accessibility, performance budgets and code that the next developer enjoys reading.",
    "Away from the keyboard you'll find me sketching interface ideas, contributing to open source, or chasing the perfect espresso shot.",
  ],

  // TODO: Availability status shown in the hero badge
  availability: "Available for freelance & full-time",

  // TODO: Your email address
  email: "hello@huzaifa.dev",

  // TODO: Where are you based?
  location: "Remote · Worldwide",

  // TODO: Point this at your real resume (place the file in /public)
  resumePath: "/resume.pdf",
  resumeFileName: "Huzaifa-Resume.pdf",

  // TODO: Your deployed URL (also set NEXT_PUBLIC_SITE_URL in .env)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-portfolio.vercel.app",

  // TODO: Your GitHub username (used by the live GitHub stats section)
  githubUsername: process.env.GITHUB_USERNAME ?? "your-github-username",

  // TODO: Optional Cal.com booking link (leave empty to hide the button)
  calcomUrl: "",

  keywords: [
    "Full-Stack Developer",
    "UI Engineer",
    "Next.js",
    "React",
    "Three.js",
    "Creative Developer",
    "Portfolio",
  ],

  socials: [
    // TODO: Replace with your real profile URLs
    { label: "GitHub", href: "https://github.com/your-username" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-username" },
    { label: "X / Twitter", href: "https://x.com/your-username" },
    { label: "Instagram", href: "https://www.instagram.com/your-username" },
  ],

  // Animated counters in the About section — TODO: adjust the numbers
  stats: {
    years: 5,
    projects: 40,
    clients: 18,
    certifications: 6,
  },

  roles: [
    "Full-Stack Developer",
    "UI Engineer",
    "Creative Technologist",
    "3D Web Enthusiast",
  ],

  services: [
    {
      title: "Web Development",
      description:
        "End-to-end product builds — from Next.js front ends to APIs and databases. Typed, tested and deploy-ready.",
      icon: "code",
    },
    {
      title: "Interface Design",
      description:
        "Design systems, Figma-to-code and pixel-perfect UI with a relentless eye for typography, spacing and hierarchy.",
      icon: "palette",
    },
    {
      title: "Motion & 3D",
      description:
        "Scroll storytelling, micro-interactions and WebGL scenes that make products feel alive — without sacrificing performance.",
      icon: "sparkles",
    },
    {
      title: "Performance & SEO",
      description:
        "Core Web Vitals audits, Lighthouse 90+ rescues, technical SEO and accessibility that meets WCAG AA.",
      icon: "gauge",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Resolve a URL against the site base URL. */
export function siteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
