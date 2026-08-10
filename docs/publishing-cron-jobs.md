# Cron Jobs de Publicación — Sistema de Contenido Semanal

**Batch:** Semana del 2026-08-10
**Rama de trabajo:** `content/agentes-produccion-2026-08` (base `origin/develop`)
**Workflow:** `.github/workflows/publish-weekly-posts.yml`

## Resumen de posts programados

### Post 1 — Stripe (Martes 2026-08-11)
- **Fecha publicación:** 2026-08-11, 08:00 CST (14:00 UTC)
- **Serie:** Construyendo con IA: Lo que nadie te dice (Parte 9)
- **Pillar:** `agentes-en-produccion`
- **Foco:** Infraestructura dedicada para agentes (network-bound vs compute-bound), ReAct, prompt caching -60%.
- **Estado:** Draft (pendiente de aprobación)
- **Archivo:** `content/posts/es/agentes-ia-en-produccin-la-infraestructura-dedicada-de-stripe-para-compliance-financiero.mdx`
- **Cron ID:** `weekly-post-1-2026-08-11` · cron `0 14 11 8 *`

### Post 2 — monday.com (Jueves 2026-08-13)
- **Fecha publicación:** 2026-08-13, 08:00 CST (14:00 UTC)
- **Serie:** Arquitectura de Software Avanzada (Parte 13)
- **Pillar:** `construir-con-ia`
- **Foco:** Agentes de ingeniería autónomos en EKS, Guardrails como reviewer automático, evals, auto-merge.
- **Estado:** Draft (pendiente de aprobación)
- **Archivo:** `content/posts/es/agentes-de-ingeniera-autnomos-cmo-mondaycom-corre-morphex-en-produccin.mdx`
- **Cron ID:** `weekly-post-2-2026-08-13` · cron `0 14 13 8 *`

### Post 3 — UNACEM (Sábado 2026-08-15)
- **Fecha publicación:** 2026-08-15, 08:00 CST (14:00 UTC)
- **Serie:** Arquitectura de Software Avanzada (Parte 14)
- **Pillar:** `arquitectura`
- **Foco:** Agentic AI operacional con pgvector + WhatsApp sobre watsonx Orchestrate (caso LATAM).
- **Estado:** Draft (pendiente de aprobación)
- **Archivo:** `content/posts/es/agentic-ai-operacional-con-pgvector-la-arquitectura-de-unacem-sobre-watsonx-orchestrate.mdx`
- **Cron ID:** `weekly-post-3-2026-08-15` · cron `0 14 15 8 *`

## GitHub Actions schedule

```yaml
# 08:00 CST (UTC-6) = 14:00 UTC
- cron: '0 14 11 8 *'   # Post 1: Stripe     — Martes 2026-08-11
- cron: '0 14 13 8 *'   # Post 2: monday.com — Jueves 2026-08-13
- cron: '0 14 15 8 *'   # Post 3: UNACEM    — Sábado 2026-08-15
```

**Workflow file:** `.github/workflows/publish-weekly-posts.yml`

## Cómo funciona la publicación automática

1. En cada fecha programada, el workflow hace checkout de `develop`.
2. Resuelve el slug del post correspondiente a esa fecha.
3. Cambia `draft: true` → `draft: false` en el frontmatter.
4. Crea una rama `content/publish-<slug>`, commitea y **abre un PR hacia `develop`**.
5. **Nunca** pushea a `main` ni directo a `develop`: el flujo respeta las reglas doradas
   de `AGENTS.md` (publicar = PR a develop; deploy = PR de develop a main).

También se puede disparar manualmente (`workflow_dispatch`) pasando el slug del post.

## Requisito previo: el workflow tiene que vivir en la rama por defecto

**GitHub Actions solo dispara los triggers `schedule` desde la rama por defecto del
repositorio** — aquí `main`. Un workflow que solo existe en una rama de feature o en
`develop` no genera ninguna ejecución programada: no falla, simplemente nunca corre.
Lo mismo aplica a `workflow_dispatch`, que solo aparece en la UI si el fichero está en
la rama por defecto.

Consecuencia para este batch: los crons del 11, 13 y 15 de agosto **no existirán** hasta
que `.github/workflows/publish-weekly-posts.yml` esté mergeado en `main`. La cadena
completa es:

```
content/agentes-produccion-2026-08  →  PR a develop  →  PR de develop a main
```

Ese segundo PR es un deploy a producción según las reglas doradas de `AGENTS.md`, así
que solo se abre cuando Jorge lo pida. Mientras el workflow no esté en `main`, la
publicación de cada post hay que hacerla a mano: flipear `draft: true` → `false` en una
rama `content/<slug>` y abrir el PR a `develop`.

## Quality gates cumplidos

- ✅ Todos los posts tienen frontmatter completo (title, description, date, tags, pillar, lang, draft, series, canonical, resources)
- ✅ Descripciones de 150-160 caracteres exactos (154 / 152 / 155)
- ✅ Tags en español, kebab-case
- ✅ `seo:audit es` pasa (34 posts, 1 warning y es de otro post: falta ogImage en
  `construir-software-seguro-con-llms-el-frontier-de-agosto-2026`)
- ✅ Build de Next.js limpio
- ✅ Posts asignados a series con `part` correcto (Construyendo con IA 9; Arquitectura 13, 14)
- ✅ `draft: true` hasta aprobación
- ✅ Cron jobs creados con fechas correctas y flujo vía PR

## Metadatos de publicación

- **Zona horaria:** America/El_Salvador (CST, UTC-6)
- **Hora de publicación:** 08:00 local (14:00 UTC)
- **Automatización:** GitHub Actions scheduled workflow (PR-based, no direct push)
- **Contenido generado:** 2026-08-10
- **Calendario fuente:** `docs/weekly-calendar.md`

## Notas

- Los 3 posts quedan en `draft: true` hasta la fecha de publicación programada.
- El workflow de publicación abrirá un PR por post en su fecha; revisar y mergear a
  `develop`. El deploy a producción (`main`) se hace solo cuando Jorge lo solicite
  (PR de `develop` → `main`).
- Si un post aún no está aprobado para su fecha, se puede desactivar el cron editando
  el workflow o usar `workflow_dispatch` más tarde con el slug.
- La label `content` que usa `gh pr create --label` tiene que existir en el repo, o el
  paso falla después de haber pusheado la rama. Creada el 2026-08-10.
