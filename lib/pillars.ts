/**
 * Canonical pillar (section) taxonomy — single source of truth.
 * Consumed by: posts parsing, /temas & /topics routes, sitemap, OG images.
 * The Spanish slug is the ID stored in frontmatter for BOTH locales.
 * Keep scripts/seo-audit.mjs PILLAR_IDS in sync when editing.
 */

export const PILLAR_IDS = [
    "construir-con-ia",
    "agentes-en-produccion",
    "arquitectura",
    "seguridad",
] as const;

export type PillarId = (typeof PILLAR_IDS)[number];

export interface PillarDef {
    id: PillarId;
    /** OG glow color, fixed per section */
    hue: "blue" | "orange";
    routeSlug: { es: string; en: string };
    name: { es: string; en: string };
    intro: { es: string; en: string };
}

export const PILLARS: Record<PillarId, PillarDef> = {
    "construir-con-ia": {
        id: "construir-con-ia",
        hue: "orange",
        routeSlug: { es: "construir-con-ia", en: "building-with-ai" },
        name: {
            es: "Construir con IA sin perder el control",
            en: "Building with AI without losing control",
        },
        intro: {
            es: "Usas Claude Code o Cursor a diario y sientes que el código se te va de las manos. Aquí: disciplina agentic, deuda técnica y cómo domar la caja negra.",
            en: "You use Claude Code or Cursor daily and feel the code slipping away from you. Here: agentic discipline, tech debt, and taming the black box.",
        },
    },
    "agentes-en-produccion": {
        id: "agentes-en-produccion",
        hue: "blue",
        routeSlug: { es: "agentes-en-produccion", en: "agents-in-production" },
        name: {
            es: "Agentes en producción",
            en: "Agents in production",
        },
        intro: {
            es: "El demo funcionó. Ahora hay que operarlo: orquestación multi-agente, MCP, RAG, observabilidad y Kubernetes.",
            en: "The demo worked. Now you have to run it: multi-agent orchestration, MCP, RAG, observability, and Kubernetes.",
        },
    },
    arquitectura: {
        id: "arquitectura",
        hue: "blue",
        routeSlug: { es: "arquitectura", en: "architecture" },
        name: {
            es: "Arquitectura que aguanta",
            en: "Architecture that lasts",
        },
        intro: {
            es: "Adoptar IA sin romper lo que ya funciona: hexagonal, SOLID, clean architecture e integración enterprise.",
            en: "Adopting AI without breaking what already works: hexagonal, SOLID, clean architecture, and enterprise integration.",
        },
    },
    seguridad: {
        id: "seguridad",
        hue: "orange",
        routeSlug: { es: "seguridad", en: "security" },
        name: {
            es: "Seguridad y gobernanza",
            en: "Security & governance",
        },
        intro: {
            es: "¿Quién vigila al agente? Defensas en capas, hardening y gobernanza a escala.",
            en: "Who watches the agent? Layered defenses, hardening, and governance at scale.",
        },
    },
};

export function isPillarId(value: unknown): value is PillarId {
    return typeof value === "string" && (PILLAR_IDS as readonly string[]).includes(value);
}

export function pillarByRouteSlug(slug: string, lang: "es" | "en"): PillarDef | null {
    return Object.values(PILLARS).find((p) => p.routeSlug[lang] === slug) ?? null;
}
