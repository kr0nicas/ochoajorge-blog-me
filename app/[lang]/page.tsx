import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import {
  getAllPosts,
  getAllSeries,
  getFeaturedPosts,
  getPostsBySeries,
} from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Hero } from "@/components/layout/Hero";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { siteConfig } from "@/lib/utils";
import { getDictionary, Locale } from "@/lib/dictionary";
import { TopicHighlights } from "@/components/blog/TopicHighlights";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

const stats = [
  { value: "5+", label: "Years building" },
  { value: "20+", label: "Projects shipped" },
  { value: "∞", label: "Cups of coffee" },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang as Locale);
  const featuredPosts = getFeaturedPosts(8, lang);
  const allPosts = getAllPosts(lang);
  const tagCounts = allPosts.reduce<Record<string, number>>((acc, post) => {
    post.tags.forEach((tag) => {
      const normalized = tag.toLowerCase();
      acc[normalized] = (acc[normalized] ?? 0) + 1;
    });
    return acc;
  }, {});
  const topTags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const seriesStats = getAllSeries(lang)
    .map((name) => ({
      name,
      count: getPostsBySeries(name, lang).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <>
      {/* ── Hero (Client — Framer Motion) ─────────────────────── */}
      <Hero
        githubUrl={siteConfig.author.github}
        linkedinUrl={siteConfig.author.linkedin}
        blueskyUrl={siteConfig.author.bluesky}
        lang={lang}
        dict={dict.hero}
      />

      {/* ── Topic Highlights ────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <TopicHighlights lang={lang} tags={topTags} series={seriesStats} />
      </section>

      {/* ── Featured Posts ─────────────────────────────────────── */}
      {featuredPosts.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-[var(--brand-light)]">
                  {lang === 'es' ? 'Escritos' : 'Writing'}
                </p>
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                  {lang === 'es' ? 'Últimos Artículos' : 'Latest Articles'}
                </h2>
              </div>
              <Link
                href={`/${lang}/blog`}
                id="homepage-view-all-posts"
                className="group hidden items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--brand-light)] sm:flex"
              >
                {lang === 'es' ? 'Ver todos' : 'View all'}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </AnimatedSection>

          {/* Posts grid: first post spans full width, rest 2-col */}
          <div className="grid gap-5 sm:grid-cols-2">
            {featuredPosts.map((post, i) => (
              <AnimatedSection
                key={post.slug}
                delay={i * 0.08}
              >
                <PostCard post={post} lang={lang} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3} className="mt-6 sm:hidden">
            <Link
              href={`/${lang}/blog`}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--brand-light)]"
            >
              {lang === 'es' ? 'Ver todos los artículos' : 'View all articles'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </AnimatedSection>
        </section>
      )}

      {/* ── Newsletter ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
        <AnimatedSection delay={0.2}>
          <NewsletterForm lang={lang} variant="full" />
        </AnimatedSection>
      </section>

      {/* ── About Teaser ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <AnimatedSection>
          {/* Glass card with subtle border glow on hover */}
          <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--glass-bg)] p-6 backdrop-blur-xl transition-all duration-500 hover:border-[var(--border-brand)] hover:shadow-[var(--shadow-brand)] lg:p-8">
            {/* Decorative glow orb — theme-aware */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(var(--brand-rgb),0.12),transparent_70%)] transition-opacity duration-500 group-hover:opacity-150" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
              {/* Bio */}
              <div className="flex-1">
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--brand-light)]">
                  {lang === 'es' ? 'Sobre mí' : 'About'}
                </p>
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                  Jorge Ochoa
                </h2>
                <div className="mt-4 leading-relaxed text-[var(--text-secondary)]">
                  {lang === 'es' ? (
                    <p>
                      Technical Solutions Architect basado en El Salvador, experto en <strong>Google Cloud</strong> y Kubernetes.
                      Ayudo a transformar infraestructuras corporativas aplicando patrones de <strong>Arquitectura Limpia</strong>.
                      Actualmente construyendo software de alto rendimiento con <span className="font-medium text-[var(--text-primary)]">Go</span>,
                      Python y <span className="font-medium text-[var(--text-primary)]">Agentes IA</span> autónomos.
                    </p>
                  ) : (
                    <p>
                      Technical Solutions Architect based in El Salvador, expert in <strong>Google Cloud</strong> and Kubernetes.
                      I help transform corporate infrastructures by applying <strong>Clean Architecture</strong> patterns.
                      Currently building high-performance software with <span className="font-medium text-[var(--text-primary)]">Go</span>,
                      Python, and autonomous <span className="font-medium text-[var(--text-primary)]">AI Agents</span>.
                    </p>
                  )}
                </div>
                <Link
                  href={`/${lang}/about`}
                  id="homepage-about-link"
                  className="group/link mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-light)] transition-opacity hover:opacity-80"
                >
                  {lang === 'es' ? 'Más sobre mí' : 'More about me'}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 lg:w-60 lg:grid-cols-1 lg:gap-3">
                {stats.map(({ value, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-center transition-all duration-200 hover:border-[var(--border-brand)] lg:items-start lg:text-left"
                  >
                    <span className="font-display text-2xl font-bold gradient-text">
                      {value}
                    </span>
                    <span className="mt-0.5 text-xs text-[var(--text-muted)]">
                      {lang === 'es' ? (
                        label === 'Years building' ? 'Años construyendo' :
                          label === 'Projects shipped' ? 'Proyectos lanzados' :
                            label === 'Cups of coffee' ? 'Tazas de café' : label
                      ) : label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
