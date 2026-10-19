# Calendario Semanal de Contenido — Semana del 19 de Octubre, 2026

## Tema: Topología, Superficie y Evaluación de Agentes en Producción

| # | Fecha | Slug | Título | Serie | Parte | Pillar |
|---|-------|------|--------|-------|-------|--------|
| 1 | 2026-10-20 | `cornerstone-orion-ai-13-agentes-que-bajaron-el-diagnostico-de-bases-de-datos-de-45-a-10-minutos` | Cornerstone Orion AI: 13 Agentes que Bajaron el Diagnóstico de Bases de Datos de 45 a 10 Minutos | Arquitectura de Software Avanzada | 23 | agentes-en-produccion |
| 2 | 2026-10-22 | `snyk-assist-un-runtime-muchas-puertas-y-85-de-sesiones-sin-ticket` | Snyk Assist: Un Runtime, Muchas Puertas y 85% de Sesiones sin Ticket | Construyendo con IA: Lo que nadie te dice | 23 | agentes-en-produccion |
| 3 | 2026-10-24 | `evals-de-agentes-en-9-etapas-como-aws-atrapa-respuestas-fluidas-pero-incorrectas` | Evals de Agentes en 9 Etapas: Cómo AWS Atrapa Respuestas Fluidas pero Incorrectas | Construyendo con IA: Lo que nadie te dice | 24 | agentes-en-produccion |

## Foco de cada post

1. **Cornerstone Orion AI (13 agentes, 45→10 min)** — Hub-and-spoke donde el meta-orquestador no tiene tools de dominio, solo de ruteo y control de flujo. División por dominio y no por complejidad, ruteo keyword-first (80% en <1 ms) con fallback semántico y RAG, memoria en tres niveles con presupuesto de 500 ms / 4,000 tokens y bypass forzado para estado en vivo, confirmation gate con deny por defecto, MCP solo para tools compartidas. Código Go: puerto `Router` con cadena de adaptadores.
2. **Snyk Assist (60k consultas, 85% sin ticket)** — De herramienta interna (1 año) a portal (abr-2026) a producto core (sep-2026) sin cambiar el runtime. Superficies como adaptadores hexagonales, tools registradas por permisos en cada request (autorización por construcción), middleware ordenado para guardrails/contexto/fallback, checkpointer en PostgreSQL, umbrales de eval commiteados en el repo como gate de CI y online evals sobre el 100% de runs. Código Go: `ToolsFor(principal)` y cadena de middleware.
3. **Evals en 9 etapas (AWS SMGS)** — Monitoreo en verde no es calidad. Evaluación en tres niveles (tool, agente, multi-agente), taxonomía de 6 fallas derivada de producción, sentinel en CI, replay de tools en CD, gate con tres condiciones, canary de 30 min con paginación tras 3 ventanas, drift en 10% del tráfico (caso tickers "AMZN"), few-shot con placeholders. Pass rate 93→96%, alucinaciones 138→<52 por 10k, MTTD de semanas a <4 h. Código Go: evaluador determinista de magnitud, replay de tools y pager de ventanas consecutivas.

## Fuentes

- [How Cornerstone OnDemand cut database diagnosis by 78% with Amazon Bedrock](https://aws.amazon.com/blogs/machine-learning/how-cornerstone-ondemand-cut-database-diagnosis-by-78-with-amazon-bedrock/) — AWS ML Blog, 07-oct-2026
- [How Snyk turned an internal support agent into a customer feature](https://www.langchain.com/blog/how-snyk-turned-an-internal-support-agent-into-a-customer-feature) — LangChain Blog, 08-oct-2026
- [Building trust in AI agents: A production-ready evaluation framework with Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/machine-learning/building-trust-in-ai-agents-a-production-ready-evaluation-framework-with-amazon-bedrock-agentcore/) — AWS ML Blog, 16-oct-2026

## Cron Jobs de Publicación

| Post | Fecha | Job ID | Acción |
|------|-------|--------|--------|
| Cornerstone | 2026-10-20 09:00 CST | `CRON_1` | `draft: false` + commit + push + PR a develop |
| Snyk Assist | 2026-10-22 09:00 CST | `CRON_2` | `draft: false` + commit + push + PR a develop |
| Evals 9 etapas | 2026-10-24 09:00 CST | `CRON_3` | `draft: false` + commit + push + PR a develop |

## Dependencias

- La rama base es `origin/develop`, que **no** incluye todavía el PR #102 (13 posts atrasados) ni SPS Commerce / MUFG. La numeración de series (Arquitectura 23, Construyendo con IA 23-24) asume que esos posts se mergean antes.

---

*Generado automáticamente por Hermes Agent — 2026-10-19*
