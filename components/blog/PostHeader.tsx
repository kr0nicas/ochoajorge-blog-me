import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/posts";

interface PostHeaderProps {
    post: Post;
}

/**
 * PostHeader — the full article header with back link, tags,
 * title, description, and meta (date + reading time).
 * Rendered server-side inside the [slug] page.
 */
export function PostHeader({ post }: PostHeaderProps) {
    return (
        <header className="mb-12">
            {/* Back navigation */}
            <Link
                href="/blog"
                className="group mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--brand-light)] no-underline"
            >
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                All articles
            </Link>

            {/* Tags */}
            {post.tags.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <Link
                            key={tag}
                            href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
                            className="tag"
                            aria-label={`Posts tagged ${tag}`}
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
                {post.title}
            </h1>

            {/* Description / lead */}
            {post.description && (
                <p className="mt-5 text-lg leading-relaxed text-[var(--text-secondary)]">
                    {post.description}
                </p>
            )}

            {/* Meta row */}
            <div className="mt-7 flex flex-wrap items-center gap-5 border-t border-[var(--border)] pt-6 text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.date)}
                </span>
                {post.readingTime && (
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {post.readingTime} min read
                    </span>
                )}
            </div>
        </header>
    );
}
