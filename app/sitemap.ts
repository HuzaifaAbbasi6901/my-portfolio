import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { projects } from "@/data/projects";
import { siteUrl } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl(), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: siteUrl("blog"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: siteUrl(`blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: siteUrl(`projects/${project.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...projectEntries, ...postEntries];
}
