import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const locales: Array<"es" | "en"> = ["es", "en"];

  const summary = locales.map((locale) => {
    const posts = getAllPosts(locale).map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      tags: post.tags,
      featured: post.featured ?? false,
      readingTime: post.readingTime ?? 0,
      lang: post.lang ?? locale,
    }));
    return {
      locale,
      count: posts.length,
      posts,
    };
  });

  return NextResponse.json({ summary }, { status: 200 });
}
