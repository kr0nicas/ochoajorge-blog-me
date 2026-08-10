# Imágenes de posts vía n8n + Gemini + Nano Banana

**Fecha:** 2026-08-09
**Estado:** Aprobado por Jorge (brainstorm de esta fecha)
**Alcance:** Lado repo únicamente — script de agente, contrato del webhook, híbrido OG, docs y el prompt para el agente que construye el workflow de n8n. Los dos workflows de n8n (mac-dev y Hetzner) los monta Jorge/su agente siguiendo ese material; no se versionan aquí.

## Objetivo

Cuando cualquier agente del ecosistema (Claude Code en el portátil de trabajo, Claude Code en mac-dev, Hermes en el VPS de Hetzner) crea un post nuevo, invoca una automatización de n8n que analiza el contenido con Gemini, genera imágenes con Nano Banana (modelo de imagen de Gemini), las sube a Vercel Blob vía el `/api/upload` existente, y devuelve las URLs. El agente las integra en el mismo branch `content/<slug>` antes de abrir el PR: el PR nace completo y revisable.

## Decisiones validadas

| Decisión | Elección |
|---|---|
| Propósito de las imágenes | Cover del post + ilustraciones inline + la cover alimenta la OG (híbrido) y sirve como asset de redes |
| OG vs cover | **Híbrido:** la cover generada se integra como capa de arte dentro de la plantilla `next/og` de Fase 1 (título, kicker `// {pilar}` y marca encima). Nada de reemplazar la plantilla |
| Trigger | El agente llama al webhook explícitamente como paso del workflow `new_post`, ANTES de abrir el PR |
| Topología | **Dos n8n con el mismo workflow:** mac-dev (lo usan portátil y mac-dev) y Hetzner (lo usa Hermes). Cada máquina configura su URL en env |
| Storage | Vercel Blob vía `/api/upload` + `UPLOAD_SECRET` (patrón existente). El MDX referencia URLs; el repo no engorda |
| Contrato | **Síncrono:** el agente POSTea y espera la respuesta con las URLs (timeout 5 min) |
| Entregables | Solo lado repo + **prompt autocontenido para el agente constructor del workflow de n8n** |

## Contrato del webhook

Request — `POST {N8N_IMAGES_WEBHOOK_URL}`, header `X-Webhook-Secret: {N8N_IMAGES_WEBHOOK_SECRET}`, JSON:

```json
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
```

Response `200` (síncrona, hasta ~5 min):

```json
{
  "cover":  { "url": "https://….blob.vercel-storage.com/posts/<slug>/cover.png", "alt": "…" },
  "inline": [
    { "url": "https://…/posts/<slug>/inline-1.png", "alt": "…", "afterHeading": "## El problema" }
  ]
}
```

- `alt` en el idioma del post. `afterHeading` es el heading EXACTO del `content` tras el cual va la imagen.
- Errores: `401` secreto inválido, `422` payload inválido (campos faltantes, pillar desconocido), `5xx` fallo upstream. Fallos parciales dentro de n8n (una inline falla): responder `200` con lo que haya — `cover` puede ser `null` si solo ella falló.
- Estilo de marca fijo en los prompts de imagen (lo redacta Gemini dentro de n8n, con bloque de estilo obligatorio): editorial Grotesk Suizo, paleta blanco/negro con acentos azul eléctrico `#0d40f5` y naranja señal `#ff5c39`, sin texto renderizado dentro de la imagen, composición limpia tipo revista de diseño.
- Naming en Blob: `posts/<slug>/cover.png`, `posts/<slug>/inline-N.png`.

## Componentes (lado repo)

### 1. `scripts/post-images.mjs` — `npm run post:images -- <slug> [es|en]`

- Lee `content/posts/{lang}/{slug}.mdx` con gray-matter; valida que existe.
- Env: `N8N_IMAGES_WEBHOOK_URL`, `N8N_IMAGES_WEBHOOK_SECRET` (`.env.local` por máquina; Hermes las tiene en su entorno del VPS apuntando al n8n de Hetzner).
- POST síncrono con timeout de 5 minutos.
- Con respuesta `200`:
  - Parchea frontmatter: `coverImage` (+ `coverImageAlt`). Si `cover` es `null` (fallo parcial), no toca el frontmatter y procesa solo las inline.
  - Inserta `![alt](url)` inmediatamente después de cada heading que casa EXACTO con `afterHeading`; si no casa, imprime el bloque listo para pegar y lo señala.
- Idempotencia: si el post ya tiene `coverImage`, no hace nada salvo `--force`.
- Degradación: sin env vars, webhook caído, timeout o no-200 → mensaje claro y `exit 0`. La publicación NUNCA se bloquea por imágenes (el warning existente de `seo:audit` sigue siendo el recordatorio).

### 2. Híbrido OG — `lib/og-template.tsx`

- Parámetro opcional `coverUrl`. Con él: panel de arte ≈40% derecho con degradado hacia `#0c0c0d` para mantener legibles título/kicker/marca. Sin él: plantilla idéntica a la actual (cero cambios para los posts existentes).
- `opengraph-image.tsx` pasa `post.coverImage`. Cards y redes heredan el arte automáticamente (la OG dinámica ya es el thumbnail de cards).

### 3. `/api/upload` — soporte de pathname

- Si la ruta actual no permite indicar `posts/<slug>/…` como destino en Blob, se añade un parámetro `pathname` (validado: sin `..`, prefijo permitido) manteniendo el Bearer `UPLOAD_SECRET`.

### 4. Docs

- `.agent/workflows/new_post.md`: paso nuevo `npm run post:images -- <slug> <lang>` entre escribir y auditar, con la regla de no-bloqueo.
- `docs/automation/n8n-post-images.md`: el contrato formal (este documento operativizado: schemas, auth, estilo, naming, códigos de error).
- `docs/automation/n8n-workflow-agent-prompt.md`: **prompt autocontenido para el agente que construye el workflow en n8n.** Incluye: contrato completo, secuencia de nodos sugerida (Webhook → validar secreto y payload → Gemini texto redacta N prompts con el bloque de estilo → loop Nano Banana → subida por imagen a `/api/upload` con `UPLOAD_SECRET` → Respond to Webhook), manejo de errores (401/422/parciales), y checklist de aceptación con comandos `curl` que el agente puede ejecutar contra su propio workflow para autovalidarse.
- `.env.example`: `N8N_IMAGES_WEBHOOK_URL=`, `N8N_IMAGES_WEBHOOK_SECRET=`.

## Verificación

- **Script:** test contra un mock webhook local (server node efímero con respuesta válida): parcheo de frontmatter, inserción tras heading, heading-no-casa, idempotencia/`--force`, exit 0 con webhook caído. Corre en la suite sin n8n real.
- **OG:** `npm run build` + revisión visual de la OG de un post con `coverImage` y otro sin ella (sin regresión).
- **E2E real:** cuando el workflow de mac-dev exista, correr el `curl` de aceptación del prompt y un `npm run post:images` real contra un post de prueba.
- Suite completa verde: `lint`, `type-check`, `seo:audit`, `build`, `test:e2e`.

## Riesgos

- **Coste/cuota de Gemini:** cada post consume generación de texto + 3-4 imágenes. Mitigación: `maxInlineImages` con default 3 y la idempotencia del script (no regenera sin `--force`).
- **Deriva entre las dos instancias de n8n:** mismo workflow montado dos veces a mano. Mitigación: el prompt del agente constructor + checklist de aceptación son la fuente de verdad; cualquier cambio de contrato se versiona en `docs/automation/` primero.
- **Heading matching frágil:** si Gemini devuelve `afterHeading` que no casa exacto, la imagen no se inserta sola. Mitigación aceptada: el script la imprime y el agente la coloca; el PR review es la red final.
- **Blob público:** las URLs de Blob son públicas por diseño (igual que las imágenes actuales del blog). Sin dato sensible en juego.

## Acciones de Jorge

- Montar el workflow en los dos n8n usando `docs/automation/n8n-workflow-agent-prompt.md` (su agente constructor).
- Credencial de Gemini API en ambas instancias de n8n.
- Definir `N8N_IMAGES_WEBHOOK_SECRET` (uno por instancia) y repartir las env vars a portátil, mac-dev y el entorno de Hermes.
