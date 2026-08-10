# Fase 3 — Interacción Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Activar la interacción real con lectores: reacciones ★ con Upstash Redis, newsletter Resend sin demo mode (compact al final del post y en el Footer), Giscus con carga diferida por IntersectionObserver y categoría propia, y compartir con `navigator.share` + fallbacks.

**Architecture:** Route handler `GET/POST /api/reactions/[slug]` contra Upstash Redis (`INCR reactions:{lang}:{slug}`), rate limit por IP con `@upstash/ratelimit` y dedupe optimista por localStorage en el cliente. En listados los counts se leen server-side en un solo `MGET` batch (`lib/reactions.ts`, `unstable_cache` 60s) y viajan a las cards como props; las páginas de listado pasan a ISR con `export const revalidate = 60`. Todo degrada con gracia sin config: el endpoint devuelve 503, `ReactionButton` se oculta, los counts vuelven `{}`, y el newsletter muestra error visible (no éxito falso).

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind v4, `@upstash/redis` + `@upstash/ratelimit` (únicas dependencias nuevas, exigidas por la spec), Resend (ya instalada), `@giscus/react` (ya instalada).

## Global Constraints

- Rama de trabajo: `fase3-interaccion` creada desde `origin/develop` (ya existe; worktree en `.claude/worktrees/fase3-interaccion`). PR con base `develop` (ver `AGENTS.md`). NUNCA push a `main` ni `develop`.
- Commits convencionales `tipo(ámbito): asunto`, en inglés, con `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Identificadores de código en inglés; copy visible bilingüe ES/EN vía `lang === "es"`.
- Dependencias nuevas permitidas SOLO: `@upstash/redis`, `@upstash/ratelimit`.
- Degradación con gracia obligatoria: sin `UPSTASH_REDIS_REST_URL/TOKEN` las reacciones se ocultan sin romper el post; sin `RESEND_API_KEY`/`RESEND_AUDIENCE_ID` el formulario muestra error visible.
- Tokens existentes solamente (`--bg-base`, `--bg-surface`, `--bg-elevated`, `--text-primary`, `--text-secondary`, `--text-muted`, `--brand`, `--brand-light`, `--accent`, `--border`, `--border-strong`, `--border-brand`). Naranja (`--accent`) SOLO para señales pequeñas: la ★ de reacciones.
- `font-mono` para meta (fecha · min · ★), `font-display` para titulares.
- Performance: NO envolver el elemento LCP en `AnimatedSection` ni animarlo desde `opacity: 0`. Lighthouse de Fase 2 dejó home y post en 100/100 — sin regresión.
- `.env.local` del worktree ya tiene las credenciales reales de Upstash y Resend (copiado del checkout principal; está gitignored — no commitearlo jamás).
- Verificación global al final: `npm run lint && npm run type-check && npm run seo:audit && npm run build && npm run test:e2e`.

---

### Task 0: Plan commit

**Files:**
- Create: `docs/superpowers/plans/2026-08-09-fase3-interaccion.md` (este archivo)

- [ ] **Step 1: Commit del plan**

```bash
git add docs/superpowers/plans/2026-08-09-fase3-interaccion.md
git commit -m "docs(plans): fase 3 interaccion implementation plan"
```

---

### Task 1: Cliente Redis + API de reacciones

**Files:**
- Create: `lib/redis.ts`
- Create: `app/api/reactions/[slug]/route.ts`
- Modify: `scripts/e2e-check.mjs` (añadir checks del endpoint)
- Modify: `.env.example` (las vars de Fase 3 ya son requeridas)
- Modify: `package.json` / `package-lock.json` (deps nuevas)

**Interfaces:**
- Produces: `getRedis(): Redis | null` y `reactionKey(lang: string, slug: string): string` en `lib/redis.ts` (los consume Task 3). Endpoint `GET /api/reactions/{slug}?lang={es|en}` → `200 {"count": number}` | `503 {"error": "reactions_disabled"}` | `400`; `POST` igual + `429 {"error": "rate_limited"}` (lo consume el `ReactionButton` de Task 2).

- [ ] **Step 1: Instalar dependencias**

```bash
npm install @upstash/redis @upstash/ratelimit
```

- [ ] **Step 2: Escribir los checks e2e del endpoint (test primero)**

En `scripts/e2e-check.mjs`, dentro de `runChecks()`, después del bucle `for (const route of routes)`, añadir:

```js
  // Reactions API — 200 with numeric count when Upstash is configured, 503 otherwise
  const reactionsRes = await fetch(`${BASE_URL}/api/reactions/${firstSlug}?lang=es`);
  if (reactionsRes.status === 200) {
    const { count } = await reactionsRes.json();
    if (typeof count !== "number") {
      throw new Error("Reactions GET returned a non-numeric count");
    }
  } else if (reactionsRes.status !== 503) {
    throw new Error(
      `Reactions GET responded ${reactionsRes.status} (expected 200 or 503)`
    );
  }

  // Invalid lang must be rejected
  const badLangRes = await fetch(`${BASE_URL}/api/reactions/${firstSlug}?lang=xx`);
  if (badLangRes.status !== 400) {
    throw new Error(
      `Reactions GET with invalid lang responded ${badLangRes.status} (expected 400)`
    );
  }

  // Unknown slug must be rejected
  const badSlugRes = await fetch(`${BASE_URL}/api/reactions/not-a-real-post?lang=es`);
  if (badSlugRes.status !== 404) {
    throw new Error(
      `Reactions GET with unknown slug responded ${badSlugRes.status} (expected 404)`
    );
  }
```

- [ ] **Step 3: Verificar que falla**

Run: `npm run test:e2e`
Expected: FAIL — `Reactions GET responded 404 (expected 200 or 503)` (la ruta no existe aún).

- [ ] **Step 4: Crear `lib/redis.ts`**

```ts
import { Redis } from "@upstash/redis";

let cached: Redis | null | undefined;

/**
 * Upstash Redis client, or null when the env vars are missing.
 * Callers must treat null as "reactions disabled" and degrade gracefully.
 */
export function getRedis(): Redis | null {
    if (cached !== undefined) return cached;
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    cached = url && token ? new Redis({ url, token }) : null;
    return cached;
}

export function reactionKey(lang: string, slug: string): string {
    return `reactions:${lang}:${slug}`;
}
```

- [ ] **Step 5: Crear `app/api/reactions/[slug]/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import type { Redis } from "@upstash/redis";
import { getRedis, reactionKey } from "@/lib/redis";
import { getPostSlugs } from "@/lib/posts";

const SUPPORTED_LANGS = new Set(["es", "en"]);

let ratelimit: Ratelimit | null = null;

function getRatelimit(redis: Redis): Ratelimit {
    ratelimit ??= new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "60 s"),
        prefix: "ratelimit:reactions",
    });
    return ratelimit;
}

type Validation =
    | { ok: true; lang: string }
    | { ok: false; response: NextResponse };

function validate(request: NextRequest, slug: string): Validation {
    const lang = request.nextUrl.searchParams.get("lang") ?? "es";
    if (!SUPPORTED_LANGS.has(lang)) {
        return {
            ok: false,
            response: NextResponse.json({ error: "invalid_lang" }, { status: 400 }),
        };
    }
    if (!getPostSlugs(lang).includes(slug)) {
        return {
            ok: false,
            response: NextResponse.json({ error: "unknown_post" }, { status: 404 }),
        };
    }
    return { ok: true, lang };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const validation = validate(request, slug);
    if (!validation.ok) return validation.response;

    const redis = getRedis();
    if (!redis) {
        return NextResponse.json({ error: "reactions_disabled" }, { status: 503 });
    }

    try {
        const count = await redis.get<number>(reactionKey(validation.lang, slug));
        return NextResponse.json({ count: Number(count ?? 0) });
    } catch {
        return NextResponse.json({ error: "reactions_unavailable" }, { status: 503 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const validation = validate(request, slug);
    if (!validation.ok) return validation.response;

    const redis = getRedis();
    if (!redis) {
        return NextResponse.json({ error: "reactions_disabled" }, { status: 503 });
    }

    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

    try {
        const { success } = await getRatelimit(redis).limit(ip);
        if (!success) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429 });
        }
        const count = await redis.incr(reactionKey(validation.lang, slug));
        return NextResponse.json({ count });
    } catch {
        return NextResponse.json({ error: "reactions_unavailable" }, { status: 503 });
    }
}
```

- [ ] **Step 6: Actualizar `.env.example`**

Cambiar la línea `# Fase 3 (aún no requeridas)` por:

```
# Fase 3 — reacciones (Upstash) y newsletter (Resend). Sin ellas el sitio degrada con gracia.
```

- [ ] **Step 7: Verificar que los checks pasan**

Run: `npm run test:e2e`
Expected: `End-to-end checks passed.`

- [ ] **Step 8: Verificar persistencia e incremento con curl (dev server)**

```bash
npm run dev -- --port 4179 &
sleep 8
SLUG=$(ls content/posts/es | head -1 | sed 's/\.mdx$//')
curl -s "http://127.0.0.1:4179/api/reactions/$SLUG?lang=es"          # {"count":N}
curl -s -X POST "http://127.0.0.1:4179/api/reactions/$SLUG?lang=es"  # {"count":N+1}
curl -s "http://127.0.0.1:4179/api/reactions/$SLUG?lang=es"          # {"count":N+1} — persiste
kill %1
```

Expected: el POST incrementa y el GET posterior devuelve el valor incrementado.

- [ ] **Step 9: Lint + type-check + commit**

```bash
npm run lint && npm run type-check
git add lib/redis.ts 'app/api/reactions/[slug]/route.ts' scripts/e2e-check.mjs .env.example package.json package-lock.json
git commit -m "feat(reactions): add Upstash-backed reactions API with IP rate limit"
```

---

### Task 2: `ReactionButton` en el meta del post

**Files:**
- Create: `components/blog/ReactionButton.tsx`
- Modify: `components/blog/PostHeader.tsx` (añadirlo al meta row, líneas 78-89)

**Interfaces:**
- Consumes: `GET/POST /api/reactions/{slug}?lang={lang}` (Task 1).
- Produces: `ReactionButton({ slug, lang }: { slug: string; lang: string })` — client component.

- [ ] **Step 1: Crear `components/blog/ReactionButton.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";

interface ReactionButtonProps {
    slug: string;
    lang: string;
}

type Status = "loading" | "ready" | "hidden";

/**
 * Star reaction for a post. Optimistic localStorage dedupe (one per browser),
 * hides itself entirely if the reactions endpoint errors or is not configured.
 */
export function ReactionButton({ slug, lang }: ReactionButtonProps) {
    const [status, setStatus] = useState<Status>("loading");
    const [count, setCount] = useState(0);
    const [reacted, setReacted] = useState(false);
    const storageKey = `reaction:${lang}:${slug}`;

    useEffect(() => {
        let cancelled = false;
        try {
            setReacted(window.localStorage.getItem(storageKey) === "1");
        } catch {
            // localStorage unavailable (private mode) — dedupe just won't persist
        }
        fetch(`/api/reactions/${slug}?lang=${lang}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
            .then((data: { count: number }) => {
                if (cancelled) return;
                setCount(data.count);
                setStatus("ready");
            })
            .catch(() => {
                if (!cancelled) setStatus("hidden");
            });
        return () => {
            cancelled = true;
        };
    }, [slug, lang, storageKey]);

    const react = useCallback(async () => {
        if (reacted || status !== "ready") return;
        setReacted(true);
        setCount((c) => c + 1);
        try {
            window.localStorage.setItem(storageKey, "1");
        } catch {
            // best-effort persistence
        }
        try {
            const res = await fetch(`/api/reactions/${slug}?lang=${lang}`, {
                method: "POST",
            });
            if (!res.ok) throw new Error(String(res.status));
            const data: { count: number } = await res.json();
            setCount(data.count);
        } catch {
            setReacted(false);
            setCount((c) => Math.max(0, c - 1));
            try {
                window.localStorage.removeItem(storageKey);
            } catch {
                // ignore
            }
        }
    }, [reacted, status, slug, lang, storageKey]);

    if (status === "hidden") return null;

    const label =
        lang === "es"
            ? reacted
                ? "Ya marcaste este artículo"
                : "Marcar como favorito"
            : reacted
              ? "You already starred this article"
              : "Mark as favorite";

    return (
        <button
            type="button"
            onClick={react}
            aria-pressed={reacted}
            aria-label={label}
            title={label}
            className={`flex items-center gap-1.5 font-mono text-sm transition-colors ${
                reacted
                    ? "cursor-default text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:text-[var(--accent)]"
            }`}
        >
            <Star
                className={`h-4 w-4 ${reacted ? "fill-current" : ""}`}
                aria-hidden="true"
            />
            <span className="tabular-nums">{status === "loading" ? "·" : count}</span>
        </button>
    );
}
```

- [ ] **Step 2: Añadirlo al meta row de `PostHeader.tsx`**

Import nuevo junto a los existentes:

```tsx
import { ReactionButton } from "@/components/blog/ReactionButton";
```

En el meta row (el `div` con `className="mt-7 flex flex-wrap items-center gap-5 border-t..."`), después del `<span>` de `readingTime`, añadir:

```tsx
                <ReactionButton slug={post.slug} lang={lang} />
```

- [ ] **Step 3: Verificación visual con dev server**

```bash
npm run dev -- --port 4179 &
sleep 8
SLUG=$(ls content/posts/es | head -1 | sed 's/\.mdx$//')
curl -s "http://127.0.0.1:4179/es/blog/$SLUG" | grep -c "article-content"
kill %1
```

Expected: `1` (la página renderiza). La verificación interactiva (click ★, recarga, persiste) queda para la verificación final en navegador (Task 7).

- [ ] **Step 4: Lint + type-check + commit**

```bash
npm run lint && npm run type-check
git add components/blog/ReactionButton.tsx components/blog/PostHeader.tsx
git commit -m "feat(reactions): star reaction button in post header meta"
```

---

### Task 3: Counts ★ en listados (MGET batch server-side)

**Files:**
- Create: `lib/reactions.ts`
- Modify: `components/blog/PostCard.tsx` (tercer elemento del meta mono)
- Modify: `components/blog/PostGrid.tsx` (prop pass-through)
- Modify: `app/[lang]/page.tsx` (home: grid de recientes, línea ~155)
- Modify: `app/[lang]/blog/page.tsx` (línea ~63)
- Modify: `app/[lang]/tags/[tag]/page.tsx` (línea ~74)
- Modify: `app/[lang]/series/[slug]/page.tsx` (línea ~109)
- Modify: `components/pillars/PillarLanding.tsx` (línea ~48; pasa a `async function`)
- Modify: `app/[lang]/temas/[slug]/page.tsx` y `app/[lang]/topics/[slug]/page.tsx` (`export const revalidate = 60`)

**Interfaces:**
- Consumes: `getRedis`, `reactionKey` (Task 1).
- Produces: `getReactionCounts(lang: string, slugs: string[]): Promise<Record<string, number>>` en `lib/reactions.ts`; prop `reactions?: number` en `PostCard`; prop `reactionCounts?: Record<string, number>` en `PostGrid`.

- [ ] **Step 1: Crear `lib/reactions.ts`**

```ts
import { unstable_cache } from "next/cache";
import { getRedis, reactionKey } from "@/lib/redis";

/**
 * Batch-read reaction counts for a list of posts in a single MGET,
 * cached server-side with 60s revalidation. Listing pages call this once
 * and pass counts down to cards as props (never per-card, never client-side).
 * Returns {} when Redis is not configured or unavailable.
 */
export const getReactionCounts = unstable_cache(
    async (lang: string, slugs: string[]): Promise<Record<string, number>> => {
        const redis = getRedis();
        if (!redis || slugs.length === 0) return {};
        try {
            const values = await redis.mget<(number | null)[]>(
                ...slugs.map((slug) => reactionKey(lang, slug))
            );
            return Object.fromEntries(
                slugs.map((slug, i) => [slug, Number(values[i] ?? 0)])
            );
        } catch {
            return {};
        }
    },
    ["reaction-counts"],
    { revalidate: 60 }
);
```

- [ ] **Step 2: `PostCard` — prop `reactions` y ★ en el meta**

En `components/blog/PostCard.tsx`:

Import: añadir `Star` a los imports de `lucide-react` (queda `import { Layers, Star } from "lucide-react";`).

En `PostCardProps` añadir:

```ts
    /** Reaction count, read server-side in batch by the listing page */
    reactions?: number;
```

En la firma de `PostCard` añadir `reactions` a la desestructuración (sin default).

En el meta row (el `div` con `border-t ... font-mono text-xs`), después del bloque de `readingTime`, añadir:

```tsx
                    {typeof reactions === "number" && reactions > 0 && (
                        <>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1 text-[var(--accent)]">
                                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                                <span className="tabular-nums">{reactions}</span>
                            </span>
                        </>
                    )}
```

- [ ] **Step 3: `PostGrid` — pass-through**

En `components/blog/PostGrid.tsx`, añadir a `PostGridProps`:

```ts
  reactionCounts?: Record<string, number>;
```

Desestructurarla en la firma y en el render pasar:

```tsx
              <PostCard
                post={post}
                lang={lang}
                priority={index < 2}
                reactions={reactionCounts?.[post.slug]}
              />
```

- [ ] **Step 4: Home (`app/[lang]/page.tsx`)**

Import: `import { getReactionCounts } from "@/lib/reactions";`

Debajo de la línea que exporta `metadata`, añadir:

```ts
export const revalidate = 60;
```

En el cuerpo de `HomePage`, después de calcular `recentPosts`, añadir:

```ts
  const reactionCounts = await getReactionCounts(
    lang,
    recentPosts.map((post) => post.slug)
  );
```

Y en el grid de recientes:

```tsx
                <PostCard post={post} lang={lang} reactions={reactionCounts[post.slug]} />
```

- [ ] **Step 5: Blog listing (`app/[lang]/blog/page.tsx`)**

Import + `export const revalidate = 60;` igual que en Step 4. Tras `const posts = getAllPosts(lang);`:

```ts
    const reactionCounts = await getReactionCounts(
        lang,
        posts.map((post) => post.slug)
    );
```

Y:

```tsx
                <PostGrid
                    posts={posts}
                    lang={lang}
                    initialCount={8}
                    loadStep={6}
                    reactionCounts={reactionCounts}
                />
```

- [ ] **Step 6: Tags, series y pillars**

`app/[lang]/tags/[tag]/page.tsx` y `app/[lang]/series/[slug]/page.tsx`: mismo patrón — import, `export const revalidate = 60;`, calcular `reactionCounts` con los posts de la página y pasar `reactions={reactionCounts[post.slug]}` a cada `PostCard`.

`components/pillars/PillarLanding.tsx`: convertir `export function PillarLanding` en `export async function PillarLanding`, calcular `reactionCounts` tras obtener `posts`, y pasar la prop igual. En `app/[lang]/temas/[slug]/page.tsx` y `app/[lang]/topics/[slug]/page.tsx` añadir `export const revalidate = 60;`.

- [ ] **Step 7: Verificar**

```bash
npm run lint && npm run type-check && npm run build
```

Expected: build verde. En el output del build, home/blog/tags/series/temas/topics aparecen como ISR (revalidate 60), no como `○ Static` puro.

- [ ] **Step 8: Commit**

```bash
git add lib/reactions.ts components/blog/PostCard.tsx components/blog/PostGrid.tsx 'app/[lang]/page.tsx' 'app/[lang]/blog/page.tsx' 'app/[lang]/tags/[tag]/page.tsx' 'app/[lang]/series/[slug]/page.tsx' components/pillars/PillarLanding.tsx 'app/[lang]/temas/[slug]/page.tsx' 'app/[lang]/topics/[slug]/page.tsx'
git commit -m "feat(reactions): batched server-side counts in listing cards"
```

---

### Task 4: Newsletter — fuera demo mode, compact en post y Footer

**Files:**
- Modify: `lib/actions/newsletter.ts` (líneas 36-49)
- Modify: `app/[lang]/blog/[slug]/page.tsx` (sección compact tras RelatedPosts)
- Modify: `components/layout/Footer.tsx` (bloque compact arriba del contenido actual)

**Interfaces:**
- Consumes: `NewsletterForm({ lang, variant: "compact" })` (existente en `components/shared/NewsletterForm.tsx`).

- [ ] **Step 1: Quitar el demo mode**

En `lib/actions/newsletter.ts`, sustituir el bloque:

```ts
    if (!process.env.RESEND_API_KEY) {
        console.warn("[Newsletter] RESEND_API_KEY not set — skipping.");
        return {
            success: true,
            message: isSpanish
                ? "¡Suscrito! (modo demo — configura RESEND_API_KEY en producción)"
                : "Subscribed! (demo mode — set RESEND_API_KEY in production)",
        };
    }
```

por:

```ts
    if (!process.env.RESEND_API_KEY || !AUDIENCE_ID) {
        console.error(
            "[Newsletter] RESEND_API_KEY / RESEND_AUDIENCE_ID not configured"
        );
        return {
            success: false,
            error: isSpanish
                ? "El newsletter no está disponible en este momento. Inténtalo más tarde."
                : "The newsletter is unavailable right now. Please try again later.",
        };
    }
```

Y eliminar el ahora redundante:

```ts
        if (!AUDIENCE_ID) {
            throw new Error("RESEND_AUDIENCE_ID not configured");
        }
```

- [ ] **Step 2: Compact al final del post**

En `app/[lang]/blog/[slug]/page.tsx`:

Import: `import { NewsletterForm } from "@/components/shared/NewsletterForm";`

Entre `<RelatedPosts ... />` y `<Comments lang={lang} />`, insertar:

```tsx
                            {/* Newsletter — compact */}
                            <section className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
                                <p className="mb-1 font-mono text-sm text-[var(--brand)]">
                                    {"// newsletter"}
                                </p>
                                <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                                    {isSpanish
                                        ? "¿Te sirvió este artículo?"
                                        : "Was this article useful?"}
                                </h2>
                                <p className="mt-1 mb-4 text-sm text-[var(--text-secondary)]">
                                    {isSpanish
                                        ? "Recibe los siguientes en tu inbox. Sin spam, cancela cuando quieras."
                                        : "Get the next ones in your inbox. No spam, unsubscribe anytime."}
                                </p>
                                <NewsletterForm lang={lang} variant="compact" />
                            </section>
```

- [ ] **Step 3: Compact en el Footer**

En `components/layout/Footer.tsx`:

Import: `import { NewsletterForm } from "@/components/shared/NewsletterForm";`

Dentro del contenedor `mx-auto max-w-4xl ...`, ANTES del `div` con `flex flex-col items-center gap-6 ...`, insertar:

```tsx
                <div className="mb-8 flex flex-col gap-4 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-mono text-xs text-[var(--brand)]">
                            {"// newsletter"}
                        </p>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            {lang === "es"
                                ? "Nuevos artículos en tu inbox. Sin spam."
                                : "New articles in your inbox. No spam."}
                        </p>
                    </div>
                    <div className="w-full sm:max-w-sm">
                        <NewsletterForm lang={lang} variant="compact" />
                    </div>
                </div>
```

- [ ] **Step 4: Verificar**

```bash
npm run lint && npm run type-check && npm run build
```

Expected: verde. (La suscripción real con Resend se prueba en Task 7 con `delivered@resend.dev`.)

- [ ] **Step 5: Commit**

```bash
git add lib/actions/newsletter.ts 'app/[lang]/blog/[slug]/page.tsx' components/layout/Footer.tsx
git commit -m "feat(newsletter): drop demo mode; compact form on posts and footer"
```

---

### Task 5: Giscus — carga diferida + categoría "Comments"

**Files:**
- Modify: `components/blog/Comments.tsx` (reescritura completa)

**Interfaces:**
- Consumes: categoría "Comments" (tipo Announcement) en GitHub Discussions de `kr0nicas/ochoajorge-blog-me`. Obtener su `categoryId` con el comando del Step 1. Si la categoría NO existe, PARAR y preguntar a Jorge — no inventar el ID ni dejar el de "Show and tell".

- [ ] **Step 1: Obtener el categoryId real**

```bash
gh api graphql -f query='query { repository(owner: "kr0nicas", name: "ochoajorge-blog-me") { discussionCategories(first: 25) { nodes { id name } } } }' --jq '.data.repository.discussionCategories.nodes[] | select(.name=="Comments") | .id'
```

Expected: un ID `DIC_...`. Ese valor sustituye `<COMMENTS_CATEGORY_ID>` en el Step 2.

- [ ] **Step 2: Reescribir `components/blog/Comments.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

/**
 * Comments via Giscus (GitHub Discussions). The iframe is heavy, so it only
 * mounts when the reader actually scrolls near the end of the article
 * (IntersectionObserver with a generous rootMargin to hide the load).
 */
export function Comments({ lang }: { lang: string }) {
    const { resolvedTheme } = useTheme();
    const containerRef = useRef<HTMLElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el || shouldLoad) return;
        if (!("IntersectionObserver" in window)) {
            setShouldLoad(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setShouldLoad(true);
            },
            { rootMargin: "600px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [shouldLoad]);

    return (
        <section
            ref={containerRef}
            className="mt-20 border-t border-[var(--border)] pt-12"
        >
            <h2 className="mb-8 font-display text-2xl font-bold text-[var(--text-primary)]">
                {lang === "es" ? "Discusión" : "Discussion"}
            </h2>
            <div className="min-h-[280px] rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 sm:p-8">
                {shouldLoad && (
                    <Giscus
                        id="comments"
                        repo="kr0nicas/ochoajorge-blog-me"
                        repoId="R_kgDORa5J1g"
                        category="Comments"
                        categoryId="<COMMENTS_CATEGORY_ID>"
                        mapping="pathname"
                        strict="0"
                        reactionsEnabled="1"
                        emitMetadata="0"
                        inputPosition="bottom"
                        theme={resolvedTheme === "dark" ? "transparent_dark" : "light"}
                        lang={lang === "es" ? "es" : "en"}
                        loading="lazy"
                    />
                )}
            </div>
        </section>
    );
}
```

Notas: desaparecen `term` (solo aplica a mapping por término) y el `backdrop-blur` glass (fuera del sistema visual desde Fase 1). `min-h-[280px]` evita CLS al montar el iframe.

- [ ] **Step 3: Migrar el hilo existente a la categoría nueva**

Hay exactamente UN hilo en "Show and tell" mapeado por pathname: `es/blog/construyendo-con-ia-parte-2-el-orden-que-me-salvo`. Sin migrarlo, ese post perdería sus comentarios (riesgo marcado en la spec). Migrarlo por API:

```bash
DISCUSSION_ID=$(gh api graphql -f query='query { repository(owner: "kr0nicas", name: "ochoajorge-blog-me") { discussions(first: 50) { nodes { id title category { name } } } } }' --jq '.data.repository.discussions.nodes[] | select(.category.name=="Show and tell") | .id')
gh api graphql -f query="mutation { updateDiscussion(input: { discussionId: \"$DISCUSSION_ID\", categoryId: \"<COMMENTS_CATEGORY_ID>\" }) { discussion { title category { name } } } }"
```

Expected: la mutación devuelve el hilo con `category.name == "Comments"`.

- [ ] **Step 4: Verificar**

```bash
npm run lint && npm run type-check && npm run build
```

Expected: verde. La verificación de "carga solo al hacer scroll" se hace en navegador en Task 7 (pestaña Network: el iframe de giscus.app no aparece hasta scrollear al final).

- [ ] **Step 5: Commit**

```bash
git add components/blog/Comments.tsx
git commit -m "feat(comments): defer giscus mount until scroll; own Comments category"
```

---

### Task 6: Compartir — `navigator.share` + fallback de clipboard

**Files:**
- Modify: `components/blog/ShareButton.tsx`

- [ ] **Step 1: Native share primero, menú como fallback**

En `components/blog/ShareButton.tsx`, sustituir el `onClick` del botón principal. El handler actual:

```tsx
        onClick={() => setShowMenu((prev) => !prev)}
```

pasa a:

```tsx
        onClick={handleShareClick}
```

y añadir junto a `handleCopy`:

```tsx
  const handleShareClick = () => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      // Native share sheet (mobile & some desktop browsers). A rejected promise
      // just means the user dismissed the sheet — no fallback menu needed.
      navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    setShowMenu((prev) => !prev);
  };
```

- [ ] **Step 2: Clipboard con fallback para contextos no-secure**

Sustituir el `handleCopy` actual:

```tsx
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
```

por:

```tsx
  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      window.isSecureContext
    ) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // fall through to the legacy path
      }
    }
    // Legacy fallback for non-secure contexts (e.g. LAN preview over http)
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(url);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  ```

- [ ] **Step 3: Verificar + commit**

```bash
npm run lint && npm run type-check
git add components/blog/ShareButton.tsx
git commit -m "feat(share): native navigator.share with clipboard fallbacks"
```

---

### Task 7: Verificación final (suite completa + navegador + Lighthouse)

**Files:** ninguno nuevo (solo fixes si algo falla).

- [ ] **Step 1: Suite completa**

```bash
npm run lint && npm run type-check && npm run seo:audit && npm run build && npm run test:e2e
```

Expected: todo verde.

- [ ] **Step 2: Verificación en navegador (dev server)** — la ejecuta el agente principal con las herramientas de Chrome, no un subagente:

1. Reacción: abrir un post, click en ★ (incrementa al instante), recargar → sigue marcada y el count persiste (criterio de la spec).
2. Newsletter: en el compact del final del post, suscribir `delivered@resend.dev` → mensaje de éxito. (Es la dirección de test de Resend; borrar el contacto del Audience después si molesta.)
3. Giscus: abrir un post con Network abierto → sin requests a `giscus.app` hasta scrollear al final del artículo; al llegar, carga con el tema correcto.
4. Listados: home y /blog muestran `fecha · min · ★ N` en las cards de posts con reacciones.

- [ ] **Step 3: Lighthouse sin regresión (build de producción)**

```bash
npm run build && npm run start -- --port 4180 &
sleep 6
SLUG=$(ls content/posts/es | head -1 | sed 's/\.mdx$//')
npx --yes lighthouse "http://127.0.0.1:4180/es" --preset=desktop --only-categories=performance,seo --quiet --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh-home.json
npx --yes lighthouse "http://127.0.0.1:4180/es/blog/$SLUG" --preset=desktop --only-categories=performance,seo --quiet --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh-post.json
node -e 'for (const f of ["/tmp/lh-home.json","/tmp/lh-post.json"]) { const r = require(f); console.log(f, Object.fromEntries(Object.entries(r.categories).map(([k,v]) => [k, v.score*100]))); }'
kill %1
```

Expected: performance y SEO en 100 (o igual al baseline de Fase 2) en home y post.

- [ ] **Step 4: Push + PR**

```bash
git push -u origin fase3-interaccion
gh pr create --base develop --title "Fase 3 — Interacción: reacciones, newsletter, giscus diferido, share nativo" --fill
```
