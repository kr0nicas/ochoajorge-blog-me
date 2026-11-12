# Calendario Semanal de Contenido — Semana del 9 de Noviembre, 2026

## Tema de la semana: dónde vive el control en un sistema de agentes

| # | Fecha | Slug | Título | Serie | Parte | Pillar |
|---|-------|------|--------|-------|-------|--------|
| 1 | 2026-11-10 | `ruteo-en-cascada-para-agentes-el-70-por-ciento-de-u-mobile-que-nunca-toca-un-llm` | Ruteo en Cascada para Agentes: El 70 por Ciento de U Mobile que Nunca Toca un LLM | Construyendo con IA: Lo que nadie te dice | 26 | agentes-en-produccion |
| 2 | 2026-11-12 | `ai-sdlc-en-verisk-5-agentes-sin-orquestador-y-un-humano-en-cada-frontera` | AI-SDLC en Verisk: 5 Agentes sin Orquestador y un Humano en Cada Frontera | Arquitectura de Software Avanzada | 26 | agentes-en-produccion |
| 3 | 2026-11-14 | `agentes-multi-tenant-silo-pool-o-bridge-y-por-que-axonius-eligio-silo` | Agentes Multi-Tenant: Silo, Pool o Bridge y Por Qué Axonius Eligió Silo | Arquitectura de Software Avanzada | 27 | seguridad |

## Foco de cada post

1. **U Mobile (ruteo en cascada)**: el helpdesk agéntico AiDaH resuelve ~70% de las peticiones con reglas determinísticas, ~20% con un clasificador ligero y solo ~10% con el orquestador completo. El post cubre el chequeo de seguridad previo al ruteo, las plantillas de prompt como contrato de entrada y un router hexagonal en Go con deadlines, umbrales y métricas por nivel. Resultado: tickets −84.5% en aprovisionamiento.

2. **Verisk (AI-SDLC)**: cinco agentes por etapa (Requirements, Grooming, Developer, Code Review, QA) sin orquestador central. Las transiciones de Jira funcionan como bus de eventos y hay un gate humano obligatorio en cada frontera. Temas: coreografía vs orquestación, cascada de errores, auditoría SOX como subproducto y QA en dos pasos. Aceptación >90% y costo por story point 20-30% menor, incluyendo cómputo.

3. **Axonius (multi-tenant)**: pool vs bridge (Cedar + interceptor STS) vs silo. Axonius eligió silo para heredar su modelo de tenancy existente: runtime y ENI por cliente, JWT de impersonación de corta vida y tope de tokens aplicado vía IAM-deny. Incluye un guard de presupuesto de tokens en Go que falla cerrado y una matriz de decisión.

## Fuentes

- https://aws.amazon.com/blogs/machine-learning/how-u-mobile-built-agentic-telco-operations-with-amazon-bedrock-agentcore/ (04-nov-2026)
- https://aws.amazon.com/blogs/industries/reinventing-software-delivery-with-ai-sdlc-on-amazon-bedrock-agentcore/ (05-nov-2026)
- https://aws.amazon.com/blogs/machine-learning/how-axonius-built-secure-multi-tenant-ai-agents-on-bedrock-agentcore/ (18-ago-2026)

## Cron Jobs de Publicación

| Post | Fecha | Acción |
|------|-------|--------|
| U Mobile | 2026-11-10 09:00 CST | `draft: false` + build + commit + push + PR a develop |
| Verisk | 2026-11-12 09:00 CST | `draft: false` + build + commit + push + PR a develop |
| Axonius | 2026-11-14 09:00 CST | `draft: false` + build + commit + push + PR a develop |

Rama: `content/semana-nov09-agentes-produccion` (desde `origin/develop`)

**Dependencia:** el post 3 enlaza a Bayer ADE y Eon (rama `content/semana-nov02-agentes-produccion`, aún sin merge a develop). Mergear nov02 antes que nov09 para evitar enlaces 404.

---

*Generado por Hermes Agent el 2026-11-09.*
