import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { Experience } from "@/components/sections/Experience";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { GitHubStats } from "@/components/sections/GitHubStats";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { Contact } from "@/components/sections/Contact";
import { getAllPosts } from "@/lib/blog";
import { getGitHubStats, fallbackStats } from "@/lib/github";
import { siteConfig } from "@/data/site";

// Revalidate GitHub stats hourly (ISR).
export const revalidate = 3600;

export default async function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  const stats = await getGitHubStats(siteConfig.githubUsername).catch(
    () => fallbackStats
  );

  return (
    <>
      <Hero />
      <FeaturedWork />
      <About />
      <Skills />
      <MarqueeBand />
      <ProjectsSection />
      <Experience />
      <Services />
      <Testimonials />
      <GitHubStats stats={stats} />
      <BlogPreview posts={posts} />
      <Contact />
    </>
  );
}
