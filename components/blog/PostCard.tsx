import Link from "next/link";
import { Calendar, Clock, ArrowRight, Layers } from "lucide-react";
import type { Post } from "@/lib/types";
import { cn, formatDate, slugify } from "@/lib/utils";
import { Tag } from "@/components/shared/Tag";

interface PostCardProps {
    post: Post;
    featured?: boolean;
    className?: string;
}

export function PostCard({ post, featured = false, className }: PostCardProps) {
    return (
        <div
            className={cn(
                "card-glass group relative flex flex-col p-6 transition-all duration-300",
                featured && "lg:p-8",
                className
            )}
        >
            {/* Series Indicator */}
            {post.series && (
                <Link
                    href={`/series/${slugify(post.series.name)}`}
                    className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-light)] transition-opacity hover:opacity-80 no-underline"
                >
                    <Layers className="h-3 w-3" />
                    {post.series.name} · Part {post.series.part}
                </Link>
            )}

            {/* Tags row */}
            {post.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                        <Tag key={tag} name={tag} />
                    ))}
                </div>
            )}

            {/* Title — the clickable part */}
            <Link
                href={`/blog/${post.slug}`}
                className="no-underline"
                aria-label={`Read: ${post.title}`}
            >
                <h2
                    className={cn(
                        "font-display font-semibold leading-snug text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--brand-light)]",
                        featured ? "text-2xl lg:text-3xl" : "text-xl"
                    )}
                >
                    {post.title}
                </h2>
            </Link>

            {/* Description */}
            <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                {post.description}
            </p>

            {/* Meta + Read more */}
            <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.date)}
                    </span>
                    {post.readingTime && (
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readingTime} min read
                        </span>
                    )}
                </div>

                <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-xs font-medium text-[var(--brand-light)] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 no-underline"
                    tabIndex={-1}
                    aria-hidden="true"
                >
                    Read
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        </div>
    );
}
