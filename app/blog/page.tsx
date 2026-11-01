import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { getAllPosts } from "@/lib/blog";
import { siteConfig, siteUrl } from "@/data/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Essays and field notes on frontend engineering, 3D on the web and design systems — by ${siteConfig.name}.`,
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container pb-28 pt-36 sm:pt-44">
      <header className="mb-14 max-w-2xl">
        <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          <span aria-hidden className="h-px w-8 bg-gold/60" />
          Blog
        </p>
        <h1 className="font-display text-display font-bold leading-[1.08] tracking-tight">
          Notes from
          <span className="text-gradient"> the craft.</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
          Long-form thinking on frontend engineering, motion, 3D on the web and
          the systems that hold products together.
        </p>
      </header>

      <BlogIndex posts={posts} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${siteConfig.name} — Blog`,
            url: siteUrl("blog"),
          }),
        }}
      />
    </div>
  );
}
