import Link from "next/link";
import { slugify } from "@/lib/utils";
import { Tag } from "@/components/shared/Tag";

interface TagStat {
  name: string;
  count: number;
}

interface SeriesStat {
  name: string;
  count: number;
}

export function TopicHighlights({
  lang,
  tags,
  series,
}: {
  lang: "es" | "en";
  tags: TagStat[];
  series: SeriesStat[];
}) {
  const isSpanish = lang === "es";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand-light)]">
            {isSpanish ? "Temas populares" : "Trending topics"}
          </p>
          <span className="text-[var(--text-muted)] text-[11px]">
            {isSpanish ? "Actualizado" : "Updated"}
          </span>
        </div>
        <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
          {isSpanish ? "Lo que más leen" : "What folks are reading"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <Tag key={tag.name} name={tag.name} count={tag.count} lang={lang} />
            ))
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              {isSpanish
                ? "Los tags aparecerán aquí una vez que publiques contenido."
                : "Tags will surface here as you publish more content."}
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand-light)]">
          {isSpanish ? "Series en curso" : "Series in progress"}
        </p>
        <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
          {isSpanish ? "Sigue la narrativa" : "Follow the narrative"}
        </p>
        <div className="mt-4 space-y-3">
          {series.length > 0 ? (
            series.map((serie) => (
              <Link
                key={serie.name}
                href={`/${lang}/series/${slugify(serie.name)}`}
                className="flex items-center justify-between rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-base)] px-4 py-3 transition hover:border-[var(--brand)] hover:bg-[var(--bg-elevated)]"
              >
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {serie.name}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {serie.count} {isSpanish ? "entrega" : "part"}{serie.count !== 1 && "s"}
                </span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              {isSpanish
                ? "Publica una serie para que aparezca aquí."
                : "Publish a series to highlight it here."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
