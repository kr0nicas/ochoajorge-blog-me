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

## Response 200 (síncrona; el cliente espera hasta 5 min)

```json
{
  "cover":  { "url": "https://…blob…/posts/hexagonal-arch-python/cover.png", "alt": "…" },
  "inline": [
    { "url": "https://…/posts/hexagonal-arch-python/inline-1.png", "alt": "…", "afterHeading": "## El problema" }
  ]
}
```

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

```
POST https://www.ochoajorge.me/api/upload?pathname=posts/{slug}/{file}
Authorization: Bearer {UPLOAD_SECRET}
body: bytes de la imagen
```

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
