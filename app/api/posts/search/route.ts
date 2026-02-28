import { getAllPosts } from "@/lib/posts";
import { NextResponse } from "next/server";

/**
 * Route Handler that returns a minimized list of all posts
 * to be used as a client-side search index for Fuse.js
 */
export async function GET() {
    const posts = getAllPosts();

    // We only need the data required for searching and displaying results
    const index = posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        description: post.description,
        tags: post.tags,
        series: post.series?.name,
        date: post.date,
    }));

    return NextResponse.json(index, {
        headers: {
            "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        },
    });
}
