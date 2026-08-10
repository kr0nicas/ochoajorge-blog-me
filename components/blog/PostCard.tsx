import Image from "next/image";
import Link from "next/link";
import { Layers, Star } from "lucide-react";
import type { Post } from "@/lib/types";
import { cn, formatDate, slugify } from "@/lib/utils";

interface PostCardProps {
    post: Post;
    featured?: boolean;
    className?: string;
    lang?: string;
    /** Above-the-fold cards: load the OG thumbnail eagerly */
    priority?: boolean;
    /** Reaction count, read server-side in batch by the listing page */
    reactions?: number;
}

export function PostCard({
    post,
    featured = false,
    className,
    lang = "es",
    priority = false,
    reactions,
}: PostCardProps) {
    const isSpanish = lang === "es";

    return (
        <article
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] transition-all duration-300 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]",
                className
            )}
        >
            {/* OG thumbnail — same artwork used for social sharing */}
            <Link
                href={`/${lang}/blog/${post.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="no-underline"
            >
                <Image
                    src={`/${lang}/blog/${post.slug}/opengraph-image`}
                    alt=""
                    width={1200}
                    height={630}
                    priority={priority}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                    className="aspect-[1200/630] w-full border-b border-[var(--border)] object-cover"
                />
            </Link>

            <div className={cn("flex flex-1 flex-col p-5", featured && "lg:p-6")}>
                {/* Series indicator */}
                {post.series && (
                    <Link
                        href={`/${lang}/series/${slugify(post.series.name)}`}
                        className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--brand-light)] no-underline transition-opacity hover:opacity-80"
                    >
                        <Layers className="h-3 w-3" />
                        {post.series.name} ·{" "}
                        {isSpanish ? `Parte ${post.series.part}` : `Part ${post.series.part}`}
                    </Link>
                )}

                {/* Title — display type, the clickable part */}
                <Link
                    href={`/${lang}/blog/${post.slug}`}
                    className="no-underline"
                    aria-label={`Read: ${post.title}`}
                >
                    <h2
                        className={cn(
                            "font-display font-bold leading-snug tracking-tight text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--brand-light)]",
                            featured ? "text-2xl lg:text-3xl" : "text-lg"
                        )}
                    >
                        {post.title}
                    </h2>
                </Link>

                {/* Description */}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                    {post.description}
                </p>

                {/* Meta — mono, hairline top */}
                <div className="mt-4 flex items-center gap-2 border-t border-[var(--border)] pt-3 font-mono text-xs text-[var(--text-muted)]">
                    <span>{formatDate(post.date, lang)}</span>
                    {post.readingTime && (
                        <>
                            <span aria-hidden="true">·</span>
                            <span>{post.readingTime} min</span>
                        </>
                    )}
                    {typeof reactions === "number" && reactions > 0 && (
                        <>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1">
                                <Star
                                    className="h-3 w-3 fill-[var(--accent)] text-[var(--accent)]"
                                    aria-hidden="true"
                                />
                                <span className="tabular-nums">{reactions}</span>
                            </span>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}
