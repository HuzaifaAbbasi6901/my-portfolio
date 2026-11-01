export type ProjectCategory = "Web" | "App" | "AI" | "Design";

export interface ProjectResult {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: string;
  summary: string;
  description: string;
  problem: string;
  solution: string;
  role: string;
  tech: string[];
  image: string;
  gallery: string[];
  results: ProjectResult[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  accent: string; // hex, used for card art tint
}

/**
 * TODO: Replace with your real projects — titles, copy, links and images
 * (drop images in /public/images/projects and update the paths).
 */
export const projects: Project[] = [
  {
    slug: "lumina",
    title: "Lumina",
    category: "AI",
    year: "2025",
    summary:
      "An AI design assistant that turns plain-English prompts into production-ready UI mockups and design tokens.",
    description:
      "Lumina is a web-based AI copilot for product designers. It generates high-fidelity layout suggestions, colour systems and component variants from natural-language briefs, then exports them as design tokens ready for Tailwind or Figma.",
    problem:
      "Design teams spend days on first-draft layouts and token plumbing before any real design thinking starts. Non-designers on product teams had no way to visualise ideas without booking a designer's time.",
    solution:
      "A streaming generation pipeline pairs an LLM with a constrained layout engine: the model proposes structure and copy while a rules-based system enforces grid, contrast and spacing rules. Results render live on an infinite canvas, and one click exports CSS variables, Tailwind config or a Figma plugin payload.",
    role: "Lead full-stack developer — architecture, AI pipeline, canvas editor and design-token exporter.",
    tech: ["Next.js", "TypeScript", "OpenAI", "tRPC", "PostgreSQL", "Konva.js"],
    image: "/images/projects/lumina-cover.svg",
    gallery: [
      "/images/projects/lumina-1.svg",
      "/images/projects/lumina-2.svg",
    ],
    results: [
      { label: "First-draft time", value: "-82%" },
      { label: "Beta designers", value: "1,200+" },
      { label: "Token exports / wk", value: "4k" },
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/your-username/lumina",
    featured: true,
    accent: "#8B6DFF",
  },
  {
    slug: "aurora-commerce",
    title: "Aurora Commerce",
    category: "Web",
    year: "2024",
    summary:
      "A headless e-commerce storefront with sub-second page loads, edge rendering and a bespoke merchandising CMS.",
    description:
      "Aurora is a conversion-focused storefront built for a premium home-goods brand. It pairs a headless commerce back end with a statically-rendered Next.js front end, animated product storytelling and a custom CMS for merchandising campaigns.",
    problem:
      "The brand's legacy monolith scored 34 on Lighthouse mobile and took 6+ seconds to render product pages on 4G. Marketing needed to launch campaigns without engineering tickets.",
    solution:
      "Product pages render at the edge with ISR and streamed RSC payloads; imagery uses AVIF with blur placeholders. A lightweight merchandising CMS lets marketing drag together hero sections, bundles and A/B tests that deploy through a preview-first publishing flow.",
    role: "Technical lead — frontend architecture, performance budget, CMS data model.",
    tech: ["Next.js", "Shopify", "Tailwind CSS", "Vercel Edge", "Playwright"],
    image: "/images/projects/aurora-commerce-cover.svg",
    gallery: [
      "/images/projects/aurora-commerce-1.svg",
      "/images/projects/aurora-commerce-2.svg",
    ],
    results: [
      { label: "Lighthouse mobile", value: "34 → 96" },
      { label: "Conversion rate", value: "+23%" },
      { label: "LCP on 4G", value: "1.1s" },
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/your-username/aurora",
    featured: true,
    accent: "#22D3EE",
  },
  {
    slug: "pulse-analytics",
    title: "Pulse Analytics",
    category: "App",
    year: "2024",
    summary:
      "A realtime product-analytics dashboard streaming millions of events a day into buttery-smooth visualisations.",
    description:
      "Pulse ingests product events over websockets and renders live funnels, retention curves and cohort views. Built for a fintech scale-up, it stays interactive at millions of rows through virtualisation and worker-side aggregation.",
    problem:
      "The incumbent dashboard froze on large date ranges and took 30+ seconds to pivot. Analysts exported to spreadsheets instead of using the product.",
    solution:
      "Aggregations moved into a worker pool over Apache Arrow columns; charts render on canvas with GPU-accelerated zoom/pan. Queries are cached and diffed so live updates append rather than recompute.",
    role: "Frontend lead — data pipeline, charting engine, realtime infrastructure.",
    tech: ["React", "TypeScript", "WebSockets", "Apache Arrow", "D3.js", "Redis"],
    image: "/images/projects/pulse-analytics-cover.svg",
    gallery: [
      "/images/projects/pulse-analytics-1.svg",
      "/images/projects/pulse-analytics-2.svg",
    ],
    results: [
      { label: "Pivot time", value: "30s → 400ms" },
      { label: "Daily events", value: "12M+" },
      { label: "Weekly active analysts", value: "+64%" },
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/your-username/pulse",
    featured: true,
    accent: "#E8C898",
  },
  {
    slug: "wayfare",
    title: "Wayfare",
    category: "App",
    year: "2023",
    summary:
      "An offline-first travel planner PWA with collaborative itineraries, maps and a drag-and-drop day builder.",
    description:
      "Wayfare lets groups plan trips together in realtime: drag activities into day columns, see costs update live, and everything works offline on a plane. Sync resolves with CRDTs when you're back online.",
    problem:
      "Group trip planning scatters across chats, spreadsheets and screenshots. Existing tools required accounts and constant connectivity.",
    solution:
      "A local-first architecture (IndexedDB + CRDT sync via Yjs) makes edits instant and conflict-free. Shareable rooms join by link with zero signup; maps, currency conversion and packing lists are first-class widgets.",
    role: "Solo builder — product, design, frontend and sync infrastructure.",
    tech: ["Next.js", "PWA", "Yjs", "IndexedDB", "Mapbox GL", "Tailwind CSS"],
    image: "/images/projects/wayfare-cover.svg",
    gallery: [
      "/images/projects/wayfare-1.svg",
      "/images/projects/wayfare-2.svg",
    ],
    results: [
      { label: "Trip rooms created", value: "9,400+" },
      { label: "Offline sync conflicts", value: "0" },
      { label: "Store rating", value: "4.8 / 5" },
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/your-username/wayfare",
    featured: true,
    accent: "#34D399",
  },
  {
    slug: "mono-studio",
    title: "Mono Studio",
    category: "Design",
    year: "2023",
    summary:
      "A brand identity and award-shortlisted portfolio site for a Copenhagen design studio, built around scroll-driven storytelling.",
    description:
      "Mono wanted a site that felt like their work: monochrome, confident, quietly animated. The build is a typographic system with GSAP-pinned case studies, variable-font showcase pieces and an obsessive attention to load performance.",
    problem:
      "The studio's previous site buried its best work behind a generic template, and prospective clients couldn't feel the studio's design philosophy.",
    solution:
      "Every case study is a scroll-choreographed sequence: pinned imagery, kinetic type and hover-reactive artefacts, all within a 90KB JS budget. A custom CMS (MDX-based) lets the team publish new work without a developer.",
    role: "Design engineer — art direction partnership, motion system, build.",
    tech: ["Astro", "GSAP", "Variable fonts", "Sanity", "Netlify"],
    image: "/images/projects/mono-studio-cover.svg",
    gallery: [
      "/images/projects/mono-studio-1.svg",
      "/images/projects/mono-studio-2.svg",
    ],
    results: [
      { label: "Awwwards", value: "Honorable Mention" },
      { label: "Inbound enquiries", value: "+140%" },
      { label: "JS payload", value: "90KB" },
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/your-username/mono",
    featured: false,
    accent: "#F472B6",
  },
  {
    slug: "devmetrics",
    title: "DevMetrics",
    category: "Web",
    year: "2022",
    summary:
      "An open-source toolkit that turns GitHub organisation activity into honest engineering-health dashboards.",
    description:
      "DevMetrics computes DORA-style metrics (deploy frequency, lead time, MTTR) directly from Git history and CI logs, then renders them into shareable dashboards. Used by teams that want engineering insight without surveillance-style tracking.",
    problem:
      "Existing engineering-analytics tools required invasive per-developer tracking that erodes trust and violates privacy norms.",
    solution:
      "All metrics derive from repository events — no individual surveillance. A Go collector runs in CI, a Postgres warehouse stores aggregates only, and the dashboard is a fast static React app with row-level permissions.",
    role: "Creator & maintainer — full-stack, API design, OSS community.",
    tech: ["Go", "React", "PostgreSQL", "GitHub Actions", "Recharts"],
    image: "/images/projects/devmetrics-cover.svg",
    gallery: [
      "/images/projects/devmetrics-1.svg",
      "/images/projects/devmetrics-2.svg",
    ],
    results: [
      { label: "GitHub stars", value: "3.1k" },
      { label: "Contributors", value: "47" },
      { label: "Organisations", value: "220+" },
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/your-username/devmetrics",
    featured: false,
    accent: "#60A5FA",
  },
];

export const projectCategories: Array<"All" | ProjectCategory> = [
  "All",
  "Web",
  "App",
  "AI",
  "Design",
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  prev?: Project;
  next?: Project;
} {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return {};
  return {
    prev: projects[index - 1],
    next: projects[index + 1],
  };
}
