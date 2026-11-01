export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  accent: string;
}

/** TODO: Replace with real testimonials (or keep as realistic placeholders). */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Huzaifa is the rare engineer who sweats design details as hard as he sweats architecture. He rebuilt our storefront and conversion jumped 23% in the first month.",
    name: "Maya Lindqvist",
    role: "Head of Product",
    company: "Aurora Home",
    initials: "ML",
    accent: "#8B6DFF",
  },
  {
    quote:
      "He took a napkin sketch and returned a 3D product configurator that our investors thought was an agency showreel. Shipped two weeks early, under budget.",
    name: "Daniel Okafor",
    role: "Founder & CEO",
    company: "Lumina AI",
    initials: "DO",
    accent: "#22D3EE",
  },
  {
    quote:
      "Our analysts actually enjoy the dashboard now. Pulse went from something people tolerated to the first tab they open every morning.",
    name: "Priya Raman",
    role: "VP of Data",
    company: "Northbeam Finance",
    initials: "PR",
    accent: "#E8C898",
  },
  {
    quote:
      "The site he built us won an Awwwards mention and, more importantly, doubled our inbound. Calm, communicative and relentlessly high-quality work.",
    name: "Sofie Andersen",
    role: "Creative Director",
    company: "Mono Studio",
    initials: "SA",
    accent: "#34D399",
  },
];
