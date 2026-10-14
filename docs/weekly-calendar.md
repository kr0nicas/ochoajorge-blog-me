# Calendario Semanal de Contenido — Semana del 12 de Octubre, 2026

> **Consolidación 2026-10-14.** Del 8-sep al 13-oct ningún post llegó a producción: el PAT de
> `gh` no tenía `pull_requests: write` (corregido el 14-oct) y los jobs del 8 al 12-sep se
> saltaron por `drift_skip`. La rama `content/consolidacion-pendientes-oct14` publica de una vez
> los 13 posts atrasados: Meta, Duolingo, Spotify, IBM, State Farm, Toyota, monday.com, Google,
> Wood Mackenzie, Trane, Fortune 500, OpenAI Medicare y Postman. SPS Commerce y MUFG siguen
> programados abajo. Shopify, Notion y GitHub (semana del 1-sep) quedan en `draft: true` sin fecha.

## Serie: Agentes en Producción y Casos de Uso Reales

| # | Fecha | Slug | Título | Serie | Parte | Pillar |
|---|-------|------|--------|-------|-------|--------|
| 1 | 2026-10-13 | `postman-agent-mode-para-40-millones-de-desarrolladores-con-amazon-bedrock` | Postman: Agent Mode para 40 Millones de Desarrolladores con Amazon Bedrock | Arquitectura de Software Avanzada | 22 | arquitectura |
| 2 | 2026-10-15 | `sps-commerce-la-fabrica-de-software-que-proceso-500-tickets-con-cero-incidentes` | SPS Commerce: La Fábrica de Software que Procesó 500 Tickets con Cero Incidentes | Construyendo con IA: Lo que nadie te dice | 21 | agentes-en-produccion |
| 3 | 2026-10-17 | `mufg-ontologia-y-grafos-de-conocimiento-para-cortar-90-del-trabajo-de-flujogramas` | MUFG: Ontología y Grafos de Conocimiento para Cortar 90% del Trabajo de Flujogramas | Construyendo con IA: Lo que nadie te dice | 22 | agentes-en-produccion |

## Foco de cada post

1. **Postman — Agent Mode (40M de desarrolladores sobre Amazon Bedrock)** — El problema no era el modelo: era hacer legible un producto maduro para un agente. Tres patrones emergen a escala: contener el tool sprawl (selección dinámica de tools, no catálogo entero), lecturas por esquema, y tratar el contexto —no la capacidad— como cuello de botella. Debajo, el runtime administrado: flexibilidad de modelo sin reconstruir integración, inferencia cross-Region, retención dependiente del modelo, y prompt caching en dos niveles (1h para el núcleo estable, 5min para el contexto variable). Supervisión humana como diseño: aprobación antes de acciones con estado y redacción de PII con Bedrock Guardrails.

2. **SPS Commerce — fábrica de software (500+ tickets, 0 incidentes)** — Conectar agentes que ya existían, dispersos por equipos, en una línea de ensamblaje con gobernanza. Flujo: planning agent redacta plan → humano aprueba → coding agent abre PR → humano mergea. El agente se trata como "ingeniero junior": aprobación humana donde los ingenieros ya revisan. Requisitos del andamiaje: contexto compartido (context lake), gobernanza, orquestación de handoffs, y visibilidad del ROI. Resultado en 4 meses: 500+ tickets, ~400 story points, 0 incidentes, >50% utilidad reportada.

3. **MUFG — ontología + grafo de conocimiento (11→1 días-persona, 90%)** — Por qué la IA generativa sola fallaba en banca regulada: el modelo no sabía qué es un procedimiento válido, así que inventaba. La solución añade dos capas debajo del LLM: una ontología (RDF/OWL, el plano del dominio) y un grafo de instancias en Amazon Neptune. El agente consulta el subgrafo antes de generar, restringe lo que el LLM puede emitir y cita nodos/aristas. La ontología no estandariza (eso es decisión humana); acelera el trabajo de sistema que precede cada decisión. Patrón replicable a cualquier empresa regulada que creció por adquisición.

## Cron Jobs de Publicación

| Post | Fecha | Job ID | Acción |
|------|-------|--------|--------|
| Postman | 2026-10-13 09:00 CST | `8b4ee5f4f3da` | `draft: false` + commit + push + PR a develop |
| SPS Commerce | 2026-10-15 09:00 CST | `b158de7219e3` | `draft: false` + commit + push + PR a develop |
| MUFG | 2026-10-17 09:00 CST | `545275884054` | `draft: false` + commit + push + PR a develop |

---

*Generado automáticamente por Hermes Agent — 2026-10-12*