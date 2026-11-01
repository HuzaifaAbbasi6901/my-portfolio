export interface Skill {
  name: string;
  level: number; // 1–100
  icon?: string; // simple-icons slug, resolved in the marquee
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

/** TODO: Adjust to your real skill levels. */
export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "TypeScript", level: 92, icon: "typescript" },
      { name: "React & Next.js", level: 95, icon: "nextdotjs" },
      { name: "Tailwind CSS", level: 90, icon: "tailwindcss" },
      { name: "Three.js / WebGL", level: 78, icon: "threedotjs" },
      { name: "Framer Motion & GSAP", level: 88, icon: "framer" },
      { name: "Accessibility (WCAG)", level: 85, icon: "sass" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", level: 88, icon: "nodedotjs" },
      { name: "API design (REST/GraphQL)", level: 90, icon: "graphql" },
      { name: "PostgreSQL", level: 84, icon: "postgresql" },
      { name: "Redis", level: 75, icon: "redis" },
      { name: "Python", level: 70, icon: "python" },
      { name: "Prisma", level: 82, icon: "prisma" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Platform",
    skills: [
      { name: "Git & GitHub", level: 92, icon: "git" },
      { name: "Docker", level: 76, icon: "docker" },
      { name: "Vercel & CI/CD", level: 88, icon: "vercel" },
      { name: "Vitest / Testing", level: 80, icon: "vitest" },
      { name: "Vite", level: 84, icon: "vite" },
      { name: "Figma", level: 85, icon: "figma" },
    ],
  },
  {
    id: "soft",
    label: "Craft & Soft Skills",
    skills: [
      { name: "Design Systems", level: 88 },
      { name: "Motion Design", level: 82 },
      { name: "Communication", level: 90 },
      { name: "Mentoring", level: 84 },
      { name: "Project Ownership", level: 92 },
    ],
  },
];

/** Top skills rendered as animated rings. */
export const featuredSkills: Skill[] = [
  { name: "React / Next.js", level: 95 },
  { name: "TypeScript", level: 92 },
  { name: "UI Engineering", level: 90 },
  { name: "Node.js", level: 88 },
];

/** Icons used by the infinite marquee (simple-icons slugs). */
export const marqueeSkills: string[] = [
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "tailwindcss",
  "threedotjs",
  "framer",
  "nodedotjs",
  "postgresql",
  "graphql",
  "redis",
  "python",
  "docker",
  "git",
  "github",
  "vercel",
  "figma",
  "prisma",
  "vite",
  "vitest",
  "sass",
  "webpack",
  "storybook",
  "openai",
];
