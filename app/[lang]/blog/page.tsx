import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Tag } from "@/components/shared/Tag";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Articles on software architecture, Python, Next.js, AI systems, and building production-grade software.",
};

export default async function BlogPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const isSpanish = lang === "es";
    const posts = getAllPosts(lang);
    const tags = getAllTags(lang);

    const tagCounts: Record<string, number> = {};
    for (const tag of tags) {
        tagCounts[tag] = posts.filter((p) =>
            p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
        ).length;
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12">
                <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
                    Blog
                </h1>
                <p className="mt-3 text-lg text-[var(--text-secondary)]">
                    {isSpanish
                        ? "Ideas sobre arquitectura, Python, IA y construcción de software que dure."
                        : "Thoughts on architecture, Python, AI, and building software that lasts."}
                    {posts.length > 0 && (
                        <span className="ml-2 text-sm text-[var(--text-muted)]">
                            ({posts.length} {isSpanish ? (posts.length !== 1 ? "artículos" : "artículo") : (posts.length !== 1 ? "articles" : "article")})
                        </span>
                    )}
                </p>
            </div>

            {tags.length > 0 && (
                <div className="mb-10 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Tag key={tag} name={tag} count={tagCounts[tag]} lang={lang} />
                    ))}
                </div>
            )}

            {posts.length === 0 ? (
                <div className="card-glass flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-3xl">✍️</p>
                    <p className="mt-4 text-[var(--text-secondary)]">
                        {isSpanish ? "El primer post llegará pronto..." : "First post coming soon..."}
                    </p>
                </div>
            ) : (
                <ul className="grid gap-5 sm:grid-cols-2" role="list">
                    {posts.map((post, idx) => (
                        <li key={post.slug} className={idx === 0 ? "sm:col-span-2" : ""}>
                            <PostCard post={post} featured={idx === 0} lang={lang} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
