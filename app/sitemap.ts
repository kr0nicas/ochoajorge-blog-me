import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, getAllSeries } from "@/lib/posts";
import { siteConfig } from "@/lib/utils";
import { slugify } from "@/lib/utils";

const BASE_URL = siteConfig.url;
const LOCALES = ["es", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    // ── Static pages ─────────────────────────────────────────────
    const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((lang) => [
        {
            url: `${BASE_URL}/${lang}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/${lang}/blog`,
            lastModified: now,
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/${lang}/about`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/${lang}/projects`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        },
    ]);

    // ── Blog posts ────────────────────────────────────────────────
    const postRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
        getAllPosts(lang).map((post) => ({
            url: `${BASE_URL}/${lang}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: "monthly" as const,
            priority: post.featured ? 0.9 : 0.8,
        }))
    );

    // ── Tag pages ─────────────────────────────────────────────────
    const tagRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
        getAllTags(lang).map((tag) => ({
            url: `${BASE_URL}/${lang}/tags/${encodeURIComponent(tag.toLowerCase())}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }))
    );

    // ── Series pages ──────────────────────────────────────────────
    const seriesRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
        getAllSeries(lang).map((series) => ({
            url: `${BASE_URL}/${lang}/series/${slugify(series)}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.65,
        }))
    );

    return [...staticRoutes, ...postRoutes, ...tagRoutes, ...seriesRoutes];
}
