import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostWithContent } from "./types";

const BASE_POSTS_DIR = path.join(process.cwd(), "content/posts");

/**
 * Get all post slugs for a specific locale.
 */
export function getPostSlugs(locale: string = "es"): string[] {
    const localeDir = path.join(BASE_POSTS_DIR, locale);
    if (!fs.existsSync(localeDir)) return [];

    return fs
        .readdirSync(localeDir)
        .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
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
        tags: data.tags ?? [],
        draft: data.draft ?? false,
        coverImage: data.coverImage,
        readingTime: Math.ceil(stats.minutes),
        content,
        lang: locale as "es" | "en",
        series: data.series ? {
            name: data.series.name,
            part: data.series.part
        } : undefined
    };
}

/**
 * Get all posts for a locale, sorted by date.
 */
export function getAllPosts(locale: string = "es"): Post[] {
    return getPostSlugs(locale)
        .map((slug) => getPostBySlug(slug, locale))
        .filter((post): post is PostWithContent => post !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get posts filtered by tag and locale.
 */
export function getPostsByTag(tag: string, locale: string = "es"): Post[] {
    return getAllPosts(locale).filter((post) =>
        post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
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
