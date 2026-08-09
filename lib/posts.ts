import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostWithContent } from "./types";
import { isPillarId, type PillarId } from "./pillars";

const BASE_POSTS_DIR = path.join(process.cwd(), "content/posts");

/**
 * Get all post slugs for a specific locale.
 */
export function getPostSlugs(locale: string = "es"): string[] {
    const localeDir = path.join(BASE_POSTS_DIR, locale);
    if (!fs.existsSync(localeDir)) return [];

    return fs
        .readdirSync(localeDir)
        .filter((file) => {
            // Only accept .mdx and .md files
            const isMarkdownFile = file.endsWith(".mdx") || file.endsWith(".md");
            if (!isMarkdownFile) return false;

            // Exclude social media templates (LinkedIn, X threads)
            const slug = file.replace(/\.(mdx|md)$/, "");
            const isSocialTemplate = slug.startsWith("linkedin-") || slug.startsWith("x-thread-");

            return !isSocialTemplate;
        })
        .map((file) => file.replace(/\.(mdx|md)$/, ""));
}

/**
 * Parse a single post by slug and locale.
 */
export function getPostBySlug(slug: string, locale: string = "es"): PostWithContent | null {
    const mdxPath = path.join(BASE_POSTS_DIR, locale, `${slug}.mdx`);
    const mdPath = path.join(BASE_POSTS_DIR, locale, `${slug}.md`);
    const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    if (data.draft && process.env.NODE_ENV === "production") return null;

    const stats = readingTime(content);

    return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? new Date().toISOString().split("T")[0],
        tags: Array.isArray(data.tags) ? data.tags : [],
        draft: data.draft ?? false,
        pillar: isPillarId(data.pillar) ? data.pillar : undefined,
        coverImage: data.coverImage,
        readingTime: Math.ceil(stats.minutes),
        content,
        lang: locale as "es" | "en",
        featured: data.featured ?? false,
        series: data.series ? {
            name: data.series.name,
            part: data.series.part
        } : undefined,
        resources: Array.isArray(data.resources)
            ? data.resources
                  .map((item) => ({
                      label: String(item.label ?? ""),
                      url: String(item.url ?? ""),
                  }))
                  .filter((item) => item.label && item.url)
            : undefined,
        canonical: data.canonical,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage ?? data.coverImage,
    };
}

/**
 * Get all posts for a locale, sorted by date with featured boost.
 * Featured posts get a 30-day boost in sorting, but very recent non-featured posts can outrank old featured posts.
 */
export function getAllPosts(locale: string = "es"): Post[] {
    const FEATURED_BOOST_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    return getPostSlugs(locale)
        .map((slug) => getPostBySlug(slug, locale))
        .filter((post): post is PostWithContent => post !== null)
        .sort((a, b) => {
            const aTimestamp = new Date(a.date).getTime() + (a.featured ? FEATURED_BOOST_MS : 0);
            const bTimestamp = new Date(b.date).getTime() + (b.featured ? FEATURED_BOOST_MS : 0);
            return bTimestamp - aTimestamp;
        });
}

/**
 * Get posts filtered by tag and locale.
 */
export function getPostsByTag(tag: string, locale: string = "es"): Post[] {
    return getAllPosts(locale).filter((post) =>
        (post.tags ?? []).map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    );
}

/**
 * Get all unique tags for a locale.
 */
export function getAllTags(locale: string = "es"): string[] {
    const allTags = getAllPosts(locale).flatMap((post) => post.tags);
    return [...new Set(allTags)].sort();
}

/**
 * Get featured posts for a locale.
 */
export function getFeaturedPosts(count = 3, locale: string = "es"): Post[] {
    return getAllPosts(locale)
        .filter((post) => !post.draft)
        .slice(0, count);
}

/**
 * Get series posts for a locale.
 */
export function getPostsBySeries(seriesName: string, locale: string = "es"): Post[] {
    return getAllPosts(locale)
        .filter((post) => post.series?.name === seriesName)
        .sort((a, b) => (a.series?.part ?? 0) - (b.series?.part ?? 0));
}

/**
 * Get all unique series names for a locale.
 */
export function getAllSeries(locale: string = "es"): string[] {
    const allSeries = getAllPosts(locale)
        .map((post) => post.series?.name)
        .filter((name): name is string => !!name);
    return [...new Set(allSeries)].sort();
}

/**
 * Get posts belonging to a canonical pillar (section) for a locale.
 */
export function getPostsByPillar(pillarId: PillarId, locale: string = "es"): Post[] {
    return getAllPosts(locale).filter((post) => post.pillar === pillarId);
}
