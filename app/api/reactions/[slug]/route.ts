import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import type { Redis } from "@upstash/redis";
import { getRedis, reactionKey } from "@/lib/redis";
import { getPostSlugs } from "@/lib/posts";

const SUPPORTED_LANGS = new Set(["es", "en"]);

let ratelimit: Ratelimit | null = null;

function getRatelimit(redis: Redis): Ratelimit {
	ratelimit ??= new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(10, "60 s"),
		prefix: "ratelimit:reactions",
	});
	return ratelimit;
}

type Validation =
	| { ok: true; lang: string }
	| { ok: false; response: NextResponse };

function validate(request: NextRequest, slug: string): Validation {
	const lang = request.nextUrl.searchParams.get("lang") ?? "es";
	if (!SUPPORTED_LANGS.has(lang)) {
		return {
			ok: false,
			response: NextResponse.json({ error: "invalid_lang" }, { status: 400 }),
		};
	}
	if (!getPostSlugs(lang).includes(slug)) {
		return {
			ok: false,
			response: NextResponse.json({ error: "unknown_post" }, { status: 404 }),
		};
	}
	return { ok: true, lang };
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params;
	const validation = validate(request, slug);
	if (!validation.ok) return validation.response;

	const redis = getRedis();
	if (!redis) {
		return NextResponse.json({ error: "reactions_disabled" }, { status: 503 });
	}

	try {
		const count = await redis.get<number>(reactionKey(validation.lang, slug));
		return NextResponse.json({ count: Number(count ?? 0) });
	} catch {
		return NextResponse.json({ error: "reactions_unavailable" }, { status: 503 });
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params;
	const validation = validate(request, slug);
	if (!validation.ok) return validation.response;

	const redis = getRedis();
	if (!redis) {
		return NextResponse.json({ error: "reactions_disabled" }, { status: 503 });
	}

	const ip =
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

	try {
		const { success } = await getRatelimit(redis).limit(ip);
		if (!success) {
			return NextResponse.json({ error: "rate_limited" }, { status: 429 });
		}
		const count = await redis.incr(reactionKey(validation.lang, slug));
		return NextResponse.json({ count });
	} catch {
		return NextResponse.json({ error: "reactions_unavailable" }, { status: 503 });
	}
}
