import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import { getAllPosts, getAdjacentPosts, getPostBySlug } from "@/lib/blog";
import { siteConfig, siteUrl } from "@/data/site";
import { mdxComponents } from "@/components/mdx";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { formatDate } from "@/lib/utils";

interface BlogPostProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [siteConfig.name],
      tags: post.tags,
      url: siteUrl(`blog/${post.slug}`),
      images: [{ url: `/og/blog/${post.slug}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`/og/blog/${post.slug}.png`],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(post.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Person", name: siteConfig.name },
    url: siteUrl(`blog/${post.slug}`),
    keywords: post.tags.join(", "),
  };

  return (
    <article className="container max-w-3xl pb-28 pt-36 sm:pt-44">
      <Link
        href="/blog"
        className="group mb-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
          aria-hidden
        />
        All posts
      </Link>

      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden className="h-1 w-1 rounded-full bg-border/30" />
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {post.readingMinutes} min read
          </span>
        </div>
        <h1 className="mt-5 font-display text-display-sm font-bold leading-[1.12] tracking-tight">
          {post.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{post.description}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-full border border-border/10 px-3 py-1 text-xs text-muted"
              >
                <Tag className="h-3 w-3" aria-hidden />
                {tag}
              </span>
            ))}
          </div>
          <ShareButtons title={post.title} url={siteUrl(`blog/${post.slug}`)} />
        </div>
      </header>

      <div className="prose prose-neutral max-w-none md:prose-lg dark:prose-invert">
        <MDXRemote
          source={post.source}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [rehypeSlug, rehypeHighlight],
            },
          }}
        />
      </div>

      {/* Prev / next */}
      <nav
        aria-label="Post navigation"
        className="mt-16 grid gap-4 border-t border-border/10 pt-10 sm:grid-cols-2"
      >
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="group rounded-3xl border border-border/10 bg-card/[0.04] p-6 transition-all duration-300 hover:border-accent/40"
          >
            <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Older
            </p>
            <p className="font-display font-semibold leading-snug group-hover:text-accent">
              {prev.title}
            </p>
          </Link>
        ) : (
          <span aria-hidden />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="group rounded-3xl border border-border/10 bg-card/[0.04] p-6 text-right transition-all duration-300 hover:border-accent/40"
          >
            <p className="mb-2 flex items-center justify-end gap-2 text-xs uppercase tracking-widest text-muted">
              Newer <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </p>
            <p className="font-display font-semibold leading-snug group-hover:text-accent">
              {next.title}
            </p>
          </Link>
        ) : null}
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
