# Calendario Semanal de Contenido — Semana del 21 de Septiembre, 2026

## Serie: Agentes en Producción y Casos de Uso Reales

| # | Fecha | Slug | Título | Serie | Parte | Pillar |
|---|-------|------|--------|-------|-------|--------|
| 1 | 2026-09-22 | `mondaycom-el-harness-que-hace-confiable-a-un-agente-en-produccin` | monday.com: El Harness que Hace Confiable a un Agente en Producción | Construyendo con IA: Lo que nadie te dice | 17 | agentes-en-produccion |
| 2 | 2026-09-24 | `google-ai-agent-clinic-5-lecciones-al-refactorizar-un-monolito-a-un-agente-de-produccin` | Google AI Agent Clinic: 5 Lecciones al Refactorizar un Monolito a un Agente de Producción | Construyendo con IA: Lo que nadie te dice | 18 | agentes-en-produccion |
| 3 | 2026-09-26 | `wood-mackenzie-apex-la-plataforma-compartida-que-saca-a-los-agentes-del-purgatorio-poc` | Wood Mackenzie: APEX, la Plataforma Compartida que Saca a los Agentes del Purgatorio PoC | Arquitectura de Software Avanzada | 20 | arquitectura |

## Foco de cada post

1. **monday.com — Building a Robust Harness for agent in production (FeedAgent)** — El harness que hace confiable a un deep agent: preprocesador PII-safe, sistema de alias para detectar alucinaciones, prompt caching, esquema de salida validado con retry, filtrado/deduplicación de herramientas y Feed Memory (reglas explícitas vs observaciones inferidas).

2. **Google — AI Agent Clinic: 5 Lessons from Refactoring a Monolith** — El desarme de Titanium: de un script monolítico a un pipeline `SequentialAgent` con ADK, salidas forzadas con Pydantic (schema como contrato), RAG dinámico con búsqueda híbrida en Vector Search, OpenTelemetry para observabilidad y circuit breakers contra la quema de tokens.

3. **Wood Mackenzie — APEX (Amazon Bedrock AgentCore)** — Plataforma compartida para sacar a los agentes del purgatorio PoC (88% nunca escalaron): el patrón hub-and-spoke que resuelve el problema N×M, gateway MCP, identidad heredada (OAuth 2.0 / Cedar), y evals + observabilidad como capacidades de plataforma.

## Cron Jobs de Publicación

| Post | Fecha | Job ID | Acción |
|------|-------|--------|--------|
| monday.com | 2026-09-22 09:00 CST | `c6b99b7ff523` | `draft: false` + commit + PR a develop + release a main |
| Google | 2026-09-24 09:00 CST | `078859e8636c` | `draft: false` + commit + PR a develop + release a main |
| Wood Mackenzie | 2026-09-26 09:00 CST | `feac57d63d55` | `draft: false` + commit + PR a develop + release a main |

---

*Generado automáticamente por Hermes Agent — 2026-09-21*