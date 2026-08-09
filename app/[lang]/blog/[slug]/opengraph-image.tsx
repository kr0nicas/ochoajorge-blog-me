import { getPostBySlug } from "@/lib/posts";
import { renderOgImage, OG_SIZE } from "@/lib/og-template";

// No edge runtime — getPostBySlug and font loading use fs (Node.js)
export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = "image/png";

interface Props {
    params: Promise<{ slug: string; lang: string }>;
}

/** Dynamic OG image for individual blog posts — Grotesk Suizo template. */
export default async function Image({ params }: Props) {
    const { slug, lang } = await params;
    const post = getPostBySlug(slug, lang);

    return renderOgImage({
        title: post?.title ?? "Blog Post",
        pillar: post?.tags?.[0] ?? "blog",
        readingTime: post?.readingTime,
    });
}
