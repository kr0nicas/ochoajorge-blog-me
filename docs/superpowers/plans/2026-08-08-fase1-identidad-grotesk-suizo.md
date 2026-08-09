# Fase 1 — Identidad "Grotesk Suizo" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la identidad visual actual (Navy Pro dark / LinkedIn light) por el sistema "Grotesk Suizo": tema claro por defecto, tokens nuevos, terminales de código macOS para MDX, y plantilla OG rediseñada.

**Architecture:** Todo el sistema de color vive en CSS custom properties en `app/globals.css` (light en `:root`, dark en `.dark`, toggled por next-themes con `attribute="class"`). Los componentes consumen `var(--token)`; se conservan los nombres de tokens derivados más usados (`--bg-elevated`, `--brand-light`, `--border-strong`, `--shadow-*`, `--tag-*`) remapeados a la nueva paleta para no tocar ~40 archivos, y se eliminan los tokens/clases glass·glow·gradient junto con el refactor de sus 11 consumidores. Los code blocks MDX se envuelven con un componente cliente `Terminal` vía override de `pre` en `lib/mdx.tsx`, alimentado por un rehype plugin propio que extrae `title` del meta del fence.

**Tech Stack:** Next.js 16 App Router, TypeScript estricto, Tailwind v4 (`@theme` en CSS), next-themes, next-mdx-remote/rsc + rehype-highlight, `next/og` (satori).

## Global Constraints

- TypeScript estricto; **prohibido `any`**.
- **Cero dependencias nuevas de runtime** (los TTF committeados para OG son assets, no dependencias; no añadir paquetes npm).
- Conventional Commits: `feat|fix|chore|content(scope): asunto`.
- No tocar URLs ni estructura de contenido (`content/posts/{es,en}/*.mdx`).
- No adelantar Fase 2 (layout home/cards) ni Fase 3 (interacción): solo identidad.
- Tokens del spec (copiados verbatim):

| Token | Claro | Oscuro |
|---|---|---|
| `--bg-base` | `#ffffff` | `#0c0c0d` |
| `--bg-surface` | `#f4f4f4` | `#161618` |
| `--text-primary` | `#0a0a0a` | `#fafafa` |
| `--text-secondary` | `#4a4a4a` | `#a8a8a8` |
| `--text-muted` | `#8f8f8f` | `#7d7d7d` |
| `--brand` (azul eléctrico) | `#0d40f5` | `#6b8cff` |
| `--accent` (naranja señal) | `#ff5c39` | `#ff7857` |
| `--border` | `#e8e8e8` | `#232326` |

- Uso del color: azul para enlaces/kickers/foco; naranja SOLO señales pequeñas. Nada de glass ni glow; hairlines y sombras suaves.
- Cuerpo del terminal de código SIEMPRE `#0f0f10`, incluso en tema claro.
- Verificación por tarea: `npm run type-check` y `npm run build` (no hay test runner unitario en el repo; la suite es lint + type-check + seo:audit + build + `npm run test:e2e`).

---

### Task 1: Sistema de tokens Grotesk Suizo en globals.css + defaultTheme light

**Files:**
- Modify: `app/globals.css` (reemplazo completo del archivo)
- Modify: `app/[lang]/layout.tsx:20-25` (Archivo weight 700) y `:167` (defaultTheme)

**Interfaces:**
- Produces: clases CSS `.card`, `.tag`, `.prose-blog`, sección `.terminal` NO se define aquí (Task 3). Tokens disponibles para todos los componentes: los 8 core del spec + derivados `--bg-elevated`, `--bg-overlay`, `--brand-light`, `--brand-dark`, `--brand-rgb`, `--accent-rgb`, `--text-on-brand`, `--border-strong`, `--border-brand`, `--shadow-sm/md/lg`, `--shadow-brand`, `--shadow-brand-sm`, `--header-bg`, `--header-border`, `--scrollbar-thumb/track`, `--code-bg`, `--code-color`, `--tag-*`, `--radius-*`, `--transition-*`, `--background`, `--foreground`.
- Produces: quedan ELIMINADOS `--glass-bg`, `--glass-bg-strong`, `--glass-border`, `--shadow-accent`, `--accent-light`, `--accent-dark`, `--bg-elevated` NO (se conserva), y las clases `.glass`, `.glass-strong`, `.card-glass`, `.gradient-text`, `.gradient-text-muted`, `.glow-brand`, `.glow-brand-sm`, `.glow-text-brand`, `.glow-pulse`, `.noise-overlay`, `.bg-grid` y la animación `glowPulse`. Task 2 refactoriza a sus consumidores (hasta entonces habrá un glitch visual transitorio entre commits: aceptable, es una rama).

- [ ] **Step 1: Reemplazar `app/globals.css` completo**

Contenido nuevo íntegro del archivo:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme inline {
    --font-sans: var(--font-archivo), system-ui, sans-serif;
    --font-display: var(--font-space-grotesk), system-ui, sans-serif;
    --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}

@custom-variant dark (&:where(.dark, .dark *));

/* ══════════════════════════════════════════════════════════════
   DESIGN TOKEN SYSTEM — "Grotesk Suizo"
   :root / .light → tema claro (default)
   .dark          → tema oscuro
   Regla: TODO estilo usa estas variables; nunca colores hardcoded
   en componentes. Única excepción: el cuerpo de los terminales de
   código, que es SIEMPRE oscuro (#0f0f10) en ambos temas.
   ══════════════════════════════════════════════════════════════ */

:root {
  /* Radii */
  --radius-sm: 0.375rem;
  --radius-md: 0.625rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: all 0.15s ease;
  --transition-base: all 0.2s ease;
  --transition-medium: all 0.3s ease;
  --transition-slow: all 0.5s ease;
}

/* ─── LIGHT (default) ────────────────────────────────────────── */
:root,
.light {
  --bg-base: #ffffff;
  --bg-surface: #f4f4f4;
  --bg-elevated: #ececec;
  --bg-overlay: rgba(0, 0, 0, 0.4);

  --brand: #0d40f5;
  --brand-light: #3d63f7;
  --brand-dark: #0a33c4;
  --brand-rgb: 13, 64, 245;

  --accent: #ff5c39;
  --accent-rgb: 255, 92, 57;

  --text-primary: #0a0a0a;
  --text-secondary: #4a4a4a;
  --text-muted: #8f8f8f;
  --text-on-brand: #ffffff;

  --border: #e8e8e8;
  --border-strong: #d4d4d4;
  --border-brand: rgba(13, 64, 245, 0.35);

  /* Sombras suaves, sin glow */
  --shadow-sm: 0 1px 2px rgba(10, 10, 10, 0.05);
  --shadow-md: 0 4px 16px rgba(10, 10, 10, 0.08);
  --shadow-lg: 0 12px 32px rgba(10, 10, 10, 0.12);
  --shadow-brand: 0 4px 16px rgba(10, 10, 10, 0.10);
  --shadow-brand-sm: 0 2px 8px rgba(10, 10, 10, 0.08);

  --header-bg: rgba(255, 255, 255, 0.85);
  --header-border: #e8e8e8;

  --scrollbar-thumb: rgba(0, 0, 0, 0.18);
  --scrollbar-track: var(--bg-surface);

  --code-bg: #f0f0f1;
  --code-color: #0a33c4;

  --tag-bg: rgba(13, 64, 245, 0.06);
  --tag-border: rgba(13, 64, 245, 0.2);
  --tag-color: var(--brand);
  --tag-hover-bg: rgba(13, 64, 245, 0.12);
  --tag-hover-border: rgba(13, 64, 245, 0.4);

  --background: var(--bg-base);
  --foreground: var(--text-primary);
}

/* ─── DARK ───────────────────────────────────────────────────── */
.dark {
  --bg-base: #0c0c0d;
  --bg-surface: #161618;
  --bg-elevated: #1b1b1e;
  --bg-overlay: rgba(0, 0, 0, 0.65);

  --brand: #6b8cff;
  --brand-light: #8aa4ff;
  --brand-dark: #5677e6;
  --brand-rgb: 107, 140, 255;

  --accent: #ff7857;
  --accent-rgb: 255, 120, 87;

  --text-primary: #fafafa;
  --text-secondary: #a8a8a8;
  --text-muted: #7d7d7d;
  --text-on-brand: #0a0a0a;

  --border: #232326;
  --border-strong: #2e2e33;
  --border-brand: rgba(107, 140, 255, 0.4);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.45);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.55);
  --shadow-brand: 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-brand-sm: 0 2px 8px rgba(0, 0, 0, 0.4);

  --header-bg: rgba(12, 12, 13, 0.85);
  --header-border: #232326;

  --scrollbar-thumb: rgba(255, 255, 255, 0.14);
  --scrollbar-track: var(--bg-base);

  --code-bg: #1b1b1e;
  --code-color: #8aa4ff;

  --tag-bg: rgba(107, 140, 255, 0.1);
  --tag-border: rgba(107, 140, 255, 0.25);
  --tag-color: var(--brand);
  --tag-hover-bg: rgba(107, 140, 255, 0.18);
  --tag-hover-border: rgba(107, 140, 255, 0.45);

  --background: var(--bg-base);
  --foreground: var(--text-primary);
}

/* ══════════════════════════════════════════════════════════════
   BASE STYLES
   ══════════════════════════════════════════════════════════════ */
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease, color 0.2s ease;
}

/* Escala display: grotesk protagonista con tracking cerrado */
h1, h2, h3 {
  font-family: var(--font-display);
  letter-spacing: -0.02em;
}

/* ─── Custom Scrollbar ───────────────────────────────────────── */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--brand);
}

/* ─── Focus Ring ─────────────────────────────────────────────── */
:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* ─── Selection ──────────────────────────────────────────────── */
::selection {
  background: rgba(var(--brand-rgb), 0.2);
  color: var(--text-primary);
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT CLASSES
   ══════════════════════════════════════════════════════════════ */

/* ─── Cards: superficie plana, hairline, sombra suave ────────── */
.card {
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* ─── Tag Pill: mono, hairline ───────────────────────────────── */
.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.2rem 0.7rem;
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  background: var(--tag-bg);
  border: 1px solid var(--tag-border);
  color: var(--tag-color);
  transition: var(--transition-base);
  text-decoration: none;
  white-space: nowrap;
}

.tag:hover {
  background: var(--tag-hover-bg);
  border-color: var(--tag-hover-border);
}

/* ─── Kicker: etiqueta mono `// tema` ────────────────────────── */
.kicker {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--brand);
}

/* ══════════════════════════════════════════════════════════════
   PROSE — MDX Content Overrides
   ══════════════════════════════════════════════════════════════ */
.prose-blog {
  --tw-prose-body: var(--text-secondary);
  --tw-prose-headings: var(--text-primary);
  --tw-prose-lead: var(--text-secondary);
  --tw-prose-links: var(--brand);
  --tw-prose-bold: var(--text-primary);
  --tw-prose-counters: var(--text-muted);
  --tw-prose-bullets: var(--brand);
  --tw-prose-hr: var(--border);
  --tw-prose-quotes: var(--text-primary);
  --tw-prose-quote-borders: var(--brand);
  --tw-prose-captions: var(--text-muted);
  --tw-prose-code: var(--code-color);
  --tw-prose-pre-code: #d4d4d6;
  --tw-prose-pre-bg: #0f0f10;
  --tw-prose-th-borders: var(--border-strong);
  --tw-prose-td-borders: var(--border);
}

/* Inline code */
.prose-blog code:not(pre code) {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.15em 0.45em;
  font-size: 0.875em;
  color: var(--code-color);
  font-family: var(--font-mono);
}

/* Heading anchor links */
.prose-blog .anchor {
  color: inherit;
  text-decoration: none;
}

.prose-blog .anchor:hover::before {
  content: "#";
  color: var(--brand);
  margin-right: 0.5rem;
}

/* Decorated headings — barra sólida, sin gradiente */
.prose-blog h2 {
  position: relative;
  padding-left: 1rem;
  margin-top: 2.5rem;
}

.prose-blog h2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.1em;
  bottom: 0.1em;
  width: 3px;
  border-radius: 2px;
  background: var(--brand);
}

.prose-blog h3 {
  position: relative;
  padding-left: 0.75rem;
  margin-top: 2rem;
}

.prose-blog h3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.15em;
  bottom: 0.15em;
  width: 2px;
  border-radius: 2px;
  background: var(--brand);
  opacity: 0.5;
}

/* Blockquotes */
.prose-blog blockquote {
  border-left: 3px solid var(--brand);
  background: rgba(var(--brand-rgb), 0.05);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 1rem 1.25rem;
  margin: 1.5rem 0;
  color: var(--text-primary);
  font-style: normal;
}

/* Tables */
.prose-blog table {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.875rem;
}

.prose-blog th {
  background: var(--bg-surface);
  color: var(--text-primary);
  font-weight: 600;
  padding: 0.6rem 1rem;
  text-align: left;
  border: 1px solid var(--border-strong);
}

.prose-blog td {
  padding: 0.6rem 1rem;
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.prose-blog tr:nth-child(even) td {
  background: rgba(var(--brand-rgb), 0.03);
}

/* ══════════════════════════════════════════════════════════════
   ANIMATIONS
   ══════════════════════════════════════════════════════════════ */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-slide-up {
  animation: fadeSlideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ══════════════════════════════════════════════════════════════
   READER MODE
   Triggered by .reader-mode class on <body>
   ══════════════════════════════════════════════════════════════ */
body.reader-mode {
  background-color: var(--bg-base);
}

/* Hide everything except the article */
body.reader-mode header,
body.reader-mode footer,
body.reader-mode aside,
body.reader-mode [data-reader-hide] {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
  height: 0;
  overflow: hidden;
}

/* Remove max-width constraint — let article breathe */
body.reader-mode main {
  display: flex;
  justify-content: center;
  padding-top: 4rem;
  padding-bottom: 6rem;
}

/* Article container — full-width reflow */
body.reader-mode article {
  width: 100%;
  max-width: 72ch;
  margin: 0 auto;
}

/* Remove grid, let article span full */
body.reader-mode .xl\:grid {
  display: block !important;
}

/* Bigger, more comfortable prose */
body.reader-mode .prose-blog {
  font-size: 1.125rem;
  line-height: 1.85;
  --tw-prose-body: var(--text-secondary);
}

body.reader-mode .prose-blog p {
  font-size: 1.125rem;
  line-height: 1.85;
}

body.reader-mode .prose-blog h2 {
  font-size: 1.5rem;
  margin-top: 3rem;
}

body.reader-mode .prose-blog h3 {
  font-size: 1.25rem;
  margin-top: 2.5rem;
}

/* Reading progress bar stays visible */
body.reader-mode [data-reading-progress] {
  opacity: 1 !important;
  height: 0 !important;
  overflow: visible !important;
  pointer-events: auto !important;
}

/* Reader mode exit hint — solo dispositivos con teclado/hover */
body.reader-mode::after {
  content: "ESC para salir";
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: var(--bg-surface);
  color: var(--text-muted);
  border: 1px solid var(--border);
  opacity: 0.7;
  pointer-events: none;
  font-family: var(--font-mono);
}

html[lang="en"] body.reader-mode::after {
  content: "ESC to exit";
}

@media (hover: none), (pointer: coarse) {
  body.reader-mode::after {
    display: none;
  }
}
```

Notas para el implementador:
- La localización del hint y su ocultación en táctiles ya van incluidas arriba (pendiente diferido de Fase 0 — no requiere cambio en `ReaderMode.tsx`).
- NO añadir sección de terminal/hljs aquí: eso es Task 3.

- [ ] **Step 2: `app/[lang]/layout.tsx` — Archivo 700 y defaultTheme light**

En el bloque de `Archivo` (líneas 20-25), añadir `"700"`:

```tsx
const archivo = Archivo({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-archivo",
    display: "swap",
});
```

En la línea 167, cambiar `defaultTheme="dark"` por `defaultTheme="light"`:

```tsx
<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
```

- [ ] **Step 3: Verificar**

Run: `npm run type-check && npm run build`
Expected: ambos exit 0. El build compila aunque queden clases muertas en JSX (`card-glass` etc. simplemente no matchean CSS) — se limpian en Task 2.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css "app/[lang]/layout.tsx"
git commit -m "feat(theme): replace token system with Grotesk Suizo palette, light default"
```

---

### Task 2: Refactor de consumidores de clases glass/gradient

**Files:**
- Modify: `components/blog/PostCard.tsx:20`
- Modify: `components/blog/TableOfContents.tsx:99,116`
- Modify: `components/layout/Hero.tsx:98`
- Modify: `app/[lang]/page.tsx:133-136,181`
- Modify: `app/[lang]/blog/page.tsx:56`
- Modify: `app/[lang]/tags/[tag]/page.tsx:82`
- Modify: `app/[lang]/about/page.tsx:115,254,276,288`
- Modify: `app/[lang]/projects/page.tsx:76`
- Modify: `app/[lang]/uses/page.tsx:358,396`
- Modify: `app/[lang]/admin/upload/page.tsx:67-76,78,81,96-102`

**Interfaces:**
- Consumes: clase `.card` y tokens de Task 1.
- Produces: cero referencias restantes a `card-glass`, `gradient-text`, `glass-bg`, `glow-*` en `app/` y `components/`.

- [ ] **Step 1: Sustituciones exactas**

Regla general: `card-glass` → `card`; `<span className="gradient-text">X</span>` → `<span className="text-[var(--brand)]">X</span>`. Caso por caso:

`components/blog/PostCard.tsx:20`:
```tsx
"card group relative flex flex-col p-6 transition-all duration-300",
```

`components/blog/TableOfContents.tsx:99`:
```tsx
<details className="card mb-8 p-4 xl:hidden">
```
`components/blog/TableOfContents.tsx:116`:
```tsx
className="card hidden p-5 xl:block"
```

`components/layout/Hero.tsx:98`:
```tsx
<span className="text-[var(--brand)]">Jorge Ochoa</span>
```

`app/[lang]/page.tsx:133-136` — el card del about-teaser pierde glass y orb decorativo:
```tsx
          {/* Surface card, hairline border */}
          <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 transition-all duration-500 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] lg:p-8">
```
(eliminar por completo el `<div>` del "Decorative glow orb" de la línea 136).

`app/[lang]/page.tsx:181`:
```tsx
<span className="font-display text-2xl font-bold text-[var(--brand)]">
```

`app/[lang]/blog/page.tsx:56`:
```tsx
<div className="card flex flex-col items-center justify-center py-24 text-center">
```

`app/[lang]/tags/[tag]/page.tsx:82`:
```tsx
<div className="card p-5">
```

`app/[lang]/about/page.tsx:115`:
```tsx
{isSpanish ? "Arquitecto de Tecnología para" : "Technology Architect for"}{" "}<span className="text-[var(--brand)]">{isSpanish ? "sistemas a escala" : "systems at scale"}</span>.
```
`app/[lang]/about/page.tsx:254,276,288`: `card-glass` → `card` (tres ocurrencias, mismo patrón `<div className="card p-6">`).

`app/[lang]/projects/page.tsx:76`:
```tsx
{isSpanish ? "Proyectos &" : "Projects &"} <span className="text-[var(--brand)]">{isSpanish ? "Creaciones" : "Creations"}</span>
```

`app/[lang]/uses/page.tsx:358`:
```tsx
<span className="text-[var(--brand)]">
```
`app/[lang]/uses/page.tsx:396`:
```tsx
className="group card p-5 transition-all duration-200 hover:border-[var(--border-strong)]"
```

`app/[lang]/admin/upload/page.tsx:78`: `card-glass` → `card`. Línea 81:
```tsx
Upload to <span className="text-[var(--brand)]">Vercel Blob</span>
```

- [ ] **Step 2: aria-labels en admin/upload (pendiente diferido Fase 0)**

Input de secreto (líneas 67-76), añadir `aria-label`:
```tsx
<input
    type="password"
    value={secret}
    aria-label="Upload secret"
    onChange={(e) => {
        setSecret(e.target.value);
        sessionStorage.setItem("upload-secret", e.target.value);
    }}
    placeholder="Upload secret"
    className="mb-6 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-primary)]"
/>
```

Input de archivo (líneas 96-102):
```tsx
<input
    type="file"
    className="hidden"
    ref={fileInputRef}
    onChange={handleUpload}
    accept="image/*"
    aria-label="Select image to upload"
/>
```

- [ ] **Step 3: Verificar cero referencias muertas**

Run: `rg -n "card-glass|gradient-text|glow-brand|glow-pulse|glass-bg|glass-strong|noise-overlay|bg-grid|glow-text" app components lib`
Expected: sin resultados (exit 1).

Run: `npm run type-check && npm run build`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add components app
git commit -m "feat(ui): migrate glass/gradient consumers to Grotesk Suizo card system"
```

---

### Task 3: Componente Terminal para code blocks MDX

**Files:**
- Create: `lib/rehype-code-meta.ts`
- Create: `components/mdx/Terminal.tsx`
- Modify: `lib/mdx.tsx` (registrar plugin + override de `pre`)
- Modify: `app/[lang]/layout.tsx:11` (eliminar import de `highlight.js/styles/github-dark.css`)
- Modify: `app/globals.css` (añadir sección TERMINAL + paleta hljs; borrar overrides muertos de `[data-rehype-pretty-code-*]` — ya no existen tras Task 1, verificar)
- Delete: `components/blog/CodeBlock.tsx` (dead code: referenciaba rehype-pretty-code, que este repo no usa; nadie lo importa)

**Interfaces:**
- Consumes: pipeline MDX de `lib/mdx.tsx` (`rehypeHighlight` ya instalado).
- Produces: `rehypeCodeMeta(): (tree) => void` — plugin sin opciones que copia el meta del fence a `data-title`/`data-language` en el `<pre>`. `Terminal` — client component usado como override de `pre`; props: atributos estándar de `<pre>` más `"data-title"?: string` y `"data-language"?: string`.

- [ ] **Step 1: Crear `lib/rehype-code-meta.ts`**

```ts
/**
 * Rehype plugin: copies the code fence meta (```python title="worker.py")
 * onto the <pre> element as data attributes so the MDX `pre` override
 * (Terminal) can render a titled terminal window.
 *
 * Must run BEFORE rehype-highlight (which rewrites the <code> children).
 */

interface HastElement {
    type: string;
    tagName?: string;
    children?: HastElement[];
    data?: { meta?: string };
    properties?: Record<string, unknown>;
}

const TITLE_RE = /(?:title|filename)="([^"]+)"/;
const LANG_RE = /language-(\S+)/;

function extractLanguage(code: HastElement): string | undefined {
    const className = code.properties?.className;
    const classes = Array.isArray(className) ? className.map(String) : [String(className ?? "")];
    for (const cls of classes) {
        const match = LANG_RE.exec(cls);
        if (match) return match[1];
    }
    return undefined;
}

function visit(node: HastElement): void {
    if (node.tagName === "pre" && node.children) {
        const code = node.children.find((child) => child.tagName === "code");
        if (code) {
            const meta = code.data?.meta ?? "";
            const title = TITLE_RE.exec(meta)?.[1];
            const language = extractLanguage(code);
            node.properties = {
                ...node.properties,
                ...(title ? { dataTitle: title } : {}),
                ...(language ? { dataLanguage: language } : {}),
            };
        }
    }
    for (const child of node.children ?? []) visit(child);
}

export function rehypeCodeMeta() {
    return (tree: HastElement) => {
        visit(tree);
    };
}
```

- [ ] **Step 2: Crear `components/mdx/Terminal.tsx`**

```tsx
"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

interface TerminalProps extends React.HTMLAttributes<HTMLPreElement> {
    "data-title"?: string;
    "data-language"?: string;
}

/**
 * Terminal — macOS-style window wrapper for MDX code blocks.
 * Dark body always (#0f0f10 via .terminal-body), even in light theme.
 * Filename comes from the fence meta (```python title="worker.py")
 * injected by lib/rehype-code-meta.ts as data attributes.
 */
export function Terminal({
    "data-title": title,
    "data-language": language,
    children,
    ...rest
}: TerminalProps) {
    const preRef = useRef<HTMLPreElement>(null);
    const [copied, setCopied] = useState(false);
    const label = title ?? (language ? `${language}` : "terminal");

    const handleCopy = async () => {
        const text = preRef.current?.textContent ?? "";
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard access denied — silent fail */
        }
    };

    return (
        <figure className="terminal">
            <div className="terminal-bar">
                <span className="terminal-dot terminal-dot-red" aria-hidden="true" />
                <span className="terminal-dot terminal-dot-yellow" aria-hidden="true" />
                <span className="terminal-dot terminal-dot-green" aria-hidden="true" />
                <span className="terminal-name">{label}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? "Copied" : "Copy code"}
                    className="terminal-copy"
                >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? "ok" : "copy"}</span>
                </button>
            </div>
            <pre ref={preRef} {...rest}>
                {children}
            </pre>
        </figure>
    );
}
```

- [ ] **Step 3: Wire en `lib/mdx.tsx`**

Archivo completo resultante:

```tsx
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import type { ReactElement } from "react";
import { FileTree } from "@/components/mdx/FileTree";
import { Terminal } from "@/components/mdx/Terminal";
import { rehypeCodeMeta } from "@/lib/rehype-code-meta";
import {
    Callout,
    ComparisonTable,
    Steps,
    Step,
    CodeComparison,
} from "@/components/mdx/MDXComponents";

interface MDXResult {
    content: ReactElement;
}

/**
 * Custom MDX components available in all posts.
 * Import-once here, available everywhere in MDX without explicit imports.
 */
const mdxComponents = {
    // Interactive layout components
    FileTree,
    Callout,
    ComparisonTable,
    Steps,
    Step,
    CodeComparison,
    // Every fenced code block renders inside a Terminal window
    pre: Terminal,
};

/**
 * Compile MDX content with all plugins and custom components applied server-side.
 * Uses next-mdx-remote/rsc for full Turbopack compatibility.
 */
export async function compileMDXContent(source: string): Promise<MDXResult> {
    const { content } = await compileMDX<{ title: string }>({
        source,
        components: mdxComponents,
        options: {
            parseFrontmatter: false, // Already parsed by gray-matter in posts.ts
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["anchor"] } }],
                    rehypeCodeMeta,
                    rehypeHighlight,
                ],
            },
        },
    });

    return { content };
}
```

- [ ] **Step 4: Quitar el theme CSS de highlight.js del layout**

En `app/[lang]/layout.tsx` eliminar la línea:
```tsx
import "highlight.js/styles/github-dark.css";
```

- [ ] **Step 5: Estilos de terminal + paleta hljs en `app/globals.css`**

Añadir al final de la sección COMPONENT CLASSES (después de `.kicker`):

```css
/* ─── Terminal: ventana macOS para code blocks MDX ───────────── */
/* El cuerpo es SIEMPRE oscuro (#0f0f10), también en tema claro:
   el código es protagonista visual y flota con sombra. */
.terminal {
  margin: 1.5rem 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.35);
  box-shadow: 0 12px 32px rgba(10, 10, 10, 0.18);
}

.dark .terminal {
  border-color: #232326;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55);
}

.terminal-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  background: #1b1b1e;
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: block;
}

.terminal-dot-red { background: #ff5f57; }
.terminal-dot-yellow { background: #febc2e; }
.terminal-dot-green { background: #28c840; }

.terminal-name {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #8f8f8f;
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.terminal-copy {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: #8f8f8f;
  border: 1px solid #333;
  padding: 2px 8px;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  transition: var(--transition-fast);
}

.terminal-copy:hover {
  color: #fafafa;
  border-color: #555;
}

.terminal pre {
  margin: 0;
  background: #0f0f10;
  padding: 1rem 1.125rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.75;
  color: #d4d4d6;
}

.terminal pre code {
  background: transparent;
  border: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
}

/* ─── Syntax highlighting (highlight.js) sobre #0f0f10 ───────── */
/* Paleta alineada a la identidad: azul / naranja / verde */
.hljs {
  color: #d4d4d6;
  background: transparent;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-built_in,
.hljs-type {
  color: #6b8cff;
}

.hljs-title,
.hljs-title.function_,
.hljs-title.class_,
.hljs-function {
  color: #9db4ff;
}

.hljs-string,
.hljs-regexp,
.hljs-addition {
  color: #7bd88f;
}

.hljs-number,
.hljs-literal,
.hljs-symbol,
.hljs-attr,
.hljs-attribute,
.hljs-deletion {
  color: #ff7857;
}

.hljs-comment,
.hljs-quote,
.hljs-meta {
  color: #6f6f75;
  font-style: italic;
}

.hljs-variable,
.hljs-template-variable,
.hljs-name,
.hljs-selector-class,
.hljs-selector-id,
.hljs-params,
.hljs-property {
  color: #d4d4d6;
}

.hljs-emphasis { font-style: italic; }
.hljs-strong { font-weight: 700; }
```

Además, en `.prose-blog` los `pre` sin figure ya no existen (todos pasan por Terminal), pero verificar que no quede ningún selector `[data-rehype-pretty-code-figure]` ni `[data-rehype-pretty-code-title]` en globals.css (Task 1 los eliminó; confirmar con `rg "rehype-pretty" app/globals.css` → sin resultados).

- [ ] **Step 6: Borrar `components/blog/CodeBlock.tsx`**

```bash
git rm components/blog/CodeBlock.tsx
```
(Antes verificar que nadie lo importa: `rg -n "from.*CodeBlock|import.*CodeBlock" app components lib` → solo el propio archivo.)

- [ ] **Step 7: Verificar render real**

Run: `npm run type-check && npm run build`
Expected: exit 0.

Run: `npm run dev` en background, abrir un post con code fences (ej. `/es/blog/orchestrator-worker-multi-agente-produccion`) y comprobar en el HTML servido: `class="terminal"`, barra con 3 dots, `<pre>` con fondo `#0f0f10`, y que un fence con `title="..."` muestra el nombre. Cerrar dev server.

Nota: los posts existentes no usan `title=` en fences todavía — el fallback muestra el lenguaje (`python`, `bash`…). No editar posts en esta fase.

- [ ] **Step 8: Commit**

```bash
git add lib/rehype-code-meta.ts components/mdx/Terminal.tsx lib/mdx.tsx "app/[lang]/layout.tsx" app/globals.css
git rm -q components/blog/CodeBlock.tsx 2>/dev/null || true
git commit -m "feat(mdx): terminal-window code blocks with fence title and copy button"
```

---

### Task 4: Plantilla OG Grotesk Suizo (post + raíz)

**Files:**
- Create: `assets/og-fonts/SpaceGrotesk-Bold.ttf` (descargado, committeado)
- Create: `assets/og-fonts/JetBrainsMono-Regular.ttf` (descargado, committeado)
- Create: `lib/og-template.tsx` (template compartido)
- Modify: `app/[lang]/blog/[slug]/opengraph-image.tsx` (reemplazo completo)
- Modify: `app/opengraph-image.tsx` (reemplazo completo)

**Interfaces:**
- Consumes: `getPostBySlug(slug: string, lang: string)` de `lib/posts.ts`; `siteConfig` de `lib/utils.ts`.
- Produces: `renderOgImage(opts: { title: string; pillar: string; readingTime?: number | null }): Promise<ImageResponse>` en `lib/og-template.tsx`, y `loadOgFonts(): Promise<{ spaceGrotesk: Buffer; jetbrainsMono: Buffer }>`.

- [ ] **Step 1: Descargar fuentes estáticas (OFL) y committearlas**

```bash
mkdir -p assets/og-fonts
curl -fsSL -o assets/og-fonts/SpaceGrotesk-Bold.ttf \
  "https://github.com/floriankarsten/space-grotesk/raw/master/fonts/ttf/SpaceGrotesk-Bold.ttf"
curl -fsSL -o assets/og-fonts/JetBrainsMono-Regular.ttf \
  "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Regular.ttf"
file assets/og-fonts/*.ttf
```
Expected: ambos reportan `TrueType Font data`. (Si una URL falla, las mismas familias están en `https://github.com/google/fonts/tree/main/ofl/` — usar los TTF estáticos, NO los variable `[wght]`, que satori no soporta.)

- [ ] **Step 2: Crear `lib/og-template.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

/** Blue vs orange glow, deterministic per pillar (first tag). */
function pillarHue(pillar: string): "blue" | "orange" {
    let sum = 0;
    for (const char of pillar) sum += char.charCodeAt(0);
    return sum % 2 === 0 ? "blue" : "orange";
}

async function loadOgFonts() {
    const dir = path.join(process.cwd(), "assets", "og-fonts");
    const [spaceGrotesk, jetbrainsMono] = await Promise.all([
        readFile(path.join(dir, "SpaceGrotesk-Bold.ttf")),
        readFile(path.join(dir, "JetBrainsMono-Regular.ttf")),
    ]);
    return { spaceGrotesk, jetbrainsMono };
}

interface OgOptions {
    title: string;
    pillar: string;
    readingTime?: number | null;
}

/**
 * Grotesk Suizo OG template: #0c0c0d background, subtle grid, radial glow
 * (blue or orange alternating by pillar), mono kicker `// pillar`,
 * Space Grotesk title, ochoajorge.me brand mark.
 */
export async function renderOgImage({ title, pillar, readingTime }: OgOptions) {
    const { spaceGrotesk, jetbrainsMono } = await loadOgFonts();
    const hue = pillarHue(pillar);
    const glow =
        hue === "blue"
            ? "radial-gradient(circle, rgba(13,64,245,0.45), transparent 65%)"
            : "radial-gradient(circle, rgba(255,92,57,0.4), transparent 65%)";
    // Kicker uses the opposite accent so it always pops against the glow
    const kickerColor = hue === "blue" ? "#ff7857" : "#6b8cff";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "72px 80px",
                    background: "#0c0c0d",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Subtle grid */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(107,140,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(107,140,255,0.08) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />

                {/* Radial glow — blue or orange by pillar */}
                <div
                    style={{
                        position: "absolute",
                        width: "720px",
                        height: "640px",
                        right: "-180px",
                        top: "-240px",
                        background: glow,
                    }}
                />

                {/* Brand mark */}
                <div
                    style={{
                        position: "absolute",
                        top: "56px",
                        left: "80px",
                        fontFamily: "JetBrains Mono",
                        fontSize: "22px",
                        color: "#8f8f8f",
                    }}
                >
                    ochoajorge.me
                </div>

                {/* Kicker */}
                <div
                    style={{
                        position: "relative",
                        fontFamily: "JetBrains Mono",
                        fontSize: "24px",
                        color: kickerColor,
                        marginBottom: "18px",
                    }}
                >
                    {`// ${pillar}`}
                </div>

                {/* Title */}
                <div
                    style={{
                        position: "relative",
                        fontFamily: "Space Grotesk",
                        fontWeight: 700,
                        fontSize: title.length > 60 ? "56px" : "68px",
                        lineHeight: 1.08,
                        letterSpacing: "-0.02em",
                        color: "#fafafa",
                        maxWidth: "980px",
                    }}
                >
                    {title}
                </div>

                {/* Reading time */}
                {readingTime ? (
                    <div
                        style={{
                            position: "relative",
                            marginTop: "28px",
                            fontFamily: "JetBrains Mono",
                            fontSize: "20px",
                            color: "#7d7d7d",
                        }}
                    >
                        {`${readingTime} min`}
                    </div>
                ) : null}
            </div>
        ),
        {
            ...OG_SIZE,
            fonts: [
                { name: "Space Grotesk", data: spaceGrotesk, weight: 700, style: "normal" },
                { name: "JetBrains Mono", data: jetbrainsMono, weight: 400, style: "normal" },
            ],
        }
    );
}
```

- [ ] **Step 3: Reemplazar `app/[lang]/blog/[slug]/opengraph-image.tsx` completo**

```tsx
import { getPostBySlug } from "@/lib/posts";
import { renderOgImage, OG_SIZE } from "@/lib/og-template";

// No edge runtime — getPostBySlug and font loading use fs (Node.js)
export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = "image/png";

interface Props {
    params: Promise<{ slug: string; lang: string }>;
}

/** Dynamic OG image for individual blog posts — Grotesk Suizo template. */
export default async function Image({ params }: Props) {
    const { slug, lang } = await params;
    const post = getPostBySlug(slug, lang);

    return renderOgImage({
        title: post?.title ?? "Blog Post",
        pillar: post?.tags?.[0] ?? "blog",
        readingTime: post?.readingTime,
    });
}
```

Nota: si `type-check` marca que `post.readingTime` no es `number | null | undefined`, ajustar el tipo de `OgOptions.readingTime` al tipo real de `Post` en `lib/types.ts` — no castear.

- [ ] **Step 4: Reemplazar `app/opengraph-image.tsx` completo**

```tsx
import { renderOgImage, OG_SIZE } from "@/lib/og-template";
import { siteConfig } from "@/lib/utils";

// Node runtime required: the shared template reads font files with fs
export const alt = "Jorge Ochoa — Software Architect & Writer";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Root OG image — homepage and any page without a specific image. */
export default async function Image() {
    return renderOgImage({
        title: siteConfig.title,
        pillar: "blog",
    });
}
```

Importante: el archivo actual declara `export const runtime = "edge"` — NO conservarlo (el template lee TTFs con `fs`).

- [ ] **Step 5: Verificar render**

Run: `npm run type-check && npm run build`
Expected: exit 0.

Run: `npm run dev` en background; `curl -s -o /tmp/og-post.png -w "%{http_code}" http://localhost:3000/es/blog/orchestrator-worker-multi-agente-produccion/opengraph-image` y lo mismo para `http://localhost:3000/opengraph-image`.
Expected: `200` ambas; abrir los PNG (Read tool) y confirmar: fondo #0c0c0d, grid, glow, kicker `// {pilar}`, título en Space Grotesk, marca `ochoajorge.me`. Cerrar dev server.

- [ ] **Step 6: Commit**

```bash
git add assets/og-fonts lib/og-template.tsx "app/[lang]/blog/[slug]/opengraph-image.tsx" app/opengraph-image.tsx
git commit -m "feat(og): Grotesk Suizo OG template with pillar-alternating glow"
```

---

### Task 5: Verificación final de la fase

**Files:** ninguno nuevo (solo fixes que surjan).

- [ ] **Step 1: Suite completa**

```bash
npm run lint
npm run type-check
npm run seo:audit
npm run build
npm run test:e2e
```
Expected: todo exit 0. `test:e2e` (script `scripts/e2e-check.mjs`) puede requerir el server — seguir lo que indique el propio script.

- [ ] **Step 2: Revisión visual en Chrome (claro Y oscuro)**

Con `npm run dev` corriendo, revisar en Chrome:
- Home `/es` — claro y oscuro (toggle del header).
- Listado `/es/blog` — claro y oscuro.
- Un post con código (`/es/blog/orchestrator-worker-multi-agente-produccion`) — claro y oscuro: terminales siempre oscuros, tokens correctos, sin restos glass.
- Verificar que el primer load sin preferencia guardada abre en CLARO.

- [ ] **Step 3: Commit de fixes (si los hay) y push**

```bash
git push -u origin HEAD
gh pr create --base develop --title "feat(theme): Fase 1 — identidad Grotesk Suizo" --body "..."
```
El PR va contra `develop`, nunca `main`.

---

## Self-Review (hecho al escribir el plan)

- Alcance del spec Fase 1 cubierto: tokens+defaultTheme (T1), refactor glass (T2), Terminal+syntax (T3), OG (T4). Pendientes diferidos de Fase 0: Archivo 700 (T1), hint ESC táctil+i18n (T1, CSS), aria-labels upload (T2).
- Los scripts estáticos de OG NO se tocan (el prompt de Fase 1 no los incluye; spec los limpia en Fase 4).
- Tokens derivados conservados con valores nuevos para no tocar ~40 archivos que usan `--bg-elevated`/`--brand-light`/etc. — el reemplazo es íntegro en valores, no en nombres.
- `pre: Terminal` en mdxComponents: next-mdx-remote acepta overrides de elementos HTML en `components`.
- Sin dependencias nuevas: el rehype plugin es propio (sin `unist-util-visit` directo), las fuentes OG son assets committeados.
