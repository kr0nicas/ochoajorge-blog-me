# Fase 1.5 — Secciones por dolor ("Temas") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Taxonomía canónica de 4 secciones orientadas a problemas del lector, con campo `pillar` en frontmatter, landings `/temas`–`/topics`, nav y OG integrados.

**Architecture:** El set canónico vive en `lib/pillars.ts` (IDs, hue, slugs de ruta por idioma, nombres, intros); `lib/posts.ts` parsea y valida `pillar`; dos componentes server compartidos (`PillarsIndex`, `PillarLanding`) renderizan las 4 rutas delgadas (`temas` para es, `topics` para en, con redirect cruzado). Los OG toman kicker y hue del pilar cuando existe, con fallback al comportamiento actual (primer tag + hash).

**Tech Stack:** Next.js 16 App Router, TypeScript estricto, gray-matter (frontmatter), next/og.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-08-fase1-5-secciones-design.md` (tabla de asignación de posts = fuente de verdad aprobada).
- IDs canónicos EXACTOS: `construir-con-ia`, `agentes-en-produccion`, `arquitectura`, `seguridad`. El ID es el valor de `pillar` en AMBOS idiomas.
- Hues fijos: `construir-con-ia` naranja, `agentes-en-produccion` azul, `arquitectura` azul, `seguridad` naranja.
- Rutas: ES `/es/temas[/slug-es]`; EN `/en/topics[/slug-en]`. `/en/temas/*` y `/es/topics/*` NO deben responder 200 (redirect a la ruta canónica del idioma).
- No se elimina ni cambia ninguna URL, tag ni serie existente. No se toca la home ni PostHeader (Fase 2).
- TypeScript estricto, sin `any`, cero dependencias nuevas. Conventional Commits.
- Commit de contenido (`content(posts): ...`) SEPARADO de los commits de código.
- Verificación por tarea: `npm run type-check` y `npm run build`; suite completa al final.

---

### Task 1: Módulo canónico de pilares + parsing

**Files:**
- Create: `lib/pillars.ts`
- Modify: `lib/types.ts` (interface `Post`, añadir campo)
- Modify: `lib/posts.ts` (parseo en `getPostBySlug`, nueva función `getPostsByPillar`)

**Interfaces:**
- Produces: `PILLAR_IDS: readonly PillarId[]`; `type PillarId`; `interface PillarDef { id, hue, routeSlug: {es,en}, name: {es,en}, intro: {es,en} }`; `PILLARS: Record<PillarId, PillarDef>`; `isPillarId(v: unknown): v is PillarId`; `pillarByRouteSlug(slug: string, lang: "es"|"en"): PillarDef | null`; `Post.pillar?: PillarId`; `getPostsByPillar(pillarId: PillarId, locale?: string): Post[]`.

- [ ] **Step 1: Crear `lib/pillars.ts`**

```ts
/**
 * Canonical pillar (section) taxonomy — single source of truth.
 * Consumed by: posts parsing, /temas & /topics routes, sitemap, OG images.
 * The Spanish slug is the ID stored in frontmatter for BOTH locales.
 * Keep scripts/seo-audit.mjs PILLAR_IDS in sync when editing.
 */

export const PILLAR_IDS = [
    "construir-con-ia",
    "agentes-en-produccion",
    "arquitectura",
    "seguridad",
] as const;

export type PillarId = (typeof PILLAR_IDS)[number];

export interface PillarDef {
    id: PillarId;
    /** OG glow color, fixed per section */
    hue: "blue" | "orange";
    routeSlug: { es: string; en: string };
    name: { es: string; en: string };
    intro: { es: string; en: string };
}

export const PILLARS: Record<PillarId, PillarDef> = {
    "construir-con-ia": {
        id: "construir-con-ia",
        hue: "orange",
        routeSlug: { es: "construir-con-ia", en: "building-with-ai" },
        name: {
            es: "Construir con IA sin perder el control",
            en: "Building with AI without losing control",
        },
        intro: {
            es: "Usas Claude Code o Cursor a diario y sientes que el código se te va de las manos. Aquí: disciplina agentic, deuda técnica y cómo domar la caja negra.",
            en: "You use Claude Code or Cursor daily and feel the code slipping away from you. Here: agentic discipline, tech debt, and taming the black box.",
        },
    },
    "agentes-en-produccion": {
        id: "agentes-en-produccion",
        hue: "blue",
        routeSlug: { es: "agentes-en-produccion", en: "agents-in-production" },
        name: {
            es: "Agentes en producción",
            en: "Agents in production",
        },
        intro: {
            es: "El demo funcionó. Ahora hay que operarlo: orquestación multi-agente, MCP, RAG, observabilidad y Kubernetes.",
            en: "The demo worked. Now you have to run it: multi-agent orchestration, MCP, RAG, observability, and Kubernetes.",
        },
    },
    arquitectura: {
        id: "arquitectura",
        hue: "blue",
        routeSlug: { es: "arquitectura", en: "architecture" },
        name: {
            es: "Arquitectura que aguanta",
            en: "Architecture that lasts",
        },
        intro: {
            es: "Adoptar IA sin romper lo que ya funciona: hexagonal, SOLID, clean architecture e integración enterprise.",
            en: "Adopting AI without breaking what already works: hexagonal, SOLID, clean architecture, and enterprise integration.",
        },
    },
    seguridad: {
        id: "seguridad",
        hue: "orange",
        routeSlug: { es: "seguridad", en: "security" },
        name: {
            es: "Seguridad y gobernanza",
            en: "Security & governance",
        },
    intro: {
            es: "¿Quién vigila al agente? Defensas en capas, hardening y gobernanza a escala.",
            en: "Who watches the agent? Layered defenses, hardening, and governance at scale.",
        },
    },
};

export function isPillarId(value: unknown): value is PillarId {
    return typeof value === "string" && (PILLAR_IDS as readonly string[]).includes(value);
}

export function pillarByRouteSlug(slug: string, lang: "es" | "en"): PillarDef | null {
    return Object.values(PILLARS).find((p) => p.routeSlug[lang] === slug) ?? null;
}
```

- [ ] **Step 2: Añadir `pillar` al tipo `Post` en `lib/types.ts`**

Añadir el import al inicio del archivo y el campo tras `tags: string[];`:

```ts
import type { PillarId } from "./pillars";
```

```ts
    /** Canonical section (see lib/pillars.ts); absent = unassigned */
    pillar?: PillarId;
```

- [ ] **Step 3: Parsear en `lib/posts.ts`**

Import: `import { isPillarId, type PillarId } from "./pillars";`

En el objeto retornado por `getPostBySlug` (tras la línea `tags: ...`):

```ts
        pillar: isPillarId(data.pillar) ? data.pillar : undefined,
```

Al final del archivo:

```ts
/**
 * Get posts belonging to a canonical pillar (section) for a locale.
 */
export function getPostsByPillar(pillarId: PillarId, locale: string = "es"): Post[] {
    return getAllPosts(locale).filter((post) => post.pillar === pillarId);
}
```

- [ ] **Step 4: Verificar**

Run: `npm run type-check && npm run build`
Expected: exit 0 ambos.

- [ ] **Step 5: Commit**

```bash
git add lib/pillars.ts lib/types.ts lib/posts.ts
git commit -m "feat(pillars): canonical section taxonomy with frontmatter parsing"
```

---

### Task 2: Contenido — `pillar` en los 42 posts + validación en tooling

**Files:**
- Modify: los 35 `.mdx` de `content/posts/es/` y 7 de `content/posts/en/` (solo frontmatter)
- Modify: `scripts/seo-audit.mjs` (validación)
- Modify: `scripts/new-post.mjs` (scaffold)

**Interfaces:**
- Consumes: IDs canónicos de Task 1 (los scripts .mjs los duplican como constante con comentario de sync — no pueden importar TS).
- Produces: todos los posts con `pillar` canónico; `seo:audit` con 0 warnings.

- [ ] **Step 1: Añadir `pillar:` a cada post (tabla de asignación del spec)**

Insertar la línea `pillar: "<id>"` inmediatamente después de la línea `date:` de cada archivo (la línea `date:` es siempre única y de una línea). Loop de referencia (ejecutar desde la raíz del worktree; verificar después con el Step 2):

```bash
add_pillar() { f="content/posts/$1"; id="$2"; \
  grep -q '^pillar:' "$f" || sed -i '' "/^date:/a\\
pillar: \"$id\"
" "$f"; }

# ES — construir-con-ia (13)
for f in agentic-saas-b2b-disciplina-de-desarrollo-con-claude-code ai-native-seo-preparando-tu-blog-para-la-era-de-los-agentes building-open-automatable-workspace-2026 claude-opus-48-el-puente-hacia-mythos-y-el-futuro-del-agentic-coding construyendo-con-ia-parte-1-caja-negra-black-box-problem construyendo-con-ia-parte-2-el-orden-que-me-salvo construyendo-con-ia-parte-3-cuando-el-agente-rompe-todo construyendo-ochoajorge-me-nextjs-agentes-ia cursor-copilot-claude-code-evaluacion-2026 deuda-tecnica-en-la-era-de-la-ia-mitos-y-realidades dotfiles-el-secreto-para-ser-productivo-en-tu-entorno-de-desarrollo ingenieria-software-era-ia-mas-alla-vibe-coding vibe-coding-en-produccion-realidad; do add_pillar "es/$f.mdx" construir-con-ia; done

# ES — agentes-en-produccion (11)
for f in agentes-ia-en-kubernetes-deploy-y-escalado agentes-ia-en-produccin-el-patrn-orchestrator-worker-de-rippling go-para-backend-de-agentes-por-que-y-cuando innova-ia-produccion-monitorabilidad-observabilidad-sistemas-multi-agente mcp-como-contrato-entre-agentes mcp-como-contrato-protocolo-agentes mcp-en-produccin-patrones-de-integracin-real observabilidad-sistemas-ia-trazas-opentelemetry orchestrator-worker-multi-agente-produccion plataforma-ia-rag-go-pgvector-arquitectura rag-con-pgvector-arquitectura-a-escala; do add_pillar "es/$f.mdx" agentes-en-produccion; done

# ES — arquitectura (6)
for f in arquitectura-hexagonal-agentes-ia-patrones-mcp building-multitenant-erp-clean-architecture hexagonal-architecture-python-fastapi innova-ia-integrar-agentes-arquitecturas-enterprise-sin-romper-stack patron-repository-en-python-con-fastapi-guia-completa solid-en-microservicios-cuando-aplicar-y-cuando-es-excesivo; do add_pillar "es/$f.mdx" arquitectura; done

# ES — seguridad (5)
for f in governance-a-escala-kpmg-despliega-276000-agentes-ia-con-microsoft-agent-365 guia-openclaw-2026-controles-seguridad hacking-blanco-arquitectura-software-defensas-capas-cloud-first los-4-hackers-ms-influyentes-su-legado-en-2026 yahoo-seller-agent-graph-technologies-para-decisin-autnoma-con-gobernanza; do add_pillar "es/$f.mdx" seguridad; done

# EN — construir-con-ia (6)
for f in building-ochoajorge-me-nextjs-ai-agents building-open-automatable-workspace-2026 building-with-ai-lo-que-nadie-te-dice-part-1-black-box-problem building-with-ai-lo-que-nadie-te-dice-part-2-governance-order building-with-ai-lo-que-nadie-te-dice-part-3-incident vibe-coding-production-reality; do add_pillar "en/$f.mdx" construir-con-ia; done

# EN — seguridad (1)
add_pillar "en/openclaw-2026-security-controls-guide.mdx" seguridad
```

Verificar cobertura y valores:

```bash
rg -c '^pillar:' content/posts/es content/posts/en | wc -l   # debe dar 42
rg -h '^pillar:' content/posts | sort | uniq -c              # solo los 4 IDs canónicos
```

- [ ] **Step 2: Validación en `scripts/seo-audit.mjs`**

Añadir cerca del inicio del archivo (junto a otras constantes):

```js
// Keep in sync with lib/pillars.ts (scripts cannot import TS modules)
const PILLAR_IDS = ["construir-con-ia", "agentes-en-produccion", "arquitectura", "seguridad"];
```

Dentro del loop de posts, después del bloque que valida `description` (líneas ~64-70) y usando el MISMO contador/patrón de warnings que usa ese bloque:

```js
        if (!PILLAR_IDS.includes(data.pillar)) {
            console.warn(
                `Warning: ${locale}/${file} missing or non-canonical "pillar" (got: ${data.pillar ?? "none"}).`
            );
            warnings += 1; // ajustar al nombre real del contador del script
        }
```

Nota: leer el script antes de editar; si el contador se llama distinto (p. ej. `warningCount`), usar ese. La validación corre solo para posts publicados (el script ya hace `if (data.draft) continue;` — los drafts CON pillar del Step 1 no molestan).

- [ ] **Step 3: Scaffold en `scripts/new-post.mjs`**

En el template del frontmatter (línea ~63), añadir después de la línea de `tags`:

```js
pillar: "construir-con-ia" # one of: construir-con-ia | agentes-en-produccion | arquitectura | seguridad
```

(Dentro del template literal existente, respetando su interpolación.)

- [ ] **Step 4: Verificar**

Run: `npm run seo:audit`
Expected: `SEO audit passed: 40 post(s) checked, 0 warning(s).`

Run: `npm run type-check && npm run build`
Expected: exit 0.

- [ ] **Step 5: Commits (contenido separado del código)**

```bash
git add content/posts
git commit -m "content(posts): assign canonical pillar to all posts"
git add scripts/seo-audit.mjs scripts/new-post.mjs
git commit -m "feat(tooling): validate and scaffold pillar frontmatter"
```

---

### Task 3: Rutas /temas y /topics + nav + sitemap

**Files:**
- Create: `components/pillars/PillarsIndex.tsx`
- Create: `components/pillars/PillarLanding.tsx`
- Create: `app/[lang]/temas/page.tsx`
- Create: `app/[lang]/temas/[slug]/page.tsx`
- Create: `app/[lang]/topics/page.tsx`
- Create: `app/[lang]/topics/[slug]/page.tsx`
- Modify: `lib/dictionary.ts` (nav.topics en es y en)
- Modify: `components/layout/Header.tsx:23-27` (navLinks)
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `PILLARS`, `PILLAR_IDS`, `pillarByRouteSlug` (Task 1); `getPostsByPillar`, `getAllPosts` de `lib/posts.ts`; `PostCard` existente.
- Produces: rutas públicas `/es/temas`, `/es/temas/{slug-es}`, `/en/topics`, `/en/topics/{slug-en}`; `/en/temas*` → redirect a `/en/topics*`; `/es/topics*` → redirect a `/es/temas*`.

- [ ] **Step 1: `components/pillars/PillarsIndex.tsx`**

```tsx
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
```

- [ ] **Step 2: `components/pillars/PillarLanding.tsx`**

```tsx
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
```

- [ ] **Step 3: Rutas ES — `app/[lang]/temas/page.tsx` y `app/[lang]/temas/[slug]/page.tsx`**

`app/[lang]/temas/page.tsx`:

```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PillarsIndex } from "@/components/pillars/PillarsIndex";

interface Props {
    params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
    title: "Temas",
    description:
        "Cuatro secciones orientadas a problemas reales: construir con IA, agentes en producción, arquitectura y seguridad.",
};

export default async function TemasPage({ params }: Props) {
    const { lang } = await params;
    if (lang !== "es") redirect("/en/topics");
    return <PillarsIndex lang="es" />;
}
```

`app/[lang]/temas/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PILLAR_IDS, PILLARS, pillarByRouteSlug } from "@/lib/pillars";
import { PillarLanding } from "@/components/pillars/PillarLanding";

interface Props {
    params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
    return PILLAR_IDS.map((id) => ({ slug: PILLARS[id].routeSlug.es }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const pillar = pillarByRouteSlug(slug, "es");
    if (!pillar) return {};
    return { title: pillar.name.es, description: pillar.intro.es };
}

export default async function TemaPage({ params }: Props) {
    const { lang, slug } = await params;
    const pillar = pillarByRouteSlug(slug, "es");
    if (!pillar) notFound();
    if (lang !== "es") redirect(`/en/topics/${pillar.routeSlug.en}`);
    return <PillarLanding lang="es" pillar={pillar} />;
}
```

- [ ] **Step 4: Rutas EN — `app/[lang]/topics/page.tsx` y `app/[lang]/topics/[slug]/page.tsx`**

`app/[lang]/topics/page.tsx`:

```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PillarsIndex } from "@/components/pillars/PillarsIndex";

interface Props {
    params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
    title: "Topics",
    description:
        "Four problem-oriented sections: building with AI, agents in production, architecture, and security.",
};

export default async function TopicsPage({ params }: Props) {
    const { lang } = await params;
    if (lang !== "en") redirect("/es/temas");
    return <PillarsIndex lang="en" />;
}
```

`app/[lang]/topics/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PILLAR_IDS, PILLARS, pillarByRouteSlug } from "@/lib/pillars";
import { PillarLanding } from "@/components/pillars/PillarLanding";

interface Props {
    params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
    return PILLAR_IDS.map((id) => ({ slug: PILLARS[id].routeSlug.en }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const pillar = pillarByRouteSlug(slug, "en");
    if (!pillar) return {};
    return { title: pillar.name.en, description: pillar.intro.en };
}

export default async function TopicPage({ params }: Props) {
    const { lang, slug } = await params;
    const pillar = pillarByRouteSlug(slug, "en");
    if (!pillar) notFound();
    if (lang !== "en") redirect(`/es/temas/${pillar.routeSlug.es}`);
    return <PillarLanding lang="en" pillar={pillar} />;
}
```

- [ ] **Step 5: Diccionario y Header**

`lib/dictionary.ts` — añadir en `es.nav`: `topics: "Temas",` y en `en.nav`: `topics: "Topics",` (mismo lugar que `blog:`).

`components/layout/Header.tsx:23-27` — el array queda:

```tsx
    const navLinks = [
        { href: `/${lang}/${lang === "es" ? "temas" : "topics"}`, label: dict.nav.topics },
        { href: `/${lang}/blog`, label: dict.nav.blog },
        { href: `/${lang}/projects`, label: dict.nav.projects },
        { href: `/${lang}/uses`, label: dict.nav.uses },
        { href: `/${lang}/about`, label: dict.nav.about },
    ];
```

- [ ] **Step 6: Sitemap — `app/sitemap.ts`**

Import: `import { PILLARS } from "@/lib/pillars";`

Antes del `return`, añadir:

```ts
    // ── Pillar (section) pages ────────────────────────────────────
    const pillarRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((lang) => {
        const base = lang === "es" ? "temas" : "topics";
        return [
            {
                url: `${BASE_URL}/${lang}/${base}`,
                lastModified: now,
                changeFrequency: "weekly" as const,
                priority: 0.8,
            },
            ...Object.values(PILLARS).map((pillar) => ({
                url: `${BASE_URL}/${lang}/${base}/${pillar.routeSlug[lang]}`,
                lastModified: now,
                changeFrequency: "weekly" as const,
                priority: 0.75,
            })),
        ];
    });
```

Y cambiar el return a:

```ts
    return [...staticRoutes, ...postRoutes, ...tagRoutes, ...seriesRoutes, ...pillarRoutes];
```

- [ ] **Step 7: Verificar**

Run: `npm run type-check && npm run build`
Expected: exit 0; el build lista las rutas `/[lang]/temas`, `/[lang]/temas/[slug]`, `/[lang]/topics`, `/[lang]/topics/[slug]`.

Con `npm run dev` en background (matar al terminar):

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/es/temas                        # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/es/temas/agentes-en-produccion  # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/topics/agents-in-production  # 200
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/en/temas        # 307/308 → /en/topics
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/es/topics       # 307/308 → /es/temas
curl -s http://localhost:3000/es/temas | grep -c "card"                                        # ≥4
```

- [ ] **Step 8: Commit**

```bash
git add components/pillars app/\[lang\]/temas app/\[lang\]/topics lib/dictionary.ts components/layout/Header.tsx app/sitemap.ts
git commit -m "feat(pillars): section landings, topics routes, nav and sitemap"
```

---

### Task 4: OG por pilar

**Files:**
- Modify: `lib/og-template.tsx` (opción `hue`)
- Modify: `app/[lang]/blog/[slug]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `PILLARS`, `Post.pillar` (Task 1).
- Produces: `renderOgImage` acepta `hue?: "blue" | "orange"`; sin `hue` mantiene el hash actual (fallback para posts sin pillar y para el OG raíz).

- [ ] **Step 1: `lib/og-template.tsx` — parámetro `hue` opcional**

En la interface `OgOptions` añadir:

```ts
    /** Fixed glow hue; falls back to a deterministic hash of `pillar` */
    hue?: "blue" | "orange";
```

En `renderOgImage`, cambiar la línea `const hue = pillarHue(pillar);` por:

```ts
    const hue = options.hue ?? pillarHue(pillar);
```

(ajustando la destructuración existente: `export async function renderOgImage(options: OgOptions)` y usar `options.title`, `options.pillar`, `options.readingTime` o mantener la destructuración añadiendo `hue: hueOverride` — el implementador elige la forma más limpia manteniendo el resto igual).

- [ ] **Step 2: `app/[lang]/blog/[slug]/opengraph-image.tsx` — usar el pilar del post**

El cuerpo del componente queda:

```tsx
import { getPostBySlug } from "@/lib/posts";
import { PILLARS } from "@/lib/pillars";
import { renderOgImage, OG_SIZE } from "@/lib/og-template";

// No edge runtime — getPostBySlug and font loading use fs (Node.js)
export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = "image/png";

interface Props {
    params: Promise<{ slug: string; lang: string }>;
}

/** Dynamic OG image for blog posts — kicker and glow hue come from the post's pillar. */
export default async function Image({ params }: Props) {
    const { slug, lang } = await params;
    const post = getPostBySlug(slug, lang);
    const pillarDef = post?.pillar ? PILLARS[post.pillar] : null;

    return renderOgImage({
        title: post?.title ?? "Blog Post",
        pillar: pillarDef?.id ?? post?.tags?.[0] ?? "blog",
        hue: pillarDef?.hue,
        readingTime: post?.readingTime,
    });
}
```

(El OG raíz `app/opengraph-image.tsx` no se toca: sigue con `pillar: "blog"` y hash.)

- [ ] **Step 3: Verificar**

Run: `npm run type-check && npm run build` → exit 0.

Con dev server en background: descargar el OG de un post de cada sección y verificar con la tool Read el kicker `// {id}` y el hue correcto:

```bash
curl -s -o /tmp/og-cci.png http://localhost:3000/es/blog/deuda-tecnica-en-la-era-de-la-ia-mitos-y-realidades/opengraph-image   # // construir-con-ia, glow NARANJA
curl -s -o /tmp/og-aep.png http://localhost:3000/es/blog/orchestrator-worker-multi-agente-produccion/opengraph-image           # // agentes-en-produccion, glow AZUL
curl -s -o /tmp/og-arq.png http://localhost:3000/es/blog/solid-en-microservicios-cuando-aplicar-y-cuando-es-excesivo/opengraph-image  # // arquitectura, glow AZUL
curl -s -o /tmp/og-seg.png http://localhost:3000/es/blog/hacking-blanco-arquitectura-software-defensas-capas-cloud-first/opengraph-image  # // seguridad, glow NARANJA
```

- [ ] **Step 4: Commit**

```bash
git add lib/og-template.tsx "app/[lang]/blog/[slug]/opengraph-image.tsx"
git commit -m "feat(og): pillar-driven kicker and fixed glow hue per section"
```

---

### Task 5: Verificación final de la fase

- [ ] **Step 1: Suite completa**

```bash
npm run lint && npm run type-check && npm run seo:audit && npm run build && npm run test:e2e
```
Expected: todo exit 0; seo:audit `0 warning(s)`.

- [ ] **Step 2: Revisión visual en Chrome (claro y oscuro)**

`/es/temas`, `/es/temas/construir-con-ia`, `/en/topics`, `/en/topics/security` — kickers mono, cards correctas, sección EN vacía muestra el "coming soon" con enlace a ES.

- [ ] **Step 3: PR**

```bash
git push -u origin HEAD
gh pr create --base develop --title "feat(pillars): Fase 1.5 — secciones por dolor" --body "..."
```
PR contra `develop`, nunca `main`.

---

## Self-Review (hecho al escribir el plan)

- Spec cubierto: taxonomía+modelo (T1), contenido+tooling (T2), rutas+nav+sitemap (T3), OG (T4), verificación (T5). `/en/temas` y `/es/topics` cubiertos por redirects cruzados en las páginas.
- Conteos: ES 13+11+6+5 = 35 ✓; EN 6+1 = 7 ✓; los 2 drafts llevan pillar pero seo:audit no los cuenta (skip por draft) → 40 publicados auditados.
- Tipos consistentes: `PillarId`, `PillarDef`, `pillarByRouteSlug(slug, lang)`, `getPostsByPillar(pillarId, locale)` usados igual en T1/T3/T4.
- El sed de macOS (BSD) usa `sed -i '' "/^date:/a\...` con newline literal — sintaxis BSD correcta; el implementador verifica el resultado con los rg del final del Step 1.
