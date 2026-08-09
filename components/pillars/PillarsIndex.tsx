import Link from "next/link";
import { PILLAR_IDS, PILLARS } from "@/lib/pillars";
import { getAllPosts } from "@/lib/posts";

interface PillarsIndexProps {
    lang: "es" | "en";
}

/** Index of the four pain-oriented sections ("doors"). Server component. */
export function PillarsIndex({ lang }: PillarsIndexProps) {
    const base = lang === "es" ? "temas" : "topics";
    const posts = getAllPosts(lang);
    const isSpanish = lang === "es";

    return (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="kicker mb-2">{`// ${isSpanish ? "temas" : "topics"}`}</p>
            <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
                {isSpanish ? "¿Qué te duele hoy?" : "What hurts today?"}
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--text-secondary)]">
                {isSpanish
                    ? "Cuatro secciones, cuatro problemas reales. Entra por el tuyo."
                    : "Four sections, four real problems. Pick yours."}
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {PILLAR_IDS.map((id) => {
                    const pillar = PILLARS[id];
                    const count = posts.filter((p) => p.pillar === id).length;
                    return (
                        <Link
                            key={id}
                            href={`/${lang}/${base}/${pillar.routeSlug[lang]}`}
                            className="card group flex flex-col p-6 no-underline"
                        >
                            <span className="kicker">{`// ${id}`}</span>
                            <h2 className="mt-2 font-display text-xl font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand)]">
                                {pillar.name[lang]}
                            </h2>
                            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                                {pillar.intro[lang]}
                            </p>
                            <span className="mt-4 font-mono text-xs text-[var(--text-muted)]">
                                {count} {isSpanish ? (count === 1 ? "artículo" : "artículos") : (count === 1 ? "article" : "articles")}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
