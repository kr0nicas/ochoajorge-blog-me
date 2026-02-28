import Link from "next/link";
import { getPostsBySeries } from "@/lib/posts";
import { Layers, ChevronRight, Check } from "lucide-react";
import { cn, slugify } from "@/lib/utils";

interface SeriesBannerProps {
    series: { name: string; part: number };
    currentSlug: string;
    lang: string;
}

export function SeriesBanner({ series, currentSlug, lang }: SeriesBannerProps) {
    const isSpanish = lang === "es";
    const seriesPosts = getPostsBySeries(series.name, lang);
    const totalParts = seriesPosts.length;

    return (
        <aside className="my-10 overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)]/40 backdrop-blur-md shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--brand)]/10 to-transparent px-6 py-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand)]/15 text-[var(--brand-light)] shadow-inner">
                    <Layers className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="inline-block rounded-full bg-[var(--brand)]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--brand-light)]">
                        {isSpanish ? `Parte ${series.part} de ${totalParts}` : `Part ${series.part} of ${totalParts}`}
                    </span>
                    <Link href={`/${lang}/series/${slugify(series.name)}`} className="block group/title">
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mt-0.5 truncate group-hover/title:text-[var(--brand-light)] transition-colors">
                            {series.name}
                        </h3>
                    </Link>
                </div>
            </div>

            {/* List of parts */}
            <nav className="p-3">
                <ul className="grid gap-1.5" role="list">
                    {seriesPosts.map((post) => {
                        const isCurrent = post.slug === currentSlug;
                        const isCompleted = (post.series?.part ?? 0) < series.part;

                        return (
                            <li key={post.slug}>
                                <Link
                                    href={`/${lang}/blog/${post.slug}`}
                                    className={cn(
                                        "group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition-all duration-300",
                                        isCurrent
                                            ? "bg-[var(--brand)]/10 font-semibold text-[var(--brand-light)] pointer-events-none ring-1 ring-[var(--brand)]/30"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--brand-light)]"
                                    )}
                                >
                                    {/* Part indicator */}
                                    <div className={cn(
                                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums transition-colors duration-300",
                                        isCurrent
                                            ? "bg-[var(--brand-light)] text-[var(--brand)]"
                                            : isCompleted
                                                ? "bg-[var(--brand)]/20 text-[var(--brand-light)]"
                                                : "bg-[var(--border-strong)] text-[var(--text-muted)] group-hover:bg-[var(--brand)]/20 group-hover:text-[var(--brand-light)]"
                                    )}>
                                        {isCompleted ? <Check className="h-3 w-3" /> : post.series?.part}
                                    </div>

                                    {/* Title */}
                                    <span className="flex-1 truncate">{post.title}</span>

                                    {/* Hover arrow or current indicator */}
                                    {!isCurrent ? (
                                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 opacity-20 group-hover:opacity-100" />
                                    ) : (
                                        <span className="text-[10px] uppercase font-bold tracking-widest bg-[var(--brand)]/20 px-2 py-0.5 rounded text-[var(--brand-light)]">
                                            {isSpanish ? "Actual" : "Current"}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
