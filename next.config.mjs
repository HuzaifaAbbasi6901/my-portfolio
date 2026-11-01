/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    // Our own hand-crafted SVG artwork lives in /public — allow it through next/image.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'self';",
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    outputFileTracingIncludes: {
      "/blog": ["./content/blog/**/*.mdx"],
      "/blog/[slug]": ["./content/blog/**/*.mdx"],
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
