# Calendario Semanal de Contenido — Semana del 14 de Septiembre, 2026

## Serie: Agentes en Producción y Casos de Uso Reales

| # | Fecha | Slug | Título | Serie | Parte | Pillar |
|---|-------|------|--------|-------|-------|--------|
| 1 | 2026-09-15 | `ibm-agentes-en-produccin-la-fbrica-de-datos-que-nadie-dibuja` | IBM: Agentes en Producción, la Fábrica de Datos que Nadie Dibuja | Construyendo con IA: Lo que nadie te dice | 15 | agentes-en-produccion |
| 2 | 2026-09-17 | `state-farm-llm-como-juez-para-monitorear-agentes-ia-en-produccin` | State Farm: LLM como Juez para Monitorear Agentes IA en Producción | Construyendo con IA: Lo que nadie te dice | 16 | agentes-en-produccion |
| 3 | 2026-09-19 | `toyota-deep-agents-y-langsmith-de-6-meses-a-4-das-por-agente` | Toyota: Deep Agents y LangSmith, de 6 Meses a 4 Días por Agente | Arquitectura de Software Avanzada | 19 | arquitectura |

## Foco de cada post

1. **IBM — Building Production Agentic AI at IBM** — Cómo IBM TLS puso una plataforma multiagente en producción con A2A en cada frontera de agente y MCP para cada herramienta. Lecciones: "fábrica de datos" antes que "fábrica de agentes", identity propagation con OAuth2 token exchange, instrumentar antes de construir (traces/evals/business metrics), LiteLLM para intercambiar modelo como configuración.

2. **State Farm — LLM as a Judge in Production** — Monitoreo continuo de agentes en producción con LLM-as-a-judge: métricas reference-free, faithfulness estricta vía GEval, meta-análisis con atribución por componente, y un experimento formal validando al juez contra 197 conversaciones revisadas por humanos (78% acuerdo <3pts, evaluación humana + automatizada complementarias).

3. **Toyota — Deep Agents + LangSmith** — 50+ agentes en producción, de 6 meses/6 ingenieros a 4 días/1 ingeniero por agente. Skills reutilizables inyectadas en runtime, GearPal (5-6h → 2-3 min de diagnóstico), LLM gateway con fallback, parallel tool-calling para precisión de retrieval, LangSmith como "tablero Andon".

## Cron Jobs de Publicación

| Post | Fecha | Job ID | Acción |
|------|-------|--------|--------|
| IBM | 2026-09-15 09:00 CST | `f237571a4ffd` | `draft: false` + commit + PR a develop + release a main |
| State Farm | 2026-09-17 09:00 CST | `fe263276cbb2` | `draft: false` + commit + PR a develop + release a main |
| Toyota | 2026-09-19 09:00 CST | `0d7d222921ec` | `draft: false` + commit + PR a develop + release a main |

---

*Generado automáticamente por Hermes Agent — 2026-09-14*