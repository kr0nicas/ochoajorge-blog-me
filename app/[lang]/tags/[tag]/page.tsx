import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByTag, getAllTags, getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Tag } from "@/components/shared/Tag";

interface TagPageProps {
    params: Promise<{ tag: string; lang: string }>;
}

/** Pre-generate a page for every tag that exists in the content directory. */
export async function generateStaticParams({ params }: { params: { lang: string } }) {
    const { lang } = params;
    return getAllTags(lang).map((tag) => ({
        tag: encodeURIComponent(tag.toLowerCase()),
    }));
}

export async function generateMetadata({
    params,
}: TagPageProps): Promise<Metadata> {
    const { tag, lang } = await params;
    const decoded = decodeURIComponent(tag);
    const isSpanish = lang === "es";

    return {
        title: isSpanish ? `Posts con la etiqueta "${decoded}"` : `Posts tagged "${decoded}"`,
        description: isSpanish
            ? `Explora todos los artículos sobre ${decoded} — arquitectura de software, Python, Next.js, IA y más.`
            : `Browse all articles about ${decoded} — software architecture, Python, Next.js, AI and more.`,
    };
}

export default async function TagPage({ params }: TagPageProps) {
    const { tag, lang } = await params;
    const decoded = decodeURIComponent(tag);
    const posts = getPostsByTag(decoded, lang);
    const allTags = getAllTags(lang);
    const allPosts = getAllPosts(lang);
    const isSpanish = lang === "es";

    if (posts.length === 0) notFound();

    // Build a map of tag → post count for the sidebar
    const tagCounts: Record<string, number> = {};
    for (const t of allTags) {
        tagCounts[t] = allPosts.filter((p) =>
            (p.tags ?? []).map((x) => x.toLowerCase()).includes(t.toLowerCase())
        ).length;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
                {/* ── Main: filtered posts ───────────────────────── */}
                <main>
                    {/* Header */}
                    <div className="mb-10">
                        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--text-muted)]">
                            {isSpanish ? "Etiqueta" : "Tag"}
                        </p>
                        <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
                            {decoded}
                        </h1>
                        <p className="mt-2 text-[var(--text-secondary)]">
                            {posts.length} {isSpanish ? (posts.length !== 1 ? "artículos" : "artículo") : (posts.length !== 1 ? "articles" : "article")}
                        </p>
                    </div>

                    {/* Posts */}
                    <ul className="grid gap-5 sm:grid-cols-2" role="list">
                        {posts.map((post) => (
                            <li key={post.slug}>
                                <PostCard post={post} lang={lang} />
                            </li>
                        ))}
                    </ul>
                </main>

                {/* ── Sidebar: all tags ──────────────────────────── */}
                <aside className="mt-12 lg:mt-0">
                    <div className="card-glass p-5">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                            {isSpanish ? "Todos los temas" : "All topics"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map((t) => (
                                <Tag
                                    key={t}
                                    name={t}
                                    count={tagCounts[t]}
                                    lang={lang}
                                    className={
                                        t.toLowerCase() === decoded.toLowerCase()
                                            ? "border-[var(--brand)] bg-[var(--brand)] bg-opacity-20"
                                            : ""
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
