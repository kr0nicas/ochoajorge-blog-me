import type { NextRequest } from "next/server";
import { siteConfig } from "@/lib/utils";
import { getPostBySlug } from "@/lib/posts";
import { generateCitation } from "@/lib/citation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string; slug: string }> }
) {
  const { lang, slug } = await params;
  const post = getPostBySlug(slug, lang);

  if (!post) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = `${siteConfig.url}/${lang}/blog/${post.slug}`;
  const citations = generateCitation({
    title: post.title,
    author: siteConfig.author.name,
    url,
    datePublished: post.date,
    lang: lang as "es" | "en",
  });

  // Check Accept header to determine format
  const acceptHeader = request.headers.get("accept") || "";
  const wantsJson = acceptHeader.includes("application/json");

  if (wantsJson) {
    return new Response(JSON.stringify(citations, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Default: return plain text with all formats
  const responseText = `
${post.title}
${"=".repeat(post.title.length)}

Author: ${siteConfig.author.name}
URL: ${url}
Published: ${post.date}

--- Citation Formats ---

BibTeX:
${citations.bibtex}

APA (7th Edition):
${citations.apa}

MLA (9th Edition):
${citations.mla}

--- JSON for AI Agents ---

${citations.json}
`;

  return new Response(responseText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function generateStaticParams() {
  return [
    { lang: "es", slug: "example" }, // This will be overridden by actual posts at build time
  ];
}