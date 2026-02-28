import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/posts";
import { cn } from "@/lib/utils";

interface PostCardProps {
    post: Post;
    featured?: boolean;
    className?: string;
}

export function PostCard({ post, featured = false, className }: PostCardProps) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className={cn(
                "group card-glass block p-6 no-underline",
                featured ? "lg:p-8" : "p-6",
                className
            )}
            aria-label={`Read: ${post.title}`}
        >
            {/* Tags */}
            {post.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Title */}
            <h2
                className={cn(
                    "font-display font-semibold text-[var(--text-primary)] leading-snug transition-colors duration-200 group-hover:text-[var(--brand-light)]",
                    featured ? "text-2xl lg:text-3xl" : "text-xl"
                )}
            >
                {post.title}
            </h2>

            {/* Description */}
            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                {post.description}
            </p>

            {/* Meta */}
            <div className="mt-4 flex items-center justify-between">
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

                <span className="flex items-center gap-1 text-xs font-medium text-[var(--brand-light)] opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
                    Read more
                    <ArrowRight className="h-3.5 w-3.5" />
                </span>
            </div>
        </Link>
    );
}
