# Fase 2 — Presentación de Posts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Home con hero `$ whoami` + post destacado con su OG image, PostCard rediseñada con OG image como thumbnail, PostHeader con kicker de pilar, y los 4 carry-overs del review de Fase 1.

**Architecture:** Server Components salvo interactividad existente (Hero usa framer-motion y sigue client). Las OG images dinámicas (`/[lang]/blog/[slug]/opengraph-image`) sirven de thumbnail vía `next/image`. La selección del post destacado vive en `lib/posts.ts`.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind v4 (tokens en `@theme` de `app/globals.css`), next/image, next/og.

## Global Constraints

- Rama de trabajo: `fase2-presentacion-posts` creada desde `origin/develop`. PR con base `develop` (ver `AGENTS.md`). NUNCA push a `main` ni `develop`.
- Commits convencionales `tipo(ámbito): asunto`, en inglés, con `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Identificadores de código en inglés; copy visible bilingüe ES/EN vía `lang === "es"` o `lib/dictionary.ts`.
- Cero dependencias externas nuevas.
- Tokens: usar SOLO los vars existentes (`--bg-base`, `--bg-surface`, `--bg-elevated`, `--text-primary`, `--text-secondary`, `--text-muted`, `--brand`, `--brand-light`, `--accent`, `--border`, `--border-strong`, `--border-brand`, `--shadow-md`). Azul para enlaces/kickers/foco; naranja SOLO señales pequeñas.
- Tipos de letra: `font-display` (Space Grotesk) para titulares, `font-mono` (JetBrains Mono) para meta/kickers, cuerpo Archivo por defecto.
- No tocar URLs ni estructura de contenido. No tocar páginas secundarias.
- Verificación global al final: `npm run seo:audit && npm run build && npm run test:e2e`.

---

### Task 0: Rama + plan

**Files:**
- Create: `docs/superpowers/plans/2026-08-09-fase2-presentacion-posts.md` (este archivo)

- [ ] **Step 1: Crear la rama desde develop**

```bash
git fetch origin
git switch -c fase2-presentacion-posts origin/develop
```

- [ ] **Step 2: Commit del plan**

```bash
git add docs/superpowers/plans/2026-08-09-fase2-presentacion-posts.md
git commit -m "docs(plans): fase 2 presentacion de posts implementation plan"
```

---

### Task 1: Selección del post destacado (`getHeroPost`)

**Files:**
- Modify: `lib/posts.ts` (después de `getFeaturedPosts`, ~línea 125)

**Interfaces:**
- Consumes: `getAllPosts(locale): Post[]` (ya existe; ordena por fecha desc).
- Produces: `getHeroPost(locale?: string): Post | null` — primer post con `featured: true` no-draft; fallback: el más reciente no-draft. Task 3 lo consume en la home.

- [ ] **Step 1: Implementar `getHeroPost`**

En `lib/posts.ts`, después de `getFeaturedPosts`:

```ts
/**
 * Hero post for the home page: first `featured: true`, newest first;
 * falls back to the most recent published post.
 */
export function getHeroPost(locale: string = "es"): Post | null {
    const published = getAllPosts(locale).filter((post) => !post.draft);
    return published.find((post) => post.featured) ?? published[0] ?? null;
}
```

- [ ] **Step 2: Verificar tipos**

Run: `npm run type-check`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add lib/posts.ts
git commit -m "feat(posts): add getHeroPost selection for home hero"
```

---

### Task 2: PostCard con OG image

**Files:**
- Modify: `components/blog/PostCard.tsx` (reescritura completa)

**Interfaces:**
- Consumes: `Post` de `lib/types.ts` (`slug`, `title`, `description`, `date`, `readingTime?`, `series?`, `tags`), `formatDate(date, lang)` y `slugify` de `lib/utils`.
- Produces: `PostCard({ post, lang?, featured?, priority?, className? })`. `priority?: boolean` (default `false`) marca la imagen como eager/priority para above-the-fold. Los call sites existentes (`app/[lang]/page.tsx`, `app/[lang]/tags/[tag]/page.tsx`, `app/[lang]/series/[slug]/page.tsx`, `components/blog/PostGrid.tsx`, `components/pillars/PillarLanding.tsx`) siguen compilando sin cambios: solo se AÑADE la prop opcional `priority`.

- [ ] **Step 1: Reescribir `PostCard.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { Layers } from "lucide-react";
import type { Post } from "@/lib/types";
import { cn, formatDate, slugify } from "@/lib/utils";

interface PostCardProps {
    post: Post;
    featured?: boolean;
    className?: string;
    lang?: string;
    /** Above-the-fold cards: load the OG thumbnail eagerly */
    priority?: boolean;
}

export function PostCard({
    post,
    featured = false,
    className,
    lang = "es",
    priority = false,
}: PostCardProps) {
    const isSpanish = lang === "es";

    return (
        <article
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] transition-all duration-300 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]",
                className
            )}
        >
            {/* OG thumbnail — same artwork used for social sharing */}
            <Link
                href={`/${lang}/blog/${post.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="no-underline"
            >
                <Image
                    src={`/${lang}/blog/${post.slug}/opengraph-image`}
                    alt=""
                    width={1200}
                    height={630}
                    priority={priority}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                    className="aspect-[1200/630] w-full border-b border-[var(--border)] object-cover"
                />
            </Link>

            <div className={cn("flex flex-1 flex-col p-5", featured && "lg:p-6")}>
                {/* Series indicator */}
                {post.series && (
                    <Link
                        href={`/${lang}/series/${slugify(post.series.name)}`}
                        className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--brand-light)] no-underline transition-opacity hover:opacity-80"
                    >
                        <Layers className="h-3 w-3" />
                        {post.series.name} ·{" "}
                        {isSpanish ? `Parte ${post.series.part}` : `Part ${post.series.part}`}
                    </Link>
                )}

                {/* Title — display type, the clickable part */}
                <Link
                    href={`/${lang}/blog/${post.slug}`}
                    className="no-underline"
                    aria-label={`Read: ${post.title}`}
                >
                    <h2
                        className={cn(
                            "font-display font-bold leading-snug tracking-tight text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--brand-light)]",
                            featured ? "text-2xl lg:text-3xl" : "text-lg"
                        )}
                    >
                        {post.title}
                    </h2>
                </Link>

                {/* Description */}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                    {post.description}
                </p>

                {/* Meta — mono, hairline top */}
                <div className="mt-4 flex items-center gap-2 border-t border-[var(--border)] pt-3 font-mono text-xs text-[var(--text-muted)]">
                    <span>{formatDate(post.date, lang)}</span>
                    {post.readingTime && (
                        <>
                            <span aria-hidden="true">·</span>
                            <span>
                                {post.readingTime} {isSpanish ? "min" : "min"}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}
```

Notas:
- Se elimina la clase `card` (glass legacy) y los iconos `Calendar`/`Clock`/`ArrowRight` (el meta mono ya comunica; menos ruido).
- `alt=""` + `aria-hidden` en el link de imagen: el link accesible es el del título (evita duplicar targets para lectores de pantalla).
- El separador del meta es `·` — cuando Fase 3 añada reacciones, el ★ se agrega a esta fila.

- [ ] **Step 2: Verificar que todos los call sites compilan**

Run: `npm run type-check`
Expected: sin errores (la prop nueva es opcional).

- [ ] **Step 3: Verificación visual en dev**

Run: `npm run dev` y abrir `http://localhost:3000/es/blog`
Expected: cada card muestra su OG image arriba, título en Space Grotesk, meta en mono. Ambos temas (toggle) sin fondos glass.

- [ ] **Step 4: Commit**

```bash
git add components/blog/PostCard.tsx
git commit -m "feat(cards): OG image thumbnail, display title, mono meta"
```

---

### Task 3: Home — hero `$ whoami`, destacado, recientes

**Files:**
- Modify: `components/layout/Hero.tsx` (reescritura)
- Modify: `app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `getHeroPost(locale)` (Task 1), `PostCard` con prop `priority` (Task 2), `NewsletterForm({ lang, variant: "full" })`, `TopicHighlights`, `getDictionary(locale).hero` (`{ title, subtitle }`).
- Produces: nada para tareas posteriores.

- [ ] **Step 1: Reescribir `Hero.tsx` como hero `$ whoami`**

Mantener client component (framer-motion) y las props actuales para no romper el call site. Sustituir el contenido: fuera foto y badge Sparkles; entra prompt mono + titular de impacto.

```tsx
"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

interface HeroProps {
    githubUrl: string;
    linkedinUrl: string;
    blueskyUrl: string;
    lang: string;
    dict: {
        title: string;
        subtitle: string;
    };
}

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
} as const;

const BlueskyIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 10.8c-1.32-2.31-3.6-5.8-6.12-6.84C3.36 2.94 2 3.6 2 6c0 1.2.6 4.8 1.2 6 .6 1.2 2.4 2.4 3.6 2.4-1.2 0-3 .6-3 1.8 0 1.8 1.8 4.2 4.2 4.2 3 0 4.8-2.4 4.8-4.2 0 1.8 1.8 4.2 4.8 4.2 2.4 0 4.2-2.4 4.2-4.2 0-1.2-1.8-1.8-3-1.8 1.2 0 3-1.2 3.6-2.4.6-1.2 1.2-4.8 1.2-6 0-2.4-1.36-3.06-3.88-2.04-2.52 1.04-4.8 4.53-6.12 6.84Z" />
    </svg>
);

const SOCIAL_LINK_CLASSES =
    "flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--brand-light)] hover:text-[var(--text-primary)]";

export function Hero({ githubUrl, linkedinUrl, blueskyUrl, lang, dict }: HeroProps) {
    return (
        <section className="relative overflow-hidden bg-[var(--bg-base)]">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
            >
                {/* Prompt */}
                <motion.p
                    variants={itemVariants}
                    className="font-mono text-sm text-[var(--brand)]"
                    aria-hidden="true"
                >
                    $ whoami
                </motion.p>

                {/* Headline */}
                <motion.h1
                    variants={itemVariants}
                    className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-7xl"
                >
                    Jorge Ochoa
                    <span className="text-[var(--brand)]">.</span>
                </motion.h1>

                {/* Role line */}
                <motion.p
                    variants={itemVariants}
                    className="mt-3 font-mono text-sm text-[var(--text-muted)]"
                >
                    {dict.title}
                </motion.p>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg"
                >
                    {dict.subtitle}
                </motion.p>

                {/* Socials */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 flex flex-wrap items-center gap-3"
                >
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="GitHub"
                        className={SOCIAL_LINK_CLASSES}
                    >
                        <Github className="h-3.5 w-3.5" />
                        GH
                    </a>
                    <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="LinkedIn"
                        className={SOCIAL_LINK_CLASSES}
                    >
                        <Linkedin className="h-3.5 w-3.5" />
                        LI
                    </a>
                    <a
                        href={blueskyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Bluesky"
                        className={SOCIAL_LINK_CLASSES}
                    >
                        <BlueskyIcon className="h-3.5 w-3.5" />
                        BS
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}
```

- [ ] **Step 2: Rearmar `app/[lang]/page.tsx`**

Estructura nueva: Hero → Destacado (OG grande) → TopicHighlights → Recientes (grid 6) → Newsletter → About teaser SIN stats. Reemplazar el archivo completo:

```tsx
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
```

Notas:
- Desaparecen: `const stats` hardcodeadas, `getFeaturedPosts` en la home, la grid de stats del teaser.
- `getFeaturedPosts` NO se elimina de `lib/posts.ts` (lo usa `app/[lang]/blog/page.tsx` u otros; verificar con `rg -l getFeaturedPosts app/` antes de tocarla — si nadie más la usa, se deja igualmente: YAGNI aplica a añadir, no a borrar API estable en la misma fase).

- [ ] **Step 3: Verificar**

Run: `npm run type-check && npm run build`
Expected: sin errores. En dev, `/es` muestra: `$ whoami` → destacado con OG grande → topics → grid de 6 → newsletter → about sin números inventados.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Hero.tsx app/[lang]/page.tsx
git commit -m "feat(home): whoami hero, featured post with OG artwork, recent grid"
```

---

### Task 4: PostHeader con kicker de pilar; ShareButton solo al final

**Files:**
- Modify: `components/blog/PostHeader.tsx`

**Interfaces:**
- Consumes: `post.pillar?: PillarId`, `PILLARS` de `lib/pillars.ts` (`PILLARS[id].name[lang]`, `PILLARS[id].routeSlug[lang]`), `post.series?.name`, `post.tags`.
- Produces: header sin `ShareButton` (el del footer del post en `app/[lang]/blog/[slug]/page.tsx:212-216` ya existe y queda como único).

- [ ] **Step 1: Reescribir `PostHeader.tsx`**

```tsx
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
```

Notas:
- Fuera: `import { ShareButton }`, `import { siteConfig }` y el `<div className="ml-auto">` con ShareButton (el post footer ya tiene el suyo).
- Los tags bajan debajo de la descripción; el kicker toma el lugar de honor arriba del título.

- [ ] **Step 2: Verificar**

Run: `npm run type-check`
Expected: sin errores. En dev, un post con `pillar` muestra `// Seguridad y gobernanza` (linkeado a `/es/temas/seguridad`); un post sin pillar muestra su serie o primer tag; solo hay UN botón de compartir (al final).

- [ ] **Step 3: Commit**

```bash
git add components/blog/PostHeader.tsx
git commit -m "feat(post): pillar kicker in header, share button only in footer"
```

---

### Task 5: Carry-over — CodeComparison oscuro alineado al Terminal

**Files:**
- Modify: `components/mdx/MDXComponents.tsx:260-313` (el JSX de retorno de `CodeComparison`)

**Interfaces:**
- Consumes: nada nuevo.
- Produces: los paneles de código de `CodeComparison` siempre oscuros (`#0f0f10`), como `.terminal pre` de Fase 1.

- [ ] **Step 1: Oscurecer los paneles**

En el JSX de `CodeComparison` (líneas ~260-313), reemplazar el contenedor, la barra de tabs y el `motion.pre`:

Contenedor (línea ~261):

```tsx
<div className="not-prose my-6 overflow-hidden rounded-xl border border-[var(--border)] shadow-lg">
```

Barra de tabs (línea ~263):

```tsx
<div className="flex items-center justify-between border-b border-[#232326] bg-[#1a1a1c] px-3 py-2">
```

Botones de tab inactivos (línea ~273): cambiar `"text-[var(--text-muted)] hover:text-[var(--text-secondary)]"` por:

```tsx
"text-[#a8a8a8] hover:text-[#fafafa]"
```

Botón copiar (línea ~282): cambiar `border-[var(--border)]` y `text-[var(--text-muted)]` por:

```tsx
className="flex items-center gap-1 rounded-md border border-[#232326] px-2 py-1 text-[10px] text-[#a8a8a8] transition-all duration-150 hover:border-[#6b8cff] hover:text-[#6b8cff]"
```

`motion.pre` (línea ~306): cambiar `bg-[var(--bg-elevated)]` y `text-[var(--text-primary)]` por:

```tsx
className="overflow-x-auto bg-[#0f0f10] p-4 text-xs leading-relaxed text-[#fafafa]"
```

(Hex fijos a propósito: igual que `.terminal`, el panel de código es oscuro en AMBOS temas — no debe seguir los tokens del tema claro.)

- [ ] **Step 2: Verificar en dev**

Abrir un post con `<CodeComparison>` (p.ej. buscar con `rg -l CodeComparison content/posts/es`) en tema claro.
Expected: panel oscuro junto a los terminales oscuros, sin bloque blanco discordante.

- [ ] **Step 3: Commit**

```bash
git add components/mdx/MDXComponents.tsx
git commit -m "fix(mdx): CodeComparison panels dark in both themes, aligned with Terminal"
```

---

### Task 6: Carry-over — clamp de título en OG template

**Files:**
- Modify: `lib/og-template.tsx:111-125` (bloque Title) y `lib/og-template.tsx:36-38`

**Interfaces:**
- Consumes: nada nuevo.
- Produces: títulos larguísimos no desbordan el lienzo 1200×630.

- [ ] **Step 1: Truncar y escalar el título**

En `renderOgImage`, antes del `return` (línea ~38):

```tsx
const MAX_TITLE_CHARS = 120;
const displayTitle =
    title.length > MAX_TITLE_CHARS
        ? `${title.slice(0, MAX_TITLE_CHARS - 1).trimEnd()}…`
        : title;
const titleFontSize =
    displayTitle.length > 90 ? "44px" : displayTitle.length > 60 ? "56px" : "68px";
```

Y en el bloque Title (línea ~112-125) usar las variables:

```tsx
<div
    style={{
        position: "relative",
        fontFamily: "Space Grotesk",
        fontWeight: 700,
        fontSize: titleFontSize,
        lineHeight: 1.08,
        letterSpacing: "-0.02em",
        color: "#fafafa",
        maxWidth: "980px",
    }}
>
    {displayTitle}
</div>
```

(Se elimina el ternario inline `title.length > 60 ? "56px" : "68px"` — queda absorbido en `titleFontSize`.)

- [ ] **Step 2: Verificar**

Run: `npm run dev` y abrir `http://localhost:3000/es/blog/construir-software-seguro-con-llms-el-frontier-de-agosto-2026/opengraph-image` (título de 58 chars → 68px) y el post con el título más largo (`rg -n '^title:' content/posts/es | awk -F'"' '{print length($2), $1}' | sort -rn | head -3`).
Expected: sin overflow; título ≤3 líneas dentro del lienzo.

- [ ] **Step 3: Commit**

```bash
git add lib/og-template.tsx
git commit -m "fix(og): clamp and scale very long titles"
```

---

### Task 7: Carry-over — `--text-muted` AA en tema claro

**Files:**
- Modify: `app/globals.css:54`

**Interfaces:**
- Consumes/Produces: nada — cambio de valor de token.

- [ ] **Step 1: Subir contraste del token claro**

En `app/globals.css` línea 54, dentro del bloque de tema claro:

```css
--text-muted: #6e6e6e;
```

(`#8f8f8f` sobre blanco = 3.5:1, falla AA para texto normal; `#6e6e6e` = 5.3:1, pasa. El valor oscuro `#7d7d7d` de la línea 104 no se toca: sobre `#0c0c0d` ya pasa.)

- [ ] **Step 2: Verificar**

Revisión visual en dev de home + post en tema claro: fechas, reading time y meta siguen leyéndose como secundarios pero legibles.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "fix(theme): raise light --text-muted to AA contrast"
```

---

### Task 8: Carry-over — hydration hazard en ReaderMode

**Files:**
- Modify: `components/blog/ReaderMode.tsx:15-23`

**Interfaces:**
- Consumes/Produces: nada — corrección interna.

- [ ] **Step 1: Mover la lectura de localStorage a un efecto**

Reemplazar líneas 15-23:

```tsx
const [active, setActive] = useState(false);
const isSpanish = lang === "es";

// Read persisted preference after mount — the initializer ran on the
// server with `false`, so reading localStorage there would desync
// server and client HTML (hydration mismatch).
useEffect(() => {
    setActive(localStorage.getItem("reader-mode") === "true");
}, []);

useEffect(() => {
    document.body.classList.toggle("reader-mode", active);
}, [active]);
```

(El resto del componente no cambia; `isSpanish` se mantiene donde estaba si el orden de declaraciones lo requiere.)

- [ ] **Step 2: Verificar**

En dev con la consola abierta: activar reader mode, recargar el post.
Expected: la preferencia persiste y NO hay warning de hydration mismatch en consola.

- [ ] **Step 3: Commit**

```bash
git add components/blog/ReaderMode.tsx
git commit -m "fix(reader): read localStorage after mount to avoid hydration mismatch"
```

---

### Task 9: Verificación final + PR

**Files:** ninguno nuevo.

- [ ] **Step 1: Suite completa**

```bash
npm run lint && npm run type-check && npm run seo:audit && npm run build && npm run test:e2e
```

Expected: todo verde (seo:audit puede avisar del post sin ogImage estática — es informativo, la OG es dinámica).

- [ ] **Step 2: Lighthouse (criterio del spec: ≥95 perf/SEO en home y un post)**

```bash
npm run build && npm run start &
npx --yes lighthouse http://localhost:3000/es --only-categories=performance,seo --preset=desktop --quiet --chrome-flags="--headless" | grep -A2 "Performance\|SEO"
npx --yes lighthouse http://localhost:3000/es/blog/construir-software-seguro-con-llms-el-frontier-de-agosto-2026 --only-categories=performance,seo --preset=desktop --quiet --chrome-flags="--headless" | grep -A2 "Performance\|SEO"
kill %1
```

Expected: ≥95 en ambas categorías, ambas páginas. Si performance cae por las OG en cards: revisar `sizes` y que solo las 3 primeras cards usan `priority`.

- [ ] **Step 3: Revisión visual light/dark**

Home, listado y un post en ambos temas (toggle del header). Checklist: sin glass, kickers azules, naranja solo en señales, terminales y CodeComparison oscuros en ambos temas.

- [ ] **Step 4: Push y PR**

```bash
git push -u origin HEAD
gh pr create --base develop --title "feat(presentation): Fase 2 — whoami hero, OG cards, pillar kicker" --fill
```

---

## Self-Review (hecho al escribir el plan)

1. **Cobertura del spec Fase 2:** home hero+destacado+grid+newsletter ✔ (Task 3), stats hardcodeadas fuera ✔ (Task 3), PostCard con OG ✔ (Task 2), PostHeader kicker ✔ (Task 4), ShareButton solo al final ✔ (Task 4), Lighthouse ≥95 ✔ (Task 9). Carry-overs de Fase 1: CodeComparison ✔ (5), OG clamp ✔ (6), text-muted AA ✔ (7), ReaderMode hydration ✔ (8). "Sin repetir cover dentro del post": el cover no se renderiza en el body hoy — nada que quitar.
2. **Placeholders:** ninguno; todo paso con código lo incluye completo.
3. **Consistencia de tipos:** `getHeroPost` (Task 1) se consume con ese nombre en Task 3; `priority` (Task 2) se usa en Task 3; `PILLARS[id].name[locale]`/`routeSlug[locale]` coinciden con `lib/pillars.ts` real.
