import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsBySeries, getAllSeries } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Layers, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";

interface SeriesPageProps {
    params: Promise<{ slug: string; lang: string }>;
}

/** Pre-generate a page for every series. */
export async function generateStaticParams({ params }: { params: { lang: string } }) {
    const { lang } = params;
    return getAllSeries(lang).map((name) => ({
        slug: slugify(name),
    }));
}

export async function generateMetadata({
    params,
}: SeriesPageProps): Promise<Metadata> {
    const { slug, lang } = await params;
    const seriesName = getAllSeries(lang).find(
        (s) => slugify(s) === slug
    );
    const isSpanish = lang === "es";

    if (!seriesName) return { title: isSpanish ? "Serie No Encontrada" : "Series Not Found" };

    return {
        title: `${isSpanish ? "Serie" : "Series"}: ${seriesName}`,
        description: isSpanish
            ? `Explora todas las partes de la serie "${seriesName}". Inmersiones profundas en arquitectura de software e ingeniería.`
            : `Explore all parts of the "${seriesName}" series. Deep dives into software architecture and engineering.`,
    };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
    const { slug, lang } = await params;
    const seriesName = getAllSeries(lang).find(
        (s) => slugify(s) === slug
    );

    if (!seriesName) notFound();

    const posts = getPostsBySeries(seriesName, lang);
    const isSpanish = lang === "es";

    return (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            {/* Breadcrumb / Back */}
            <Link
                href={`/${lang}/blog`}
                className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--brand-light)]"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {isSpanish ? "Volver a todos los artículos" : "Back to all posts"}
            </Link>

            {/* Header */}
            <header className="mb-12 border-b border-[var(--border)] pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand-light)] border border-[var(--brand)]/20 shadow-lg shadow-[var(--brand)]/5">
                        <Layers className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-light)]">
                        {isSpanish ? "Serie Especial" : "Special Series"}
                    </span>
                </div>

                <h1 className="font-display text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl lg:text-6xl tracking-tight">
                    {seriesName}
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-[var(--text-secondary)] leading-relaxed">
                    {isSpanish
                        ? `Una inmersión profunda de varias partes en ${seriesName.toLowerCase()}. Sigue la secuencia para construir una comprensión completa del tema.`
                        : `A multi-part deep dive into ${seriesName.toLowerCase()}. Follow the sequence to build a comprehensive understanding of the topic.`}
                </p>

                <div className="mt-8 flex items-center gap-4 text-sm text-[var(--text-muted)]">
                    <span className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-[var(--brand-light)]" />
                        {posts.length} {isSpanish ? "entregas" : "installments"}
                    </span>
                    <span className="h-4 w-px bg-[var(--border)]" />
                    <span>{isSpanish ? "Secuencia completa" : "Sequence complete"}</span>
                </div>
            </header>

            {/* Posts Sequence */}
            <div className="grid gap-8">
                {posts.map((post, index) => (
                    <div key={post.slug} className="relative flex gap-8">
                        {/* Sequence indicator line */}
                        {index !== posts.length - 1 && (
                            <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-[var(--border-strong)] to-transparent" />
                        )}

                        {/* Part Number bubble */}
                        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border-strong)] bg-[var(--bg-base)] text-sm font-bold tabular-nums text-[var(--text-muted)] group-hover:border-[var(--brand)]">
                            {index + 1}
                        </div>

                        {/* Post content */}
                        <div className="flex-1 pb-12">
                            <PostCard post={post} lang={lang} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
