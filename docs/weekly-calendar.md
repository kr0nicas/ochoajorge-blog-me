# Calendario Semanal de Contenido — Semana del 2 de Noviembre, 2026

## Serie: Agentes en Producción y Casos de Uso Reales

| # | Fecha | Slug | Título | Serie | Parte | Pillar |
|---|-------|------|--------|-------|-------|--------|
| 1 | 2026-11-03 | `bayer-ade-22-agentes-especialistas-y-las-5-decisiones-que-no-estaban-en-el-prompt` | Bayer ADE: 22 Agentes Especialistas y las 5 Decisiones que No Estaban en el Prompt | Arquitectura de Software Avanzada | 24 | agentes-en-produccion |
| 2 | 2026-11-05 | `eon-y-el-mcp-gateway-de-2-dias-a-2-minutos-para-humanos-y-agentes` | Eon y el MCP Gateway: De 2 Días a 2 Minutos para Darle Herramientas a Humanos y Agentes | Construyendo con IA: Lo que nadie te dice | 25 | agentes-en-produccion |
| 3 | 2026-11-07 | `agentes-tolerantes-a-fallas-7-patrones-de-sistemas-distribuidos-que-ningun-prompt-reemplaza` | Agentes Tolerantes a Fallas: 7 Patrones de Sistemas Distribuidos que Ningún Prompt Reemplaza | Arquitectura de Software Avanzada | 25 | agentes-en-produccion |

## Foco de cada post

1. **Bayer ADE**: Bayer Crop Science resuelve el 80% de las preguntas sin ingenieros usando 22 agentes sobre Bedrock AgentCore. El post cubre las decisiones que lo hicieron posible y que no están en ningún prompt: checkpoints durables con locking optimista, una credencial por cada salto, el modelo tratado como contrato, tools generadas desde OpenAPI y la medición del éxito de la tarea en lugar del éxito HTTP.

2. **Eon MCP Gateway**: Eon reemplazó los servidores MCP locales y los tokens por tool con un gateway remoto único. La autorización se define con políticas Cedar, lo usan 100+ devs y un agente SRE sobre 3 nubes, y el onboarding bajó de 2 días a 2 minutos. Temas: fail-closed, identidad como conectividad y manifiesto de tools filtrado por principal.

3. **Agentes tolerantes a fallas**: Un agente es un sistema distribuido que escribe su propio grafo de llamadas. El post recorre 7 patrones: retries con presupuesto, idempotencia, circuit breakers, sagas, pasos irreversibles al final, conteo de huérfanos y pass^k con fallas inyectadas. Con ellos la tasa de éxito sube de 33% a 89.6%. Código en Go.

## Cron Jobs de Publicación

| Post | Fecha | Acción |
|------|-------|--------|
| Bayer ADE | 2026-11-03 09:00 CST | `draft: false` + commit + push + PR a develop |
| Eon MCP Gateway | 2026-11-05 09:00 CST | `draft: false` + commit + push + PR a develop |
| Agentes tolerantes a fallas | 2026-11-07 09:00 CST | `draft: false` + commit + push + PR a develop |

Rama: `content/semana-nov02-agentes-produccion`

---

*Contenido redactado el 2026-10-26 (esa corrida se interrumpió antes del commit). Reprogramado por Hermes Agent el 2026-11-02.*
