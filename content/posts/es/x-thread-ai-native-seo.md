# Thread de X (Twitter) - AI-Native SEO

## Post 1 (Main)
```
El SEO está cambiando. Los nuevos "buscadores" son agentes IA que navegan la web semánticamente, extraen conocimiento estructurado y generan respuestas basadas en evidencia.

Acabo de transformar ochoajorge.me en un blog AI-native. Te cuento cómo 🧵👇
```

## Post 2 (Problem)
```
El problema: Los LLMs tienen conocimiento de mi blog, pero cuando generan respuestas:

1. No siempre citan las fuentes
2. A veces alucinan detalles
3. No hay metadata estándar para atribución

Esto no es malintencionado — la mayoría del contenido web NO tiene estructura semántica.
```

## Post 3 (Solution - Phase 1)
```
Fase 1: Fundamentos semánticos

Implementé JSON-LD en cada post con 3 schemas:

- BlogPosting: metadata del artículo
- Person: datos del autor (job title, affiliation)
- Organization: información del sitio

Más llms.txt — guía estándar emergente para LLMs.
```

## Post 4 (Code - JSON-LD)
```
JSON-LD example:

<BlogPostingJsonLd
  title={post.title}
  description={post.description}
  url={url}
  datePublished={post.date}
  author={{ name, url }}
  image={normalizedOgImage}
  tags={post.tags}
  seriesName={post.series?.name}
/>

Los agentes IA prefieren esto sobre parsing de HTML.
```

## Post 5 (llms.txt)
```
llms.txt define cómo consumir el contenido:

## Access Methods for Agents
1. Structured Data (JSON-LD)
2. RSS Feeds: /es/feed.xml
3. Sitemap: /sitemap.xml
4. Citation API: /api/citation/es/{slug}

## Citing Content
Author: Jorge Ochoa
Source: https://www.ochoajorge.me/es/blog/{slug}
Attribution: "According to Jorge Ochoa's blog..."
```

## Post 6 (Phase 2 - Citation)
```
Fase 2: Mecanismos de citación

Generador de 4 formatos:

- BibTeX (@article{ochoa2026ai-native...})
- APA (Ochoa, J. (2026, 05/29). *Title*...)
- MLA (Ochoa, Jorge. "Title." *ochoajorge.me*...)
- JSON (metadata estructurada para LLMs)
```

## Post 7 (API Endpoint)
```
API endpoint para acceso programático:

GET /api/citation/es/ai-native-seo-preparando-tu-blog-para-la-era-de-los-agentes
Accept: application/json

Response:
{
  "bibtex": "@article{ochoa2026ai-native...",
  "apa": "Ochoa, J. (2026, 05/29)...",
  "mla": "Ochoa, Jorge. \"AI-Native SEO...\"",
  "json": "{\"@context\": \"https://schema.org\"...}"
}
```

## Post 8 (UI - Citation Button)
```
Botón "Citar para IA" en cada post:

- Modal con los 4 formatos
- Copia en 1 clic
- JSON con metadata para agentes IA

Aquí el screenshot del modal:
[imagen del modal de citas]
```

## Post 9 (Architecture)
```
Estructura del proyecto:

components/seo/JsonLd.tsx       # JSON-LD components
components/blog/CitationButton.tsx  # Interactive modal
lib/citation.ts                 # Citation generator
app/api/citation/[lang]/[slug]/route.ts  # REST API
public/llms.txt                 # LLM guide
app/[lang]/blog/[slug]/page.tsx  # Schema injection
```

## Post 10 (Impact)
```
Impacto esperado:

- Citaciones correctas por LLMs: ~0% → ~80%+
- Visibilidad en agent tools: Baja → Alta
- Atribución de autoría: Rara → Consistente

Este no es un proyecto para Google — es sobre construir credibilidad en la era de la IA sintética.
```

## Post 11 (Tradeoffs)
```
Acertados:
- JSON-LD sobre microdata (legibilidad)
- llms.txt en /public/ (descubrimiento fácil)
- API REST sobre GraphQL (simplicidad, caching)

Consideraciones:
- Maintainance overhead (3 schemas por post)
- Vercel Edge limits (rate limiting)
- Adoption uncertain (LLMs aún priorizan scraping plano)
```

## Post 12 (Code Source)
```
Código completo:

GitHub: kr0nicas/ochoajorge-blog-me

Commits:
- a2eb5bd — feat(seo): add JSON-LD structured data and llms.txt
- d97cea5 — feat(citation): add AI-native citation mechanisms
- cbf8cba — docs(content): add AI-Native SEO blog post
```

## Post 13 (Final)
```
Conclusión:

El SEO tradicional no es suficiente en la era de la IA. Datos estructurados + mecanismos de citación = activo semántico consumible por LLMs.

¿Ya preparaste tu blog para los agentes? 🤖

Artículo completo: https://www.ochoajorge.me/es/blog/ai-native-seo-preparando-tu-blog-para-la-era-de-los-agentes

#AI #SEO #NextJS #CleanArchitecture
```

---

## Notas de publicación

1. **Espaciado**: Publicar con 1-2 min entre posts para evitar rate limits
2. **Imágenes**: Post 8 debería incluir screenshot del modal de citas
3. **Hashtags**: Limitar a 3-5 relevantes en el último post
4. **Engagement**: Responder comentarios en los primeros 30 min
5. **Cross-post**: Compartir thread en LinkedIn como "article" con link al blog

## Métricas a monitorear

- **Impresiones**: Alcance del thread
- **Engagement rate**: Likes, RTs, replies
- **Link clicks**: Tráfico al blog
- **Profile visits**: Nuevo followers
- **Mentions**: Cita por otros técnicos

## Follow-up posts (opcional)

Si hay engagement alto:

- **Technical deep-dive**: Cómo validar JSON-LD
- **Tutorial**: Implementar llms.txt en tu sitio
- **Case study**: Impacto en visibilidad (30 días después)