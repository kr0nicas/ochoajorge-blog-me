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

```bash
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
```

Criterios: (3) devuelve `cover.url` y `inline[*].url` bajo
`…/posts/acceptance-test/…`; cada `afterHeading` existe verbatim en el
`content` enviado; los `alt` están en español; las URLs responden 200 y
son imágenes; ninguna imagen contiene texto renderizado. Avisa a Jorge de
que borre `posts/acceptance-test/` del Blob al terminar.
