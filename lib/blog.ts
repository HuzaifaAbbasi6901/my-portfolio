import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingMinutes: number;
}

export interface Post extends PostMeta {
  source: string;
}

function isMdx(file: string) {
  return file.endsWith(".mdx");
}

function slugFromFile(file: string) {
  return file.replace(/\.mdx$/, "");
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter(isMdx)
    .map(slugFromFile)
    .sort();
}

export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(
        path.join(postsDirectory, `${slug}.mdx`),
        "utf8"
      );
      const { data, content } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        date: String(data.date ?? new Date().toISOString()),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
      } satisfies PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  // Guard against path traversal — slugs are always [a-z0-9-].
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? new Date().toISOString()),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    source: content,
  };
}

export function getAdjacentPosts(slug: string): {
  prev?: PostMeta;
  next?: PostMeta;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return {};
  return { prev: posts[index + 1], next: posts[index - 1] };
}
