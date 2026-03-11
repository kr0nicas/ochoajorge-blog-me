import Link from "next/link";
import { Tag } from "@/components/shared/Tag";

interface Resource {
  label: string;
  url: string;
}

interface ReferencePanelProps {
  lang: "es" | "en";
  tags: string[];
  seriesName?: string;
  seriesSlug?: string;
  resources?: Resource[];
}

export function ReferencePanel({
  lang,
  tags,
  seriesName,
  seriesSlug,
  resources,
}: ReferencePanelProps) {
  const isSpanish = lang === "es";
  return (
    <section className="mt-14 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {isSpanish ? "Referencias rápidas" : "Quick references"}
        </h2>
        <span className="text-xs uppercase tracking-[0.4em] text-[var(--text-muted)]">
          {isSpanish ? "Vista general" : "Overview"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--brand-light)]">
            {isSpanish ? "Etiquetas clave" : "Key tags"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Tag key={tag} name={tag} lang={lang} linkable />
              ))
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">
                {isSpanish ? "Agrega tags para agrupar este artículo." : "Add tags to cluster this write-up."}
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--brand-light)]">
            {isSpanish ? "Serie y continuidad" : "Series continuity"}
          </p>
          {seriesName && seriesSlug ? (
            <Link
              href={`/${lang}/series/${seriesSlug}`}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-brand)] hover:text-[var(--text-primary)]"
            >
              ✦ {seriesName}
            </Link>
          ) : (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {isSpanish
                ? "Este post aún no forma parte de una serie."
                : "This post is not part of a series yet."}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--brand-light)]">
          {isSpanish ? "Recursos externos" : "External resources"}
        </p>
        {resources && resources.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
            {resources.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-[var(--brand-light)] underline-offset-4 transition hover:text-[var(--brand)]"
                >
                  {resource.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {isSpanish
              ? "Incluye recursos adicionales en el frontmatter para que aparezcan aquí."
              : "Add extra resources in the frontmatter to show them here."}
          </p>
        )}
      </div>
    </section>
  );
}
