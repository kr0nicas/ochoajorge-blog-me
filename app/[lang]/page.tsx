import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import {
  getAllPosts,
  getAllSeries,
  getHeroPost,
  getPostsBySeries,
} from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Hero } from "@/components/layout/Hero";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { formatDate, siteConfig } from "@/lib/utils";
import { getDictionary, Locale } from "@/lib/dictionary";
import { TopicHighlights } from "@/components/blog/TopicHighlights";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === "es" ? "es" : "en") as Locale;
  const dict = getDictionary(locale);
  const heroPost = getHeroPost(locale);
  const allPosts = getAllPosts(locale).filter((post) => !post.draft);
  const recentPosts = allPosts
    .filter((post) => post.slug !== heroPost?.slug)
    .slice(0, 6);
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
  const seriesStats = getAllSeries(locale)
    .map((name) => ({
      name,
      count: getPostsBySeries(name, lang).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
  const isSpanish = locale === "es";

  return (
    <>
      {/* ── Hero `$ whoami` ─────────────────────────────────────── */}
      <Hero
        githubUrl={siteConfig.author.github}
        linkedinUrl={siteConfig.author.linkedin}
        blueskyUrl={siteConfig.author.bluesky}
        lang={lang}
        dict={dict.hero}
      />

      {/* ── Featured post — big OG artwork ──────────────────────── */}
      {heroPost && (
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--brand)]">
              {isSpanish ? "// destacado" : "// featured"}
            </p>
            <article className="group grid gap-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] transition-all duration-300 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] lg:grid-cols-[3fr_2fr]">
              <Link
                href={`/${lang}/blog/${heroPost.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="no-underline"
              >
                <Image
                  src={`/${lang}/blog/${heroPost.slug}/opengraph-image`}
                  alt=""
                  width={1200}
                  height={630}
                  priority
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="aspect-[1200/630] h-full w-full object-cover"
                />
              </Link>
              <div className="flex flex-col justify-center p-6 lg:pl-0 lg:pr-8">
                <Link
                  href={`/${lang}/blog/${heroPost.slug}`}
                  className="no-underline"
                  aria-label={`Read: ${heroPost.title}`}
                >
                  <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--brand-light)] sm:text-3xl">
                    {heroPost.title}
                  </h2>
                </Link>
                <p className="mt-3 leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                  {heroPost.description}
                </p>
                <div className="mt-5 flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
                  <span>{formatDate(heroPost.date, lang)}</span>
                  {heroPost.readingTime && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{heroPost.readingTime} min</span>
                    </>
                  )}
                </div>
              </div>
            </article>
          </AnimatedSection>
        </section>
      )}

      {/* ── Topic Highlights ────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <TopicHighlights lang={locale} tags={topTags} series={seriesStats} />
      </section>

      {/* ── Recent posts ────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="mb-1 font-mono text-xs uppercase tracking-widest text-[var(--brand)]">
                  {isSpanish ? "// recientes" : "// recent"}
                </p>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                  {isSpanish ? "Últimos artículos" : "Latest articles"}
                </h2>
              </div>
              <Link
                href={`/${lang}/blog`}
                id="homepage-view-all-posts"
                className="group hidden items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--brand-light)] sm:flex"
              >
                {isSpanish ? "Ver todos" : "View all"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.06}>
                <PostCard post={post} lang={lang} priority={i < 3} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3} className="mt-6 sm:hidden">
            <Link
              href={`/${lang}/blog`}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--brand-light)]"
            >
              {isSpanish ? "Ver todos los artículos" : "View all articles"}
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

      {/* ── About teaser (sin stats) ────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 transition-all duration-500 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] lg:p-8">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[var(--brand)]">
              {isSpanish ? "// sobre mí" : "// about"}
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Jorge Ochoa
            </h2>
            <div className="mt-4 max-w-3xl leading-relaxed text-[var(--text-secondary)]">
              {isSpanish ? (
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
              {isSpanish ? "Más sobre mí" : "More about me"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
