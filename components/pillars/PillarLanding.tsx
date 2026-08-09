import Link from "next/link";
import type { PillarDef } from "@/lib/pillars";
import { getPostsByPillar } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { slugify } from "@/lib/utils";

interface PillarLandingProps {
    lang: "es" | "en";
    pillar: PillarDef;
}

/** Landing page of one section: pain intro + its posts + related series. */
export function PillarLanding({ lang, pillar }: PillarLandingProps) {
    const posts = getPostsByPillar(pillar.id, lang);
    const isSpanish = lang === "es";

    // Series with 2+ posts inside this section
    const seriesCounts = new Map<string, number>();
    for (const post of posts) {
        if (post.series) {
            seriesCounts.set(post.series.name, (seriesCounts.get(post.series.name) ?? 0) + 1);
        }
    }
    const relatedSeries = [...seriesCounts.entries()].filter(([, n]) => n >= 2).map(([name]) => name);

    return (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="kicker mb-2">{`// ${pillar.id}`}</p>
            <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
                {pillar.name[lang]}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-[var(--text-secondary)]">{pillar.intro[lang]}</p>

            {relatedSeries.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                    {relatedSeries.map((name) => (
                        <Link key={name} href={`/${lang}/series/${slugify(name)}`} className="tag">
                            {isSpanish ? "Serie" : "Series"}: {name}
                        </Link>
                    ))}
                </div>
            )}

            {posts.length > 0 ? (
                <ul className="mt-10 grid gap-5 sm:grid-cols-2" role="list">
                    {posts.map((post) => (
                        <li key={post.slug}>
                            <PostCard post={post} lang={lang} />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="card mt-10 p-8 text-center">
                    <p className="text-[var(--text-secondary)]">
                        {isSpanish
                            ? "Aún no hay artículos en esta sección."
                            : "No articles here yet — coming soon."}
                    </p>
                    {lang === "en" && (
                        <Link
                            href={`/es/temas/${pillar.routeSlug.es}`}
                            className="mt-3 inline-block text-sm font-medium text-[var(--brand)]"
                        >
                            Read the Spanish section →
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
