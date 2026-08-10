# Post Images via n8n + Gemini + Nano Banana — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lado repo de la automatización de imágenes: script `npm run post:images` que invoca el webhook n8n y parchea el MDX, soporte `pathname` en `/api/upload`, híbrido cover-en-plantilla-OG, y los docs/prompt con los que Jorge monta los dos workflows de n8n.

**Architecture:** El agente llama a `scripts/post-images.mjs`, que POSTea el post al webhook de n8n (URL/secreto por máquina en env) y espera respuesta síncrona con URLs de Vercel Blob; el script parchea `coverImage` en el frontmatter e inserta las inline tras sus headings. `lib/og-template.tsx` renderiza la cover como capa de arte con degradado, pre-fetcheada con try/catch para no romper la OG si la URL falla. Todo degrada con gracia: cualquier fallo → el post sale sin imágenes.

**Tech Stack:** Node 22 (scripts .mjs, `process.loadEnvFile`), gray-matter (ya instalada) solo para parsear, `next/og` (satori), `@vercel/blob` (ya instalada). Cero dependencias nuevas.

## Global Constraints

- Rama de trabajo: `feat/post-images-n8n` desde `origin/develop` (ya existe; worktree en `.claude/worktrees/post-images-n8n`). PR con base `develop` (AGENTS.md). NUNCA push a `main` ni `develop`.
- Commits convencionales `tipo(ámbito): asunto`, en inglés, con `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Cero dependencias nuevas. Identificadores en inglés; docs de automation en español (audiencia: Jorge y sus agentes).
- Contrato del webhook copiado VERBATIM del spec (`docs/superpowers/specs/2026-08-09-post-images-n8n-design.md`): request `{slug, lang, title, description, pillar, tags, content, maxInlineImages}`, response `{cover: {url, alt} | null, inline: [{url, alt, afterHeading}]}`, header `X-Webhook-Secret`, errores 401/422/5xx, naming Blob `posts/<slug>/cover.png` y `posts/<slug>/inline-N.png`.
- Degradación con gracia OBLIGATORIA: sin env vars, webhook caído, timeout o no-200 → mensaje claro y `exit 0`; el flujo de publicación nunca se bloquea. `cover: null` → no tocar frontmatter, procesar solo inline.
- Idempotencia: con `coverImage` ya presente el script no hace nada salvo `--force`.
- OG: sin `coverImage` la plantilla queda EXACTAMENTE como hoy (cero cambios para posts existentes). Con cover, el panel de arte no puede romper la legibilidad de título/kicker/marca ni el render si la URL falla.
- Env vars nuevas: `N8N_IMAGES_WEBHOOK_URL`, `N8N_IMAGES_WEBHOOK_SECRET` (en `.env.example` con comentario).
- Verificación global al final: `npm run lint && npm run type-check && npm run seo:audit && npm run build && npm run test:e2e && npm run test:images`.

---

### Task 0: Commit del plan

**Files:**
- Create: `docs/superpowers/plans/2026-08-09-post-images-n8n.md` (este archivo)

- [ ] **Step 1: Commit**

```bash
git add docs/superpowers/plans/2026-08-09-post-images-n8n.md
git commit -m "docs(plans): post images via n8n implementation plan"
```

---

### Task 1: `/api/upload` — soporte `pathname` determinista

**Files:**
- Modify: `app/api/upload/route.ts`

**Interfaces:**
- Produces: `POST /api/upload?pathname=posts/<slug>/<file>` (Bearer `UPLOAD_SECRET`) sube a Blob EXACTAMENTE en ese pathname (sin sufijo aleatorio, con overwrite) y devuelve el JSON de `put()` (incluye `url`). El modo legacy `?filename=` queda intacto. `400` si el pathname no casa `^posts/[a-z0-9-]+/[a-z0-9][a-z0-9.-]*$`. Lo consume el workflow de n8n (Task 4 lo documenta).

- [ ] **Step 1: Implementar el parámetro**

En `app/api/upload/route.ts`, sustituir el bloque:

```ts
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") || "image.png";
```

por:

```ts
    const { searchParams } = new URL(request.url);
    const pathname = searchParams.get("pathname");
    const filename = searchParams.get("filename") || "image.png";

    // Deterministic destination for automated post images (n8n): no random
    // suffix, overwrite allowed so regeneration replaces the previous asset.
    const PATHNAME_RE = /^posts\/[a-z0-9-]+\/[a-z0-9][a-z0-9.-]*$/;
    if (pathname !== null && !PATHNAME_RE.test(pathname)) {
        return NextResponse.json(
            { error: "Invalid pathname (expected posts/<slug>/<file>)" },
            { status: 400 }
        );
    }
```

y sustituir la llamada:

```ts
        const blob = await put(filename, body, {
            access: "public",
        });
```

por:

```ts
        const blob = pathname
            ? await put(pathname, body, {
                  access: "public",
                  addRandomSuffix: false,
                  allowOverwrite: true,
              })
            : await put(filename, body, { access: "public" });
```

- [ ] **Step 2: Verificar contra dev server**

```bash
npm run dev -- --port 4183 &
sleep 8
SECRET=$(grep '^UPLOAD_SECRET=' .env.local | cut -d= -f2)
# pathname inválido (traversal) → 400, sin tocar Blob
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Authorization: Bearer $SECRET" --data-binary "x" "http://127.0.0.1:4183/api/upload?pathname=posts/../secrets/x.png"   # 400
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Authorization: Bearer $SECRET" --data-binary "x" "http://127.0.0.1:4183/api/upload?pathname=evil.png"                    # 400
# sin auth → 401
curl -s -o /dev/null -w "%{http_code}\n" -X POST --data-binary "x" "http://127.0.0.1:4183/api/upload?pathname=posts/test/x.png"                                              # 401
# pathname válido → 200 con url determinista (sube un byte real a Blob; borrable después desde el dashboard)
curl -s -X POST -H "Authorization: Bearer $SECRET" --data-binary "test" "http://127.0.0.1:4183/api/upload?pathname=posts/plan-test/probe.txt" | head -c 300; echo
kill %1
```

Expected: `400`, `400`, `401`, y un JSON cuyo `url` termina en `/posts/plan-test/probe.txt` (sin sufijo aleatorio). Nota: `..` no casa la regex (solo `[a-z0-9-]` en el slug), así que el primer 400 cubre traversal.

- [ ] **Step 3: Lint + type-check + commit**

```bash
npm run lint && npm run type-check
git add app/api/upload/route.ts
git commit -m "feat(upload): deterministic pathname destination for automated post images"
```

---

### Task 2: `scripts/post-images.mjs` + test con mock webhook

**Files:**
- Create: `scripts/post-images.mjs`
- Create: `scripts/post-images.test.mjs`
- Modify: `package.json` (scripts `post:images` y `test:images`)

**Interfaces:**
- Consumes: contrato del webhook (Global Constraints). Env `N8N_IMAGES_WEBHOOK_URL`, `N8N_IMAGES_WEBHOOK_SECRET` (vía `.env.local` con `process.loadEnvFile`, o del entorno).
- Produces: `npm run post:images -- <slug> [es|en] [--force]` — parchea `content/posts/{lang}/{slug}.mdx` in place. `npm run test:images` — suite del script contra mock local. El CLI acepta `POST_IMAGES_CONTENT_ROOT` (env) para operar sobre un árbol de contenido alternativo — lo usa el test para no tocar `content/` real.

- [ ] **Step 1: Escribir el test (mock webhook + fixtures) — primero**

Crear `scripts/post-images.test.mjs`:

```js
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "post-images.mjs");

const FIXTURE = `---
title: "Post de prueba"
description: "Descripción de prueba para el test del script de imágenes generadas."
date: "2026-08-09"
tags: ["arquitectura"]
pillar: "arquitectura"
lang: "es"
draft: true
---

Intro del post.

## El problema

Texto del problema.

## Una sección sin imagen

Más texto.
`;

const RESPONSE = {
    cover: { url: "https://blob.example/posts/post-prueba/cover.png", alt: "Cover alt" },
    inline: [
        {
            url: "https://blob.example/posts/post-prueba/inline-1.png",
            alt: "Diagrama del problema",
            afterHeading: "## El problema",
        },
        {
            url: "https://blob.example/posts/post-prueba/inline-2.png",
            alt: "Huérfana",
            afterHeading: "## Heading que no existe",
        },
    ],
};

function makeContentRoot() {
    const root = mkdtempSync(path.join(tmpdir(), "post-images-test-"));
    mkdirSync(path.join(root, "es"), { recursive: true });
    writeFileSync(path.join(root, "es", "post-prueba.mdx"), FIXTURE);
    return root;
}

function runScript(root, url, extraArgs = [], expectFailure = false) {
    try {
        const out = execFileSync(
            process.execPath,
            [SCRIPT, "post-prueba", "es", ...extraArgs],
            {
                env: {
                    ...process.env,
                    POST_IMAGES_CONTENT_ROOT: root,
                    N8N_IMAGES_WEBHOOK_URL: url,
                    N8N_IMAGES_WEBHOOK_SECRET: "test-secret",
                },
                encoding: "utf8",
            }
        );
        return { code: 0, out };
    } catch (err) {
        if (expectFailure) return { code: err.status, out: String(err.stdout ?? "") };
        throw err;
    }
}

async function withMockServer(payload, fn) {
    const requests = [];
    const server = createServer((req, res) => {
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
            requests.push({ headers: req.headers, body: JSON.parse(body) });
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify(payload));
        });
    });
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    const url = `http://127.0.0.1:${server.address().port}/webhook`;
    try {
        return await fn(url, requests);
    } finally {
        server.close();
    }
}

// 1. Happy path: cover al frontmatter, inline con heading exacto insertada, huérfana avisada
await withMockServer(RESPONSE, async (url, requests) => {
    const root = makeContentRoot();
    const { out } = runScript(root, url);
    const patched = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    assert.match(patched, /coverImage: "https:\/\/blob\.example\/posts\/post-prueba\/cover\.png"/);
    assert.match(patched, /coverImageAlt: "Cover alt"/);
    assert.match(patched, /## El problema\n\n!\[Diagrama del problema\]\(https:\/\/blob\.example\/posts\/post-prueba\/inline-1\.png\)\n/);
    assert.ok(!patched.includes("inline-2.png"), "la huérfana no se inserta");
    assert.match(out, /## Heading que no existe/);
    assert.match(out, /inline-2\.png/);
    // El request cumple el contrato
    const req = requests[0];
    assert.equal(req.headers["x-webhook-secret"], "test-secret");
    assert.equal(req.body.slug, "post-prueba");
    assert.equal(req.body.lang, "es");
    assert.equal(req.body.pillar, "arquitectura");
    assert.equal(req.body.maxInlineImages, 3);
    assert.ok(req.body.content.includes("## El problema"));
    assert.ok(!req.body.content.includes("title:"), "content va sin frontmatter");
    rmSync(root, { recursive: true, force: true });
});

// 2. Idempotencia: con coverImage presente no toca nada y no llama al webhook
await withMockServer(RESPONSE, async (url, requests) => {
    const root = makeContentRoot();
    runScript(root, url);
    const afterFirst = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    runScript(root, url);
    const afterSecond = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    assert.equal(afterFirst, afterSecond);
    assert.equal(requests.length, 1, "la segunda ejecución no llama al webhook");
    rmSync(root, { recursive: true, force: true });
});

// 3. --force: regenera (reemplaza coverImage y vuelve a llamar)
await withMockServer(RESPONSE, async (url, requests) => {
    const root = makeContentRoot();
    runScript(root, url);
    runScript(root, url, ["--force"]);
    const patched = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    assert.equal(requests.length, 2);
    assert.equal(patched.match(/coverImage:/g).length, 1, "sin duplicar coverImage");
    rmSync(root, { recursive: true, force: true });
});

// 4. cover null: solo inline, frontmatter intacto
await withMockServer({ ...RESPONSE, cover: null }, async (url) => {
    const root = makeContentRoot();
    runScript(root, url);
    const patched = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    assert.ok(!patched.includes("coverImage"));
    assert.ok(patched.includes("inline-1.png"));
    rmSync(root, { recursive: true, force: true });
});

// 5. Webhook caído → exit 0, archivo intacto
{
    const root = makeContentRoot();
    const { code } = runScript(root, "http://127.0.0.1:1/webhook");
    assert.equal(code, 0);
    const untouched = readFileSync(path.join(root, "es", "post-prueba.mdx"), "utf8");
    assert.equal(untouched, FIXTURE);
    rmSync(root, { recursive: true, force: true });
}

// 6. Env vars ausentes → exit 0 con aviso
{
    const root = makeContentRoot();
    const out = execFileSync(
        process.execPath,
        [SCRIPT, "post-prueba", "es"],
        {
            env: { ...process.env, POST_IMAGES_CONTENT_ROOT: root, N8N_IMAGES_WEBHOOK_URL: "", N8N_IMAGES_WEBHOOK_SECRET: "" },
            encoding: "utf8",
        }
    );
    assert.match(out, /N8N_IMAGES_WEBHOOK_URL/);
    rmSync(root, { recursive: true, force: true });
}

// 7. Post inexistente → exit 1 (error del agente, debe fallar fuerte)
await withMockServer(RESPONSE, async (url) => {
    const root = makeContentRoot();
    const { code } = runScript(root.replace(/post-images-test-.*/, "no-existe"), url, [], true);
    assert.equal(code, 1);
    rmSync(root, { recursive: true, force: true });
});

console.log("post-images tests passed.");
```

- [ ] **Step 2: Añadir los npm scripts y verificar que el test falla**

En `package.json`, tras `"post:new"`:

```json
    "post:images": "node scripts/post-images.mjs",
```

y tras `"test:e2e"`:

```json
    "test:images": "node scripts/post-images.test.mjs",
```

Run: `npm run test:images`
Expected: FAIL — `Cannot find module '…/scripts/post-images.mjs'`.

- [ ] **Step 3: Implementar `scripts/post-images.mjs`**

```js
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Requests AI-generated images for a post from the n8n automation and patches
 * the MDX in place: coverImage/coverImageAlt into the frontmatter, inline
 * images right after their matching headings.
 *
 * Usage: npm run post:images -- <slug> [es|en] [--force]
 *
 * Contract and setup: docs/automation/n8n-post-images.md
 * NEVER blocks publishing: any webhook failure exits 0 with a notice.
 */

try {
    process.loadEnvFile(".env.local");
} catch {
    // no .env.local (e.g. Hermes' VPS) — vars must come from the environment
}

const TIMEOUT_MS = 5 * 60 * 1000;
const MAX_INLINE_IMAGES = 3;

const args = process.argv.slice(2).filter((a) => a !== "--force");
const force = process.argv.includes("--force");
const [slug, lang = "es"] = args;

if (!slug || !["es", "en"].includes(lang)) {
    console.error("Usage: npm run post:images -- <slug> [es|en] [--force]");
    process.exit(1);
}

const contentRoot =
    process.env.POST_IMAGES_CONTENT_ROOT ?? path.join(process.cwd(), "content", "posts");
const filePath = path.join(contentRoot, lang, `${slug}.mdx`);

if (!existsSync(filePath)) {
    console.error(`Post not found: ${filePath}`);
    process.exit(1);
}

const webhookUrl = process.env.N8N_IMAGES_WEBHOOK_URL;
const webhookSecret = process.env.N8N_IMAGES_WEBHOOK_SECRET;
if (!webhookUrl || !webhookSecret) {
    console.log(
        "[post:images] N8N_IMAGES_WEBHOOK_URL / N8N_IMAGES_WEBHOOK_SECRET not set — skipping image generation. The post ships without images."
    );
    process.exit(0);
}

const raw = readFileSync(filePath, "utf8");
const { data: frontmatter, content: body } = matter(raw);

if (frontmatter.coverImage && !force) {
    console.log(
        `[post:images] ${slug} already has coverImage — nothing to do (use --force to regenerate).`
    );
    process.exit(0);
}

let response;
try {
    const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-webhook-secret": webhookSecret,
        },
        body: JSON.stringify({
            slug,
            lang,
            title: frontmatter.title ?? "",
            description: frontmatter.description ?? "",
            pillar: frontmatter.pillar ?? "",
            tags: frontmatter.tags ?? [],
            content: body,
            maxInlineImages: MAX_INLINE_IMAGES,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
        console.log(
            `[post:images] webhook responded ${res.status} — skipping. The post ships without images.`
        );
        process.exit(0);
    }
    response = await res.json();
} catch (err) {
    console.log(
        `[post:images] webhook unreachable (${err.name ?? "error"}) — skipping. The post ships without images.`
    );
    process.exit(0);
}

let updated = raw;

// ── Cover → frontmatter ─────────────────────────────────────────────
if (response.cover?.url) {
    const coverLines = `coverImage: "${response.cover.url}"\ncoverImageAlt: "${(response.cover.alt ?? "").replaceAll('"', "'")}"`;
    if (/^coverImage:/m.test(updated)) {
        updated = updated
            .replace(/^coverImage:.*$/m, `coverImage: "${response.cover.url}"`)
            .replace(/^coverImageAlt:.*$/m, `coverImageAlt: "${(response.cover.alt ?? "").replaceAll('"', "'")}"`);
        if (!/^coverImageAlt:/m.test(updated)) {
            updated = updated.replace(/^coverImage:.*$/m, (line) => `${line}\ncoverImageAlt: "${(response.cover.alt ?? "").replaceAll('"', "'")}"`);
        }
    } else {
        // Insert right before the closing --- of the frontmatter block
        updated = updated.replace(/^---\n([\s\S]*?)\n---/, (_, fm) => `---\n${fm}\n${coverLines}\n---`);
    }
    console.log(`[post:images] coverImage set: ${response.cover.url}`);
} else {
    console.log("[post:images] no cover in response — frontmatter untouched.");
}

// ── Inline → after exact heading match ──────────────────────────────
const orphans = [];
for (const image of response.inline ?? []) {
    const heading = (image.afterHeading ?? "").trim();
    const lines = updated.split("\n");
    const index = heading ? lines.findIndex((l) => l.trim() === heading) : -1;
    if (index === -1) {
        orphans.push(image);
        continue;
    }
    lines.splice(index + 1, 0, "", `![${image.alt ?? ""}](${image.url})`);
    updated = lines.join("\n");
    console.log(`[post:images] inserted after "${heading}": ${image.url}`);
}

writeFileSync(filePath, updated);

if (orphans.length > 0) {
    console.log("\n[post:images] headings not found — place these manually:");
    for (const image of orphans) {
        console.log(`\n  # after: ${image.afterHeading}\n  ![${image.alt ?? ""}](${image.url})`);
    }
}

console.log(`\n[post:images] done: ${filePath}`);
```

- [ ] **Step 4: Correr el test hasta verde**

Run: `npm run test:images`
Expected: `post-images tests passed.`

- [ ] **Step 5: Lint + commit**

```bash
npm run lint
git add scripts/post-images.mjs scripts/post-images.test.mjs package.json
git commit -m "feat(images): post:images CLI that patches MDX from the n8n webhook"
```

---

### Task 3: Híbrido OG — cover como capa de arte

**Files:**
- Modify: `lib/og-template.tsx`
- Modify: `app/[lang]/blog/[slug]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `post.coverImage` (ya existe en `lib/types.ts` y `lib/posts.ts`).
- Produces: `renderOgImage({ …, coverUrl?: string })` — con `coverUrl` renderiza panel de arte derecho; sin él, salida IDÉNTICA a la actual.

- [ ] **Step 1: `lib/og-template.tsx` — parámetro `coverUrl` con pre-fetch seguro**

Añadir a `OgOptions`:

```ts
    /** Generated cover art (Vercel Blob URL) layered behind the right panel */
    coverUrl?: string;
```

Cambiar la firma:

```ts
export async function renderOgImage({ title, pillar, readingTime, hue: hueOverride, coverUrl }: OgOptions) {
```

Tras `const { spaceGrotesk, jetbrainsMono } = await loadOgFonts();` añadir el pre-fetch (un fallo de la URL NUNCA rompe la OG — se renderiza sin panel):

```ts
    let coverSrc: string | null = null;
    if (coverUrl) {
        try {
            const res = await fetch(coverUrl, { signal: AbortSignal.timeout(5000) });
            const type = res.headers.get("content-type") ?? "";
            if (res.ok && type.startsWith("image/")) {
                const buffer = Buffer.from(await res.arrayBuffer());
                coverSrc = `data:${type};base64,${buffer.toString("base64")}`;
            }
        } catch {
            // cover unavailable — render the classic template
        }
    }
```

Dentro del JSX, inmediatamente DESPUÉS del div del grid (`{/* Subtle grid */} …`) y ANTES del glow, insertar el panel (queda bajo glow y texto):

```tsx
                {/* Cover art panel — right 40%, fading into the base background */}
                {coverSrc ? (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "480px",
                            height: "100%",
                            display: "flex",
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={coverSrc}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(90deg, #0c0c0d 0%, rgba(12,12,13,0.72) 30%, rgba(12,12,13,0.18) 100%)",
                            }}
                        />
                    </div>
                ) : null}
```

Y para que el título no quede bajo el panel, cambiar la línea del `maxWidth` del título:

```tsx
                        maxWidth: "980px",
```

por:

```tsx
                        maxWidth: coverSrc ? "660px" : "980px",
```

- [ ] **Step 2: `app/[lang]/blog/[slug]/opengraph-image.tsx` — pasar la cover**

En la llamada a `renderOgImage`, añadir:

```tsx
        coverUrl: post?.coverImage,
```

- [ ] **Step 3: Verificación visual con dev server**

```bash
npm run dev -- --port 4183 &
sleep 8
SLUG=$(ls content/posts/es | head -1 | sed 's/\.mdx$//')
# Sin cover: idéntica a la actual
curl -s "http://127.0.0.1:4183/es/blog/$SLUG/opengraph-image" -o /tmp/og-sin-cover.png && file /tmp/og-sin-cover.png
# Con cover: añadir TEMPORALMENTE al frontmatter de ese post una URL de imagen real, p.ej.:
#   coverImage: "https://placehold.co/1024x1024.png"
# recargar, capturar y REVERTIR el cambio:
curl -s "http://127.0.0.1:4183/es/blog/$SLUG/opengraph-image" -o /tmp/og-con-cover.png && file /tmp/og-con-cover.png
# Cover con URL rota: cambiar coverImage a https://invalid.example/x.png → la OG debe seguir respondiendo 200 (sin panel)
kill %1
git checkout -- content/  # revertir el frontmatter temporal
```

Expected: ambos PNG 1200×630; abrir los dos archivos con Read y comprobar visualmente: sin cover = plantilla actual; con cover = panel derecho con degradado y título legible a 660px; URL rota = 200 con plantilla clásica.

- [ ] **Step 4: Lint + type-check + commit**

```bash
npm run lint && npm run type-check
git add lib/og-template.tsx 'app/[lang]/blog/[slug]/opengraph-image.tsx'
git commit -m "feat(og): layer generated cover art into the og template"
```

---

### Task 4: Docs — workflow, contrato y prompt del agente constructor

**Files:**
- Modify: `.agent/workflows/new_post.md`
- Create: `docs/automation/n8n-post-images.md`
- Create: `docs/automation/n8n-workflow-agent-prompt.md`
- Modify: `.env.example`

**Interfaces:**
- Consumes: contrato (Global Constraints), `POST /api/upload?pathname=` (Task 1), `npm run post:images` (Task 2).

> **OJO al copiar:** dentro de los bloques de contenido de este task, los code
> fences interiores aparecen como `​```` con un zero-width space delante para no
> romper este plan. Al crear los archivos reales, escríbelos como ``` normales
> (tres backticks limpios, sin carácter invisible). Verifica con
> `grep -rn $'​' docs/automation/ .agent/workflows/new_post.md` → sin resultados.

- [ ] **Step 1: `.env.example`**

Añadir al final:

```
# Imágenes de posts vía n8n (docs/automation/n8n-post-images.md)
N8N_IMAGES_WEBHOOK_URL=     # webhook del n8n de TU máquina (mac-dev u Hetzner)
N8N_IMAGES_WEBHOOK_SECRET=  # X-Webhook-Secret de esa instancia
```

- [ ] **Step 2: `.agent/workflows/new_post.md` — paso nuevo**

Insertar tras el paso de escritura del contenido (antes de la validación con `seo:audit`):

```markdown
## Paso — Imágenes generadas (opcional pero recomendado)

Con el contenido terminado y aún `draft: true`:

​```bash
npm run post:images -- {slug} {lang}
​```

- Llama al n8n de esta máquina (env `N8N_IMAGES_WEBHOOK_URL/SECRET`), que genera
  cover + ilustraciones con Gemini/Nano Banana y las sube a Vercel Blob.
- El script parchea `coverImage` y las inline solo; si algún heading no casa,
  imprime el bloque para colocarlo a mano.
- **Nunca bloquea:** si el webhook falla o no hay config, el post sigue sin
  imágenes (el warning de `seo:audit` lo recuerda). No reintentes en bucle.
- Regenerar: `npm run post:images -- {slug} {lang} --force`.
- Contrato y detalles: `docs/automation/n8n-post-images.md`.
```

- [ ] **Step 3: `docs/automation/n8n-post-images.md` — contrato formal**

```markdown
# Imágenes de posts — contrato del webhook n8n

Automatización que genera cover + ilustraciones para un post con Gemini
(prompts) y Nano Banana (imágenes), y las sube a Vercel Blob. Corre en DOS
instancias de n8n con el mismo workflow: **mac-dev** (la usan el portátil de
trabajo y mac-dev) y **Hetzner** (la usa Hermes). Cada máquina apunta a la suya
vía `N8N_IMAGES_WEBHOOK_URL` / `N8N_IMAGES_WEBHOOK_SECRET`.

El cliente canónico es `npm run post:images -- <slug> [es|en]`
(`scripts/post-images.mjs`). Los agentes NO llaman al webhook a mano.

## Request

`POST {N8N_IMAGES_WEBHOOK_URL}` — headers `content-type: application/json`,
`x-webhook-secret: {N8N_IMAGES_WEBHOOK_SECRET}`.

​```json
{
  "slug": "hexagonal-arch-python",
  "lang": "es",
  "title": "…",
  "description": "…",
  "pillar": "arquitectura",
  "tags": ["…"],
  "content": "…cuerpo MDX sin frontmatter…",
  "maxInlineImages": 3
}
​```

## Response 200 (síncrona; el cliente espera hasta 5 min)

​```json
{
  "cover":  { "url": "https://…blob…/posts/hexagonal-arch-python/cover.png", "alt": "…" },
  "inline": [
    { "url": "https://…/posts/hexagonal-arch-python/inline-1.png", "alt": "…", "afterHeading": "## El problema" }
  ]
}
​```

- `alt` en el idioma del post (`lang`).
- `afterHeading`: línea de heading EXACTA copiada de `content` (el cliente
  inserta con igualdad estricta tras `trim()`).
- Fallo parcial: responder `200` con lo que haya. `cover` puede ser `null`;
  `inline` puede ser `[]`.

## Errores

| Código | Cuándo |
|---|---|
| `401` | `x-webhook-secret` ausente o inválido |
| `422` | payload inválido: falta `slug`/`title`/`content`, `lang` ∉ {es,en}, o `pillar` ∉ {construir-con-ia, agentes-en-produccion, arquitectura, seguridad} |
| `5xx` | fallo total upstream (Gemini caído, Blob caído) |

Ante cualquier no-200 el cliente publica sin imágenes. No hay reintentos.

## Subida a Blob (dentro del workflow)

Cada imagen se sube al blog, NO directo a Blob:

​```
POST https://www.ochoajorge.me/api/upload?pathname=posts/{slug}/{file}
Authorization: Bearer {UPLOAD_SECRET}
body: bytes de la imagen
​```

- `{file}`: `cover.png`, `inline-1.png`, `inline-2.png`, `inline-3.png`.
- El pathname debe casar `posts/<slug>/<file>` (minúsculas, guiones); la
  respuesta JSON trae `url`, que es la que va en la response del webhook.
- La subida es determinista y con overwrite: regenerar reemplaza el asset.

## Estilo de marca (obligatorio en todos los prompts de imagen)

Editorial "Grotesk Suizo": composición limpia tipo revista de diseño, fondo
claro o oscuro neutro, paleta blanco/negro con acentos azul eléctrico
`#0d40f5` y naranja señal `#ff5c39`, abstracto/conceptual mejor que literal,
**sin texto renderizado dentro de la imagen**, sin logos de terceros.
Cover: 1200×900 aprox (se recorta a panel). Inline: 1600×900 aprox.

## Montaje del workflow

El prompt autocontenido para construirlo (secuencia de nodos, errores,
checklist de aceptación): `docs/automation/n8n-workflow-agent-prompt.md`.
```

- [ ] **Step 4: `docs/automation/n8n-workflow-agent-prompt.md` — prompt del agente constructor**

```markdown
# Prompt: construir el workflow "post-images" en n8n

> Copia este documento entero como instrucciones al agente que monta el
> workflow en una instancia de n8n (mac-dev o Hetzner). Es autocontenido.
> La fuente de verdad del contrato es `docs/automation/n8n-post-images.md`
> en el repo `kr0nicas/ochoajorge-blog-me`; si este prompt y aquel doc
> divergen, gana el doc del contrato.

Eres un agente construyendo un workflow de n8n llamado `post-images`.
Recibe el contenido de un post de blog, genera imágenes con IA y responde
con sus URLs. Debe cumplir EXACTAMENTE el contrato de abajo — un script
cliente ya desplegado (`scripts/post-images.mjs`) depende de él.

## Credenciales que te dará Jorge

- `GEMINI_API_KEY` — Google AI Studio (modelos de texto e imagen).
- `WEBHOOK_SECRET` — el valor que validarás en el header `x-webhook-secret`.
- `UPLOAD_SECRET` — Bearer para subir imágenes al blog.

## Contrato (idéntico a n8n-post-images.md)

**Request que recibirás** — `POST` al webhook, JSON:
`{ slug, lang ("es"|"en"), title, description, pillar, tags[], content, maxInlineImages }`

**Response 200 que debes emitir** (síncrona, el cliente espera hasta 5 min):
`{ "cover": { "url", "alt" } | null, "inline": [ { "url", "alt", "afterHeading" } ] }`

**Errores:** `401` secreto inválido · `422` payload inválido (falta
slug/title/content, lang fuera de {es,en}, pillar fuera de
{construir-con-ia, agentes-en-produccion, arquitectura, seguridad}) ·
`5xx` solo ante fallo total. **Fallo parcial → 200 con lo que haya**
(`cover: null` y/o menos inline de las pedidas).

## Secuencia de nodos sugerida

1. **Webhook** (POST, response mode "Using Respond to Webhook node").
2. **Validación**: si `x-webhook-secret` ≠ `WEBHOOK_SECRET` → Respond 401
   `{"error":"unauthorized"}`. Si payload inválido → Respond 422
   `{"error":"invalid_payload","detail":"…"}`.
3. **Gemini texto** (modelo tipo `gemini-2.5-flash`): a partir de
   `title/description/content/pillar`, redactar los prompts de imagen:
   1 para la cover + hasta `maxInlineImages` para secciones. Pedir salida
   JSON estricta: `[{ "kind": "cover"|"inline", "prompt": "…",
   "alt": "…", "afterHeading": "## …" }]`, donde `alt` va en el idioma
   `lang` y `afterHeading` es una línea de heading COPIADA VERBATIM de
   `content` (nunca inventada). Cada `prompt` debe terminar con el bloque
   de estilo de marca (siguiente sección).
4. **Loop por imagen → Nano Banana** (modelo de imagen de Gemini, p.ej.
   `gemini-2.5-flash-image`): generar. Si una imagen falla, continuar con
   las demás (Continue On Fail) — nunca abortar el workflow entero.
5. **Subida por imagen**: `POST https://www.ochoajorge.me/api/upload?pathname=posts/{{slug}}/{{file}}`
   con header `Authorization: Bearer {UPLOAD_SECRET}` y el binario como
   body. `{file}` = `cover.png` / `inline-1.png` / `inline-2.png` /
   `inline-3.png`. Guardar el campo `url` de la respuesta.
6. **Respond to Webhook**: montar el JSON del contrato con las imágenes
   que sobrevivieron.

## Bloque de estilo de marca (añadir literal al final de cada prompt de imagen)

"Editorial Swiss-grotesk magazine style, clean minimal composition,
neutral background, black and white with electric blue #0d40f5 and signal
orange #ff5c39 accents only, abstract conceptual illustration, no
rendered text, no words, no letters, no third-party logos."

## Checklist de aceptación (córrela tú mismo antes de dar el workflow por bueno)

​```bash
URL="<url-del-webhook>"; SECRET="<WEBHOOK_SECRET>"
# 1. Sin secreto → 401
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$URL" -H 'content-type: application/json' -d '{}'
# 2. Payload inválido → 422
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$URL" -H 'content-type: application/json' -H "x-webhook-secret: $SECRET" -d '{"slug":"x"}'
# 3. Happy path → 200 con el shape del contrato y URLs de blob accesibles
curl -s -X POST "$URL" -H 'content-type: application/json' -H "x-webhook-secret: $SECRET" -d '{
  "slug":"acceptance-test","lang":"es","title":"Arquitectura hexagonal en Python",
  "description":"Prueba de aceptación del workflow de imágenes.",
  "pillar":"arquitectura","tags":["arquitectura","python"],
  "content":"Intro.\n\n## El problema\n\nTexto.\n\n## La solución\n\nMás texto.",
  "maxInlineImages":2}'
​```

Criterios: (3) devuelve `cover.url` y `inline[*].url` bajo
`…/posts/acceptance-test/…`; cada `afterHeading` existe verbatim en el
`content` enviado; los `alt` están en español; las URLs responden 200 y
son imágenes; ninguna imagen contiene texto renderizado. Avisa a Jorge de
que borre `posts/acceptance-test/` del Blob al terminar.
```

- [ ] **Step 5: Verificar y commitear**

```bash
npm run lint
git add .env.example .agent/workflows/new_post.md docs/automation/n8n-post-images.md docs/automation/n8n-workflow-agent-prompt.md
git commit -m "docs(automation): n8n post-images contract, builder-agent prompt, workflow step"
```

---

### Task 5: Verificación final + PR

**Files:** ninguno nuevo (solo fixes si algo falla).

- [ ] **Step 1: Suite completa**

```bash
npm run lint && npm run type-check && npm run seo:audit && npm run build && npm run test:e2e && npm run test:images
```

Expected: todo verde (seo:audit mantiene su warning pre-existente de coverImage faltante).

- [ ] **Step 2: Push + PR**

```bash
git push -u origin feat/post-images-n8n
gh pr create --base develop --title "feat: post images pipeline — n8n webhook client, OG cover hybrid, automation docs" --fill
```
