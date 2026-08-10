import { unstable_cache } from "next/cache";
import { getRedis, reactionKey } from "@/lib/redis";

/**
 * Batch-read reaction counts for a list of posts in a single MGET,
 * cached server-side with 60s revalidation. Listing pages call this once
 * and pass counts down to cards as props (never per-card, never client-side).
 * Returns {} when Redis is not configured or unavailable.
 */
export const getReactionCounts = unstable_cache(
    async (lang: string, slugs: string[]): Promise<Record<string, number>> => {
        const redis = getRedis();
        if (!redis || slugs.length === 0) return {};
        try {
            const values = await redis.mget<(number | null)[]>(
                ...slugs.map((slug) => reactionKey(lang, slug))
            );
            return Object.fromEntries(
                slugs.map((slug, i) => [slug, Number(values[i] ?? 0)])
            );
        } catch {
            return {};
        }
    },
    ["reaction-counts"],
    { revalidate: 60 }
);
