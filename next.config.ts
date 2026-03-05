import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// For Turbopack compatibility, keep MDX options minimal (only serializable plugins).
// rehype-slug, rehype-autolink-headings, and rehype-pretty-code are applied
// server-side in lib/mdx.ts using next-mdx-remote for full post rendering.
const withMDX = createMDX({
  options: {
    // remark-gfm is a pure function — compatible with Turbopack
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  // Support MDX files as pages
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "6pxof7rpjdk6gkca.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default withMDX(nextConfig);
