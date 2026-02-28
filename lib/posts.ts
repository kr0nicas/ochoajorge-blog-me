import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostWithContent } from "./types";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

/**
 * Get all post slugs from the filesystem.
 * Used by generateStaticParams.
 */
export function getPostSlugs(): string[] {
    if (!fs.existsSync(POSTS_DIR)) return [];
    return fs
        .readdirSync(POSTS_DIR)
        .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
        .map((file) => file.replace(/\.(mdx|md)$/, ""));
}

/**
 * Parse a single post by slug.
 * Returns null if the post doesn't exist or is a draft in production.
 */
export function getPostBySlug(slug: string): PostWithContent | null {
    const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
    const mdPath = path.join(POSTS_DIR, `${slug}.md`);
    const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    // Skip drafts in production
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
    };
}

/**
 * Get all posts, sorted by date (newest first).
 * Excludes drafts in production.
 */
export function getAllPosts(): Post[] {
    return getPostSlugs()
        .map((slug) => getPostBySlug(slug))
        .filter((post): post is PostWithContent => post !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get posts filtered by a specific tag.
 */
export function getPostsByTag(tag: string): Post[] {
    return getAllPosts().filter((post) =>
        post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    );
}

/**
 * Get all unique tags across all posts, sorted alphabetically.
 */
export function getAllTags(): string[] {
    const allTags = getAllPosts().flatMap((post) => post.tags);
    return [...new Set(allTags)].sort();
}

/**
 * Get featured posts (first 3 published posts).
 */
export function getFeaturedPosts(count = 3): Post[] {
    return getAllPosts()
        .filter((post) => !post.draft)
        .slice(0, count);
}

/**
 * Format a date string for display.
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
