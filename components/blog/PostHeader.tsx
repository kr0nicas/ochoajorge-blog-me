import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { PILLARS } from "@/lib/pillars";

interface PostHeaderProps {
    post: Post;
    lang: string;
}

export function PostHeader({ post, lang }: PostHeaderProps) {
    const isSpanish = lang === "es";
    const locale = isSpanish ? "es" : "en";
    const pillar = post.pillar ? PILLARS[post.pillar] : null;
    const kickerLabel =
        pillar?.name[locale] ?? post.series?.name ?? post.tags?.[0] ?? null;
    const kickerHref = pillar
        ? `/${lang}/${isSpanish ? "temas" : "topics"}/${pillar.routeSlug[locale]}`
        : null;

    return (
        <header className="mb-12">
            {/* Back navigation */}
            <Link
                href={`/${lang}/blog`}
                className="group mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--brand-light)] no-underline"
            >
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                {isSpanish ? "Todos los artículos" : "All articles"}
            </Link>

            {/* Kicker `// pilar` */}
            {kickerLabel && (
                <p className="mb-4 font-mono text-sm text-[var(--brand)]">
                    {kickerHref ? (
                        <Link
                            href={kickerHref}
                            className="no-underline transition-opacity hover:opacity-80"
                        >
                            {`// ${kickerLabel}`}
                        </Link>
                    ) : (
                        `// ${kickerLabel}`
                    )}
                </p>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
                {post.title}
            </h1>

            {/* Description / lead */}
            {post.description && (
                <p className="mt-5 text-lg leading-relaxed text-[var(--text-secondary)]">
                    {post.description}
                </p>
            )}

            {/* Tags */}
            {(post.tags ?? []).length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                    {(post.tags ?? []).map((tag) => (
                        <Link
                            key={tag}
                            href={`/${lang}/tags/${encodeURIComponent(tag.toLowerCase())}`}
                            className="tag"
                            aria-label={`Posts tagged ${tag}`}
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
            )}

            {/* Meta row — mono */}
            <div className="mt-7 flex flex-wrap items-center gap-5 border-t border-[var(--border)] pt-6 font-mono text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.date, lang)}
                </span>
                {post.readingTime && (
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {post.readingTime} {isSpanish ? "min de lectura" : "min read"}
                    </span>
                )}
            </div>
        </header>
    );
}
