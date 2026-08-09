# Fase 1.5 — Secciones por dolor ("Temas")

**Fecha:** 2026-08-08
**Estado:** Aprobado por Jorge (brainstorm en sesión; opción A de tres taxonomías candidatas)
**Alcance:** Taxonomía de secciones orientadas a problemas del lector, landings por sección, campo `pillar` en frontmatter, integración con OG. Se entrega ANTES de la Fase 2 del rediseño (la home nueva se construirá sobre estas secciones).

## Objetivo

Que cada tipo de lector (tech lead/arquitecto, dev construyendo con IA, dev backend/plataforma, técnico general) encuentre una "puerta" que nombra SU problema, en vez de navegar una nube de 50 tags y un listado cronológico plano. Las secciones dan coherencia editorial al sitio y alimentan la home de Fase 2.

## No-objetivos

- No se toca la home (eso es Fase 2; esta fase solo entrega datos + landings).
- No se eliminan ni cambian tags, series, ni ninguna URL existente (las rutas de sección se AÑADEN).
- No se reescribe contenido de posts (solo se añade un campo de frontmatter).
- No se adelanta interacción (Fase 3) ni workflow (Fase 4).

## Taxonomía canónica (4 secciones)

El **slug ES es el identificador** (valor del campo `pillar` en ambos idiomas); nombre, dolor y slug de ruta EN se resuelven por diccionario (`lib/dictionary.ts`).

| ID (`pillar`) | Ruta ES | Ruta EN | Nombre ES | Nombre EN |
|---|---|---|---|---|
| `construir-con-ia` | `/es/temas/construir-con-ia` | `/en/topics/building-with-ai` | Construir con IA sin perder el control | Building with AI without losing control |
| `agentes-en-produccion` | `/es/temas/agentes-en-produccion` | `/en/topics/agents-in-production` | Agentes en producción | Agents in production |
| `arquitectura` | `/es/temas/arquitectura` | `/en/topics/architecture` | Arquitectura que aguanta | Architecture that lasts |
| `seguridad` | `/es/temas/seguridad` | `/en/topics/security` | Seguridad y gobernanza | Security & governance |

**Intro de cada landing (el dolor, 2-3 frases; copy definitivo en el diccionario):**

- `construir-con-ia` — ES: "Usas Claude Code o Cursor a diario y sientes que el código se te va de las manos. Aquí: disciplina agentic, deuda técnica y cómo domar la caja negra." / EN: "You use Claude Code or Cursor daily and feel the code slipping away from you. Here: agentic discipline, tech debt, and taming the black box."
- `agentes-en-produccion` — ES: "El demo funcionó. Ahora hay que operarlo: orquestación multi-agente, MCP, RAG, observabilidad y Kubernetes." / EN: "The demo worked. Now you have to run it: multi-agent orchestration, MCP, RAG, observability, and Kubernetes."
- `arquitectura` — ES: "Adoptar IA sin romper lo que ya funciona: hexagonal, SOLID, clean architecture e integración enterprise." / EN: "Adopting AI without breaking what already works: hexagonal, SOLID, clean architecture, and enterprise integration."
- `seguridad` — ES: "¿Quién vigila al agente? Defensas en capas, hardening y gobernanza a escala." / EN: "Who watches the agent? Layered defenses, hardening, and governance at scale."

## Modelo de datos

- Nuevo campo de frontmatter **`pillar: "<id>"`** (string, uno de los 4 IDs). Se añade a TODOS los posts existentes (es y en) en un commit de contenido separado, según la tabla de asignación de abajo.
- `lib/posts.ts` expone `pillar` en el tipo `Post`. Si falta o no es canónico: el post no revienta (fallback `null`), pero `seo:audit` emite warning con el slug del post.
- `scripts/new-post.mjs` (`npm run post:new`) añade `pillar:` al scaffold (valor por defecto: `construir-con-ia`, con comentario de los 4 valores válidos).
- El set canónico vive en UN solo módulo (`lib/pillars.ts`): IDs, slugs de ruta por idioma, nombres, intros. Landings, OG, seo:audit y dictionary consumen de ahí.

## Asignación de posts existentes

**ES — `construir-con-ia` (13):** construyendo-un-entorno… (workspace 2026), construyendo-ochoajorge-me (IA + Next.js blog), agentic-saas-b2b-disciplina, cursor-copilot-claude-code-evaluacion-2026, vibe-coding-produccion (es), claude-opus-48-puente-mythos, construyendo-con-ia-parte-3 (cuando el agente rompe todo), deuda-tecnica-era-ia, construyendo-con-ia-parte-2 (el orden que me salvó), construyendo-con-ia-parte-1 (caja negra), dotfiles, ingenieria-software-era-ia, ai-native-seo.

**ES — `agentes-en-produccion` (11):** agentes-ia-kubernetes, mcp-como-contrato-protocolo, observabilidad-sistemas-ia, orchestrator-worker-multi-agente-produccion, plataforma-ia-rag-go-pgvector, rag-con-pgvector, innova-ia-produccion-monitorabilidad-observabilidad, agentes-ia-produccion-orchestrator-worker-rippling, mcp-como-contrato-entre-agentes, mcp-en-produccion, go-para-backend-de-agentes.

**ES — `arquitectura` (6):** innova-ia-integrar-agentes-enterprise, arquitectura-hexagonal-agentes-ia-patrones-mcp, arquitectura-hexagonal-python (hexagonal-architecture-python-fastapi), building-multitenant-erp-clean-architecture, solid-en-microservicios, patron-repository-python-fastapi.

**ES — `seguridad` (5, incl. 2 drafts):** guia-openclaw-2026-controles-seguridad, hacking-blanco-arquitectura-software, los-4-hackers-mas-influyentes, governance-a-escala-kpmg… (draft), yahoo-seller-agent… (draft).

**EN (7):** building-ochoajorge-me → `construir-con-ia`; building-open-automatable-workspace-2026 → `construir-con-ia`; building-with-ai parts 1/2/3 → `construir-con-ia`; vibe-coding-production-reality → `construir-con-ia`; openclaw-2026-security-controls-guide → `seguridad`.

(El implementador valida los filenames exactos con `ls content/posts/{es,en}` al escribir el plan; los de arriba identifican el post, no necesariamente el filename literal.)

## Rutas y páginas

- **`/{lang}/temas`** (EN: `/{lang}/topics`): índice de secciones. Cada puerta: kicker mono `// {id}`, nombre en display, intro del dolor, conteo de posts publicados. La ruta física es una sola (`app/[lang]/temas/`), con el segmento localizado vía rewrite o generateStaticParams — decisión de implementación en el plan; requisito: `/en/temas/*` NO debe existir públicamente (redirect o 404), la ruta EN canónica es `/en/topics/*`.
- **`/{lang}/temas/{slug}`**: landing de sección — kicker `// {id}`, H1 display con el nombre, intro del dolor, lista de posts de la sección con el PostCard existente (orden: fecha desc), y bloque de series si ≥2 posts de la sección pertenecen a una misma serie.
- **Header**: se añade "Temas"/"Topics" como PRIMER item de nav (antes de Blog). "Blog" se conserva como archivo cronológico.
- Sitemap incluye las rutas nuevas; metadata completa (title, description = intro del dolor, OG) en índice y landings.

## Integraciones

- **OG images** (`lib/og-template.tsx`): el kicker pasa de primer tag a `// {pillar}` y el hue azul/naranja se fija POR SECCIÓN de forma estable: `construir-con-ia` naranja, `agentes-en-produccion` azul, `arquitectura` azul, `seguridad` naranja (mapa explícito en `lib/pillars.ts`, sustituye al hash por suma de charcodes). Posts sin pillar: fallback al comportamiento actual (primer tag + hash).
- **Fase 2** consumirá `lib/pillars.ts` para las puertas de la home y el kicker del PostHeader. Esta fase no toca home ni PostHeader.
- Tags, series, RSS y URLs existentes: sin cambios.

## Verificación

- `seo:audit` pasa con 0 warnings (todos los posts con `pillar` canónico).
- Suite completa: lint, type-check, seo:audit, build, test:e2e.
- Visual en Chrome (claro y oscuro): `/es/temas`, una landing con posts, `/en/topics` y una landing EN.
- OG de un post de cada sección muestra el kicker `// {id}` y el hue asignado.
- `curl /en/temas` no responde 200 (redirect a /en/topics o 404).

## Entrega

Un PR a `develop` (proceso estándar: worktree → plan con writing-plans → subagent-driven-development → reviews → suite). El commit de contenido (`content(posts): add pillar to all posts`) va separado de los commits de código. Promoción a `main` cuando Jorge quiera publicar.

## Riesgos

- **Asignaciones discutibles** (p. ej. ai-native-seo, go-para-backend): la tabla de arriba es la fuente de verdad aprobada; cambiar un post de sección después es un one-liner de frontmatter.
- **Secciones desbalanceadas en EN** (5 de 7 posts en `construir-con-ia`): aceptado; la estructura invita a traducir. Las landings EN con 0 posts muestran la intro + "coming soon" con enlace al equivalente ES.
- **Segmento localizado `/temas` vs `/topics`**: si el rewrite complica el App Router, el plan puede optar por carpeta duplicada delgada que reexporta — decisión del plan, no del spec.
