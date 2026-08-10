import { Redis } from "@upstash/redis";

let cached: Redis | null | undefined;

/**
 * Upstash Redis client, or null when the env vars are missing.
 * Callers must treat null as "reactions disabled" and degrade gracefully.
 */
export function getRedis(): Redis | null {
	if (cached !== undefined) return cached;
	const url = process.env.UPSTASH_REDIS_REST_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN;
	cached = url && token ? new Redis({ url, token }) : null;
	return cached;
}

export function reactionKey(lang: string, slug: string): string {
	return `reactions:${lang}:${slug}`;
}
