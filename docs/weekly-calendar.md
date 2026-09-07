# Calendario Semanal de Contenido — Semana del 8 de Septiembre, 2026

## Serie: Agentes en Producción y Casos de Uso Reales

| # | Fecha | Slug | Título | Serie | Parte | Pillar |
|---|-------|------|--------|-------|-------|--------|
| 1 | 2026-09-08 | `meta-agentes-ia-que-recuperan-megavatios-de-performance-a-hiperescala` | Meta: Agentes IA que Recuperan Megavatios de Performance a Hiperescala | Construyendo con IA: Lo que nadie te dice | 13 | agentes-en-produccion |
| 2 | 2026-09-10 | `duolingo-plataforma-de-agentes-lista-para-produccion-en-10-minutos` | Duolingo: Plataforma de Agentes Lista para Produccion en 10 Minutos | Arquitectura de Software Avanzada | 18 | arquitectura |
| 3 | 2026-09-12 | `spotify-xirp-y-portal-36000-sesiones-de-agentes-sin-vendor-lock-in` | Spotify: Xirp y Portal, 36000 Sesiones de Agentes sin Vendor Lock-in | Construyendo con IA: Lo que nadie te dice | 14 | construir-con-ia |

## Foco de cada post

1. **Meta — Capacity Efficiency AI Agents** — Cómo Meta construyó una plataforma unificada de agentes IA para eficiencia de capacidad a hiperescala. MCP tools estandarizadas + skills codificadas que automatizan find-and-fix de regresiones de performance. FBDetect detecta regresiones del 0.005%, el AI Regression Solver genera pull requests automáticamente. Resultado: cientos de megavatios recuperados, 10 horas de investigación manual → 30 minutos. Una plataforma, ofensiva y defensa, retornos compuestos.

2. **Duolingo — Production-Ready Agent Platform** — Cómo Duolingo construyó una plataforma donde defines un agente una vez (AgentDefinition) y Temporal maneja el resto: ejecución, observabilidad, orquestación y evaluación. MCP tool calls como Temporal activities para durabilidad. Evals deterministas (diff_assertions, no_op_consistency) sobre LLM-as-judge. De semanas a 10 minutos por agente nuevo, con infraestructura heredada automáticamente.

3. **Spotify — Xirp + Portal** — Cómo Spotify construyó Xirp, un entorno agéntico vendor-neutral que coordina 50+ sesiones paralelas en worktrees aislados. Contexto desacoplado de cualquier tool o harness: switch de modelo mid-task sin perder estado. Portal como multiplicador: cada sesión se inicializa con contexto organizacional del software catalog (component architecture, dependency graphs, ownership). 36,000+ sesiones adoptadas orgánicamente.

## Cron Jobs de Publicación

| Post | Fecha | Acción |
|------|-------|--------|
| Meta | 2026-09-08 09:00 CST | `draft: false` + commit + PR a develop |
| Duolingo | 2026-09-10 09:00 CST | `draft: false` + commit + PR a develop |
| Spotify | 2026-09-12 09:00 CST | `draft: false` + commit + PR a develop |

---

*Generado automáticamente por Hermes Agent — 2026-09-07*
