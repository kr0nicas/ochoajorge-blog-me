import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getFeaturedPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Hero } from "@/components/layout/Hero";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { siteConfig } from "@/lib/utils";
import { getDictionary, Locale } from "@/lib/dictionary";

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
  const featuredPosts = getFeaturedPosts(4, lang);

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

      {/* ── About Teaser ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <AnimatedSection>
          {/* Glass card with subtle border glow on hover */}
          <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[rgba(19,19,26,0.7)] p-6 backdrop-blur-xl transition-all duration-500 hover:border-[rgba(99,102,241,0.25)] hover:shadow-[0_0_60px_rgba(99,102,241,0.08)] lg:p-8">
            {/* Decorative top-right glow orb */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_70%)] transition-opacity duration-500 group-hover:opacity-150" />

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
                      Arquitecto de software y desarrollador full-stack basado en El Salvador.
                      Actualmente construyendo <span className="font-medium text-[var(--text-primary)]">Orbis 8</span>,
                      un ERP SaaS multi-tenant para PYMES, utilizando Python, Go y Next.js.
                      Apasionado por la arquitectura limpia, ingeniería de IA y herramientas para desarrolladores.
                    </p>
                  ) : (
                    <p>
                      Software architect and full-stack developer based in El Salvador.
                      Currently building <span className="font-medium text-[var(--text-primary)]">Orbis 8</span>,
                      a multi-tenant ERP SaaS for SMBs, using Python, Go, and Next.js.
                      Passionate about clean architecture, AI engineering, and developer tooling.
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
                    className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-center transition-all duration-200 hover:border-[rgba(99,102,241,0.25)] lg:items-start lg:text-left"
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
