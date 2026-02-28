import { getAllPosts } from "@/lib/posts";
import { NextResponse, NextRequest } from "next/server";

/**
 * Route Handler that returns a minimized list of all posts
 * for a specific language to be used as a client-side search index.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "es";

    const posts = getAllPosts(lang);

    const index = posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        description: post.description,
        tags: post.tags,
        series: post.series?.name,
        date: post.date,
        lang: post.lang,
    }));

    return NextResponse.json(index, {
        headers: {
            "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        },
    });
}
