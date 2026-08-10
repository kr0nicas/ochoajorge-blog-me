# Calendario de Publicación — Semana del 2026-08-10

**Generado por:** Sistema de contenido semanal (cron)
**Rama:** `content/agentes-produccion-2026-08` (base `origin/develop`)
**Cadencia:** martes / jueves / sábado, 08:00 CST (14:00 UTC)

---

## Post 1 — Martes 2026-08-11
**Título:** Agentes IA en Producción: La Infraestructura Dedicada de Stripe para Compliance Financiero
**Tipo:** Case study analysis (real, en producción)
**Serie:** Construyendo con IA: Lo que nadie te dice — Parte 9
**Pillar:** `agentes-en-produccion`
**Foco:** Por qué los agentes necesitan su propio serving layer (network-bound vs compute-bound), ReAct, prompt caching (-60% costo), 100+ agentes en <1 año.
**Métricas clave:** USD 1.4B volumen anual · 26% menos tiempo de review · 96%+ helpfulness · humanos en control.
**Archivo:** `content/posts/es/agentes-ia-en-produccin-la-infraestructura-dedicada-de-stripe-para-compliance-financiero.mdx`
**Descripción SEO:** 154 caracteres ✅
**Tags:** `agentes-ia`, `produccion`, `infraestructura`, `compliance`, `observabilidad`
**Estado:** `draft: true`

## Post 2 — Jueves 2026-08-13
**Título:** Agentes de Ingeniería Autónomos: Cómo monday.com Corre Morphex en Producción
**Tipo:** Technical deep-dive (real, en producción)
**Serie:** Arquitectura de Software Avanzada — Parte 13
**Pillar:** `construir-con-ia`
**Foco:** Agentes autónomos en SaaS enterprise sobre EKS (1 pod/sesión, KEDA), Guardrails como reviewer automático, evals en 2 capas, auto-merge por confianza compuesta.
**Métricas clave:** 19/20 PRs auto-merge · ~3/4 merges sin edición humana · revert rate bajos dígitos · throughput PR +50%.
**Archivo:** `content/posts/es/agentes-de-ingeniera-autnomos-cmo-mondaycom-corre-morphex-en-produccin.mdx`
**Descripción SEO:** 152 caracteres ✅
**Tags:** `agentes-ia`, `ingenieria-software`, `automatizacion`, `kubernetes`, `observabilidad`
**Estado:** `draft: true`

## Post 3 — Sábado 2026-08-15
**Título:** Agentic AI Operacional con pgvector: La Arquitectura de UNACEM sobre watsonx Orchestrate
**Tipo:** Pattern tutorial / case study LATAM (real, en producción)
**Serie:** Arquitectura de Software Avanzada — Parte 14
**Pillar:** `arquitectura`
**Foco:** Agentes IA operacionales en WhatsApp con grounding en conocimiento enterprise vía pgvector + PostgreSQL; caso industrial LATAM (Perú).
**Métricas clave:** -40% tiempo de espera en planta · 5 países · 40+ subsidiarias · blueprint replicable.
**Archivo:** `content/posts/es/agentic-ai-operacional-con-pgvector-la-arquitectura-de-unacem-sobre-watsonx-orchestrate.mdx`
**Descripción SEO:** 155 caracteres ✅
**Tags:** `agentes-ia`, `pgvector`, `watsonx-orchestrate`, `arquitectura`, `latam`
**Estado:** `draft: true`

---

## Fuentes de noticia (todas reales, verificadas)
- https://aws.amazon.com/blogs/machine-learning/production-grade-ai-agents-for-financial-compliance-lessons-from-stripe/
- https://aws.amazon.com/blogs/machine-learning/ai-teammates-how-monday-com-runs-production-ai-agents-on-amazon-bedrock/
- https://www.ibm.com/new/product-blog/how-an-industrial-powerhouse-unacem-modernized-operations-with-agentic-ai

## Justificación de selección
1. **Stripe** — El caso más documentado de *infraestructura dedicada* para agentes (no reutilizar serving de ML). Lección de harness > modelo.
2. **monday.com** — Agentes de ingeniería autónomos en un SaaS enterprise real (no greenfield). Playbook de guardrails + evals + auto-merge.
3. **UNACEM** — Caso LATAM raro en la literatura, usa **pgvector** (stack del autor), canal WhatsApp y grounding en conocimiento propio.

Los tres son producción real, no demos, con métricas concretas y citadas.

## Cron jobs de publicación
Ver `docs/publishing-cron-jobs.md` y `.github/workflows/publish-weekly-posts.yml`.

| Fecha publicación (CST) | Cron (UTC)        | Job ID                         | Post |
|--------------------------|------------------|--------------------------------|------|
| 2026-08-11 08:00         | `0 14 11 8 *`    | `weekly-post-1-2026-08-11`     | Stripe |
| 2026-08-13 08:00         | `0 14 13 8 *`    | `weekly-post-2-2026-08-13`     | monday.com |
| 2026-08-15 08:00         | `0 14 15 8 *`    | `weekly-post-3-2026-08-15`     | UNACEM |
