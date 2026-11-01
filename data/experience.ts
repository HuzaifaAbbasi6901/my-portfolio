export interface TimelineItem {
  id: string;
  kind: "work" | "education" | "certification";
  title: string;
  org: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
  current?: boolean;
}

/**
 * TODO: Replace with your real experience, education and certifications.
 */
export const timeline: TimelineItem[] = [
  {
    id: "nova-labs",
    kind: "work",
    title: "Senior Full-Stack Engineer",
    org: "Nova Labs",
    period: "2023 — Present",
    location: "Remote",
    summary:
      "Leading the web platform team for a developer-tools startup used by 200k+ engineers.",
    highlights: [
      "Architected the migration from CRA to Next.js App Router — 68% faster TTI",
      "Built a realtime collaboration layer (CRDTs + websockets) adopted across three products",
      "Mentoring four engineers; introduced a typed design-system package used org-wide",
    ],
    current: true,
  },
  {
    id: "brightline",
    kind: "work",
    title: "Full-Stack Developer",
    org: "Brightline Studio",
    period: "2021 — 2023",
    location: "Berlin, DE",
    summary:
      "Shipped marketing sites, e-commerce and product work for clients in fashion, mobility and fintech.",
    highlights: [
      "Delivered 20+ client projects; two won Awwwards honorable mentions",
      "Cut average client-site LCP from 3.8s to 1.4s with an edge-rendering playbook",
      "Owned the studio's internal component library and project starter kit",
    ],
  },
  {
    id: "pixelforge",
    kind: "work",
    title: "Frontend Developer",
    org: "Pixelforge",
    period: "2019 — 2021",
    location: "Karachi, PK",
    summary:
      "First engineering hire at a product agency; turned Figma files into production interfaces.",
    highlights: [
      "Built the company's first React codebase and testing culture",
      "Shipped a patient-portal PWA serving 40k monthly users",
    ],
  },
  {
    id: "bsc",
    kind: "education",
    title: "BSc Computer Science",
    org: "University of Karachi",
    period: "2015 — 2019",
    location: "Karachi, PK",
    summary:
      "Graduated with distinction. Thesis on WebGL-based data visualisation for low-power devices.",
    highlights: [
      "Founded the university's first web-development society (300+ members)",
      "Two-time national hackathon finalist",
    ],
  },
];

export const certifications: string[] = [
  // TODO: Replace with your real certifications & awards
  "AWS Certified Solutions Architect — Associate",
  "Google Cloud Professional Cloud Developer",
  "Meta Front-End Developer Professional Certificate",
  "Awwwards — Honorable Mention (2023, 2024)",
  "CSS Design Awards — Site of the Day",
  "Certified Kubernetes Application Developer",
];
