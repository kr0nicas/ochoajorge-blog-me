import { getPostBySlug } from "@/lib/posts";
import { PILLARS } from "@/lib/pillars";
import { renderOgImage, OG_SIZE } from "@/lib/og-template";

// No edge runtime — getPostBySlug and font loading use fs (Node.js)
export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = "image/png";

interface Props {
    params: Promise<{ slug: string; lang: string }>;
}

/** Dynamic OG image for blog posts — kicker and glow hue come from the post's pillar. */
export default async function Image({ params }: Props) {
    const { slug, lang } = await params;
    const post = getPostBySlug(slug, lang);
    const pillarDef = post?.pillar ? PILLARS[post.pillar] : null;

    return renderOgImage({
        title: post?.title ?? "Blog Post",
        pillar: pillarDef?.id ?? post?.tags?.[0] ?? "blog",
        hue: pillarDef?.hue,
        readingTime: post?.readingTime,
    });
}
