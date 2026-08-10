import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, getAllSeries, getPostsByTag } from "@/lib/posts";
import { siteConfig } from "@/lib/utils";
import { slugify } from "@/lib/utils";
import { PILLARS } from "@/lib/pillars";

const BASE_URL = siteConfig.url;
const LOCALES = ["es", "en"] as const;

/** Minimum posts a tag archive needs before it earns a place in the sitemap. */
const MIN_POSTS_PER_TAG = 2;

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
    // A sitemap is a list of URLs worth indexing, and a tag archive holding a
    // single post is a near-duplicate of that post. Advertising dozens of them
    // spends crawl budget on pages that compete with the articles themselves.
    // The pages stay reachable and indexable — they are simply not submitted.
    const tagRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
        getAllTags(lang)
            .filter((tag) => getPostsByTag(tag, lang).length >= MIN_POSTS_PER_TAG)
            .map((tag) => ({
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

    // ── Pillar (section) pages ────────────────────────────────────
    const pillarRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((lang) => {
        const base = lang === "es" ? "temas" : "topics";
        return [
            {
                url: `${BASE_URL}/${lang}/${base}`,
                lastModified: now,
                changeFrequency: "weekly" as const,
                priority: 0.8,
            },
            ...Object.values(PILLARS).map((pillar) => ({
                url: `${BASE_URL}/${lang}/${base}/${pillar.routeSlug[lang]}`,
                lastModified: now,
                changeFrequency: "weekly" as const,
                priority: 0.75,
            })),
        ];
    });

    return [...staticRoutes, ...postRoutes, ...tagRoutes, ...seriesRoutes, ...pillarRoutes];
}
