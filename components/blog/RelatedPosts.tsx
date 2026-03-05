import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import type { Post } from "@/lib/types";
import { getAllPosts, getPostsBySeries } from "@/lib/posts";
import { formatDate, slugify } from "@/lib/utils";
import { Tag } from "@/components/shared/Tag";

interface RelatedPostsProps {
    currentPost: Post;
    lang: string;
}

/**
 * Smart related posts logic:
 * 1. Same series → show prev/next in series
 * 2. Shared tags → up to 3 posts by tag overlap score
 * Excludes the current post in all cases.
 */
function getRelatedPosts(currentPost: Post, lang: string): Post[] {
    const allPosts = getAllPosts(lang).filter((p) => p.slug !== currentPost.slug);

    // Priority 1: same series
    if (currentPost.series) {
        const seriesPosts = getPostsBySeries(currentPost.series.name, lang).filter(
            (p) => p.slug !== currentPost.slug
        );
        if (seriesPosts.length > 0) return seriesPosts.slice(0, 3);
    }

    // Priority 2: shared tags — scored by overlap
    const scored = allPosts
        .map((post) => {
            const overlap = post.tags.filter((t) =>
                currentPost.tags.map((ct) => ct.toLowerCase()).includes(t.toLowerCase())
            ).length;
            return { post, overlap };
        })
        .filter(({ overlap }) => overlap > 0)
        .sort((a, b) => b.overlap - a.overlap);

    return scored.slice(0, 3).map(({ post }) => post);
}

export function RelatedPosts({ currentPost, lang }: RelatedPostsProps) {
    const related = getRelatedPosts(currentPost, lang);
    const isSpanish = lang === "es";

    if (related.length === 0) return null;

    const isSameSeries = currentPost.series &&
        related.every((p) => p.series?.name === currentPost.series?.name);

    return (
        <section className="mt-16 border-t border-[var(--border)] pt-12">
            <div className="mb-6">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--brand-light)]">
                    {isSameSeries
                        ? (isSpanish ? "Más en esta serie" : "More in this series")
                        : (isSpanish ? "También te puede interesar" : "You might also like")}
                </p>
                <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                    {isSameSeries
                        ? (isSpanish ? `Serie: ${currentPost.series?.name}` : `Series: ${currentPost.series?.name}`)
                        : (isSpanish ? "Artículos relacionados" : "Related articles")}
                </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/${lang}/blog/${post.slug}`}
                        className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:border-[var(--border-brand)] hover:shadow-[var(--shadow-brand-sm)] hover:-translate-y-0.5 no-underline"
                    >
                        {/* Series badge */}
                        {post.series && (
                            <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-light)]">
                                <Layers className="h-3 w-3" />
                                {isSpanish ? `Parte ${post.series.part}` : `Part ${post.series.part}`}
                            </div>
                        )}

                        {/* Tags */}
                        {post.tags.slice(0, 2).length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-1.5">
                                {post.tags.slice(0, 2).map((tag) => (
                                    <Tag key={tag} name={tag} linkable={false} lang={lang} />
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h3 className="font-display text-sm font-semibold leading-snug text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--brand-light)]">
                            {post.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                            {post.description}
                        </p>

                        {/* Footer */}
                        <div className="mt-4 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                            <span>{formatDate(post.date, lang)}</span>
                            <span className="flex items-center gap-1 text-[var(--brand-light)] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                                {isSpanish ? "Leer" : "Read"}
                                <ArrowRight className="h-3 w-3" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
