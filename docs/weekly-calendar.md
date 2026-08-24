# Calendario de Publicación — Semana del 2026-08-24

**Generado por:** Sistema de contenido semanal (cron)
**Rama:** `content/agentes-produccion-2026-08-semana4` (base `origin/develop`)
**Cadencia:** martes / jueves / sábado, 08:00 CST (14:00 UTC)

---

## Post 1 — Martes 2026-08-25
**Título:** Agentes IA en Klarna: 3 Capas de Juicio y el Humano Bajo Demanda
**Tipo:** Case study analysis (real, en producción)
**Serie:** Construyendo con IA: Lo que nadie te dice — Parte 10
**Pillar:** `agentes-en-produccion`
**Foco:** Klarna automatizó 853 FTE equivalentes y ahorró $60M anuales, pero el retroceso de mayo 2025 reveló que las interacciones de customer service tienen 3 capas de juicio: transaccional (totalmente automatizable), emocional/contextual (parcial) y alta complejidad (siempre humano). La arquitectura correcta es agente-primero, humano-bajo-demanda, con el routing de escalación como producto.
**Métricas clave:** 2.3M conversaciones/mes · 853 FTE equivalentes · $60M ahorro anual · resolución 11min→2min · 25% menos repetidas · retroceso mayo 2025 → arquitectura híbrida.
**Archivo:** `content/posts/es/agentes-ia-en-klarna-3-capas-de-juicio-y-el-humano-bajo-demanda.mdx`
**Tags:** `agentes-ia`, `atencion-cliente`, `arquitectura`, `gobernanza`
**Estado:** `draft: true`

## Post 2 — Jueves 2026-08-27
**Título:** Plataforma de Agentes en DoorDash: LLM Gateway, MCP y Evals a 2000 Diarios
**Tipo:** Technical deep-dive (real, en producción)
**Serie:** Arquitectura de Software Avanzada — Parte 15
**Pillar:** `construir-con-ia`
**Foco:** DoorDash construyó una plataforma de agentes con 4 componentes: LLM Gateway (routing, observabilidad, fallback), Agentic Gateway (multi-step, MCP streaming), ADK templates, y Batch Inference. Arquitectura Orchestrator + domain agents (Restaurant, Grocery, Reservations), MCP con 60+ tools, Managed Agent Services (sessions/memory/artifacts), evals automatizadas (2000/día, regression 6h→20min). Lección: cuándo centralizar vs descentralizar infraestructura de agentes.
**Métricas clave:** 60+ MCP tools · 2000 evals diarias · regression 6h→20min · checkout +24% · basket +17% · conversaciones -7% turns · model upgrade -35% p50 latency · Reservations lanzado en 1 semana (10x más rápido).
**Archivo:** `content/posts/es/plataforma-de-agentes-en-doordash-llm-gateway-mcp-y-evals.mdx`
**Tags:** `agentes-ia`, `plataforma-ia`, `mcp`, `evals`, `observabilidad`
**Estado:** `draft: true`

## Post 3 — Sábado 2026-08-29
**Título:** GitLab Duo y el ROI de la IA: Cómo Medir lo que los Agentes Aportan al SDLC
**Tipo:** Pattern tutorial / case study (real, en producción)
**Serie:** Arquitectura de Software Avanzada — Parte 16
**Pillar:** `arquitectura`
**Foco:** GitLab construyó el AI Impact analytics dashboard para medir ROI de IA en el SDLC: Code Suggestions Usage Rate como variable independiente correlacionada con Cycle Time, Lead Time, Deployment Frequency, Change Failure Rate y Critical Vulnerabilities. APIs GraphQL (AiMetrics, AiUserMetrics, AiUsageData) para extraer métricas. Lección: qué medir, qué no, y por qué la tasa de aceptación de suggestions sola es insuficiente.
**Métricas clave:** Code Suggestions Usage Rate · correlación con cycle/lead time · acceptance rate por lenguaje · comparación equipos con/sin IA · change failure rate.
**Archivo:** `content/posts/es/gitlab-duo-el-roi-de-la-ia-como-medir-lo-que-los-agentes-aportan.mdx`
**Tags:** `observabilidad`, `metricas`, `ingenieria-software`, `productividad`, `ia`
**Estado:** `draft: true`

---

## Fuentes de noticia (todas reales, verificadas)
- https://openai.com/index/klarna/ (Klarna AI assistant — OpenAI, Feb 2024)
- https://www.bigtechnology.com/p/klarna-ceo-were-giving-ai-more-customer (Klarna CEO interview, 2025)
- https://signal-memo.com/memo-klarna-fired-700-agents-then-hired-them-back-then-saved-60m-anyway-what-actually-happened/ (Análisis del retroceso y la arquitectura híbrida, 2025-2026)
- https://careersatdoordash.com/blog/building-ask-doordash-part-four-a-platform-for-building_and_evolving_agents/ (DoorDash platform architecture)
- https://www.infoq.com/news/2026/07/doordash-ai-ask-assistant/ (DoorDash Ask DoorDash deep-dive, InfoQ)
- https://boston.qcon.ai/presentation/boston2026/building-genai-platform-doordash (QCon AI Boston 2026 — Building GenAI Platform at DoorDash)
- https://about.gitlab.com/blog/developing-gitlab-duo-ai-impact-analytics-dashboard-measures-the-roi-of-ai/ (GitLab Duo AI Impact dashboard)
- https://about.gitlab.com/blog/measuring-ai-roi-at-scale-a-practical-guide-to-gitlab-duo-analytics/ (Measuring AI ROI at scale)
- https://docs.gitlab.com/user/analytics/duo_and_sdlc_trends/ (GitLab Duo and SDLC trends docs)

## Justificación de selección
1. **Klarna** — El caso más público y documentado de agentes IA en customer service a escala. No es un éxito simple: es un éxito con un retroceso público que revela la lección arquitectónica más importante (3 capas de juicio, humano bajo demanda). Refleja exactamente el tipo de caso que la audiencia necesita antes de desplegar agentes en producción.
2. **DoorDash** — La arquitectura de plataforma más completa publicada: LLM Gateway + Agentic Gateway + MCP + Orchestrator/domain agents + evals. Cubre todos los temas que Jorge escribe (MCP, observabilidad, orquestación, Kubernetes-adjacent). Es el blueprint que cualquier equipo necesita antes de construir agentes a escala.
3. **GitLab Duo** — El caso que nadie cubre: cómo MEDIR el ROI de la IA en ingeniería. Mientras todos hablan de desplegar agentes, pocos hablan de cómo saber si funcionan. La correlación entre adoption de code suggestions y métricas SDLC (cycle time, lead time, change failure rate) es el framework que falta en la literatura hispanohablante.

Los tres son producción real, no demos, con métricas concretas y citadas.

## Cron jobs de publicación
Ver `docs/publishing-cron-jobs.md` y `.github/workflows/publish-weekly-posts.yml`.

| Fecha publicación (CST) | Cron (UTC)        | Job ID                         | Post |
|--------------------------|------------------|--------------------------------|------|
| 2026-08-25 08:00         | `0 14 25 8 *`    | `weekly-post-1-2026-08-25`     | Klarna |
| 2026-08-27 08:00         | `0 14 27 8 *`    | `weekly-post-2-2026-08-27`     | DoorDash |
| 2026-08-29 08:00         | `0 14 29 8 *`    | `weekly-post-3-2026-08-29`     | GitLab Duo |
