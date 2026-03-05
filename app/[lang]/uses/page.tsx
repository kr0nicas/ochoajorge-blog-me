import type { Metadata } from "next";
import {
    Code2, Terminal, Cpu, Globe, Layers, Wrench,
    MonitorSmartphone, Package, Cloud, Brain
} from "lucide-react";
import { siteConfig } from "@/lib/utils";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const isSpanish = lang === "es";
    return {
        metadataBase: new URL("https://ochoajorge.me"),
        title: isSpanish ? "Stack & Herramientas | Jorge Ochoa" : "Uses & Tools | Jorge Ochoa",
        description: isSpanish
            ? "El hardware, software y servicios que uso a diario para construir sistemas de alto rendimiento."
            : "The hardware, software, and services I use daily to build high-performance systems.",
        openGraph: {
            url: `${siteConfig.url}/${lang}/uses`,
        },
    };
}

/* ── Data ────────────────────────────────────────────────────── */
const sections = {
    es: [
        {
            icon: MonitorSmartphone,
            title: "Hardware",
            color: "var(--brand)",
            items: [
                {
                    name: "MacBook Pro M3 Pro — 18 GB",
                    description: "Mi máquina principal. La memoria unificada hace una diferencia enorme corriendo múltiples contenedores Docker, un servidor de dev y modelos de IA locales.",
                    link: null,
                },
                {
                    name: "Pantalla LG 27\" 4K UltraFine",
                    description: "El salto a 4K en UI/UX es irreversible. Perfecta para revisar diseños pixel-perfect y leer docs largas.",
                    link: null,
                },
                {
                    name: "Logitech MX Keys + MX Master 3",
                    description: "El combo definitivo para productividad. El scroll de la MX Master se adapta a la velocidad — pequeño detalle, gran diferencia.",
                    link: null,
                },
            ],
        },
        {
            icon: Code2,
            title: "Editor & Terminal",
            color: "var(--accent)",
            items: [
                {
                    name: "Cursor (fork de VS Code)",
                    description: "Mi editor principal desde 2024. El chat inline con contexto del codebase cambió completamente mi flujo de trabajo. Cuando necesito pensar en arquitectura a alto nivel, cambio a Gemini en Antigravity.",
                    link: "https://cursor.sh",
                },
                {
                    name: "Warp Terminal",
                    description: "Terminal con IA integrada y blocks navegables. El autocompletado de comandos bash con contexto es sorprendentemente útil para comandos kubectl y docker largos.",
                    link: "https://warp.dev",
                },
                {
                    name: "JetBrains Mono",
                    description: "La fuente que uso tanto en el editor como en este blog. Las ligaduras para operadores de código la hacen más legible en sesiones largas.",
                    link: "https://www.jetbrains.com/lp/mono/",
                },
                {
                    name: "Tokyo Night (tema)",
                    description: "Oscuro sin ser agresivo. Los colores son semánticamente distintos sin cansar la vista.",
                    link: null,
                },
            ],
        },
        {
            icon: Layers,
            title: "Stack Principal",
            color: "var(--brand-light)",
            items: [
                {
                    name: "Python + FastAPI",
                    description: "Mi lenguaje del día a día para backend, APIs y agentes de IA. FastAPI es el punto dulce entre velocidad de desarrollo y rendimiento en producción.",
                    link: "https://fastapi.tiangolo.com",
                },
                {
                    name: "Next.js 15 (App Router)",
                    description: "Para todo lo que necesita un frontend. Los React Server Components realmente cambiaron cómo pienso la separación cliente/servidor.",
                    link: "https://nextjs.org",
                },
                {
                    name: "Go",
                    description: "Para microservicios que necesitan rendimiento predecible bajo carga. Lo uso en los servicios de procesamiento de documentos de Orbis 8.",
                    link: "https://go.dev",
                },
                {
                    name: "PostgreSQL + SQLAlchemy",
                    description: "Mi base de datos de facto. Schemas separados para multi-tenancy — más simple que múltiples DBs.",
                    link: "https://www.postgresql.org",
                },
            ],
        },
        {
            icon: Brain,
            title: "IA & Agentes",
            color: "#f59e0b",
            items: [
                {
                    name: "Claude (Anthropic)",
                    description: "Para razonamiento complejo, revisión de arquitectura y generación de código no trivial. Tiene el mejor contexto de código de todos los modelos que he probado.",
                    link: "https://claude.ai",
                },
                {
                    name: "Gemini (Google) via Antigravity",
                    description: "Mi 'arquitecto senior' digital. Perfecto para pensar en estrategia de plataforma, diseño de sistemas y tomar decisiones con contexto largo del proyecto.",
                    link: null,
                },
                {
                    name: "LangGraph + LangChain",
                    description: "Para construir agentes con estado. LangGraph resuelve el problema de coordinación entre agentes de una forma que escala.",
                    link: "https://langchain.com",
                },
            ],
        },
        {
            icon: Cloud,
            title: "Infraestructura & Cloud",
            color: "#10b981",
            items: [
                {
                    name: "Vercel",
                    description: "Para frontend SSG/ISR. La DX es imbatible — git push y está en producción. Este blog vive aquí.",
                    link: "https://vercel.com",
                },
                {
                    name: "Google Cloud (GKE)",
                    description: "Para los microservicios de Orbis 8. Kubernetes gestionado con Autopilot mode — sin gestión de nodos.",
                    link: "https://cloud.google.com",
                },
                {
                    name: "Docker + Docker Compose",
                    description: "Todo corre en contenedores localmente. Compose para dev, manifiestos k8s para staging/production.",
                    link: "https://docker.com",
                },
                {
                    name: "Supabase",
                    description: "Para proyectos que necesitan backend rápido. El realtime y el Auth vienen incluidos.",
                    link: "https://supabase.com",
                },
            ],
        },
        {
            icon: Wrench,
            title: "Productividad & SaaS",
            color: "#8b5cf6",
            items: [
                {
                    name: "Linear",
                    description: "Para gestión de proyectos. Mucho más rápido que Jira. Cycles + Projects cubre todo lo que necesito para Orbis 8.",
                    link: "https://linear.app",
                },
                {
                    name: "Raycast",
                    description: "Reemplazó Spotlight en el primer día. El clipboard history solo ya justifica el cambio.",
                    link: "https://raycast.com",
                },
                {
                    name: "Obsidian",
                    description: "Para notas personales y arquitectura de sistemas. El grafo de links entre notas ayuda a ver conexiones no obvias.",
                    link: "https://obsidian.md",
                },
                {
                    name: "Screen Studio",
                    description: "Para grabar demos de producto con estética. Los zooms y transiciones automáticas hacen los videos mucho más profesionales.",
                    link: "https://screenstudio.lemonsqueezy.com",
                },
            ],
        },
    ],
    en: [
        {
            icon: MonitorSmartphone,
            title: "Hardware",
            color: "var(--brand)",
            items: [
                {
                    name: "MacBook Pro M3 Pro — 18 GB",
                    description: "My main machine. The unified memory makes a huge difference when running multiple Docker containers, a dev server, and local AI models.",
                    link: null,
                },
                {
                    name: "LG 27\" 4K UltraFine Monitor",
                    description: "Once you go 4K for UI/UX, you can't go back. Perfect for pixel-perfect design review and long doc reading sessions.",
                    link: null,
                },
                {
                    name: "Logitech MX Keys + MX Master 3",
                    description: "The ultimate productivity combo. The MX Master's adaptive scroll wheel is a small detail with a big impact.",
                    link: null,
                },
            ],
        },
        {
            icon: Code2,
            title: "Editor & Terminal",
            color: "var(--accent)",
            items: [
                {
                    name: "Cursor (VS Code fork)",
                    description: "My main editor since 2024. The inline chat with codebase context completely changed my workflow. For high-level architecture thinking, I switch to Gemini via Antigravity.",
                    link: "https://cursor.sh",
                },
                {
                    name: "Warp Terminal",
                    description: "AI-powered terminal with navigable blocks. The context-aware bash autocomplete is surprisingly useful for long kubectl and docker commands.",
                    link: "https://warp.dev",
                },
                {
                    name: "JetBrains Mono",
                    description: "The font I use in both my editor and this blog. Code operator ligatures make it noticeably more readable in long sessions.",
                    link: "https://www.jetbrains.com/lp/mono/",
                },
                {
                    name: "Tokyo Night (theme)",
                    description: "Dark without being aggressive. Semantically distinct colors without eye strain.",
                    link: null,
                },
            ],
        },
        {
            icon: Layers,
            title: "Core Stack",
            color: "var(--brand-light)",
            items: [
                {
                    name: "Python + FastAPI",
                    description: "My daily driver for backend, APIs, and AI agents. FastAPI is the sweet spot between development speed and production performance.",
                    link: "https://fastapi.tiangolo.com",
                },
                {
                    name: "Next.js 15 (App Router)",
                    description: "For everything that needs a frontend. React Server Components really changed how I think about client/server boundaries.",
                    link: "https://nextjs.org",
                },
                {
                    name: "Go",
                    description: "For microservices needing predictable performance under load. I use it for Orbis 8's document processing services.",
                    link: "https://go.dev",
                },
                {
                    name: "PostgreSQL + SQLAlchemy",
                    description: "My default database. Separate schemas for multi-tenancy — simpler than multiple DBs.",
                    link: "https://www.postgresql.org",
                },
            ],
        },
        {
            icon: Brain,
            title: "AI & Agents",
            color: "#f59e0b",
            items: [
                {
                    name: "Claude (Anthropic)",
                    description: "For complex reasoning, architecture review, and non-trivial code generation. Best code context understanding of all models I've tested.",
                    link: "https://claude.ai",
                },
                {
                    name: "Gemini (Google) via Antigravity",
                    description: "My digital 'senior architect'. Perfect for platform strategy, system design, and long-context decisions about the project.",
                    link: null,
                },
                {
                    name: "LangGraph + LangChain",
                    description: "For building stateful agents. LangGraph solves the agent coordination problem in a way that actually scales.",
                    link: "https://langchain.com",
                },
            ],
        },
        {
            icon: Cloud,
            title: "Infrastructure & Cloud",
            color: "#10b981",
            items: [
                {
                    name: "Vercel",
                    description: "For SSG/ISR frontends. The DX is unbeatable — git push and it's live. This blog lives here.",
                    link: "https://vercel.com",
                },
                {
                    name: "Google Cloud (GKE)",
                    description: "For Orbis 8's microservices. Managed Kubernetes with Autopilot mode — no node management.",
                    link: "https://cloud.google.com",
                },
                {
                    name: "Docker + Docker Compose",
                    description: "Everything runs in containers locally. Compose for dev, k8s manifests for staging/production.",
                    link: "https://docker.com",
                },
                {
                    name: "Supabase",
                    description: "For projects needing a fast backend. Realtime and Auth included.",
                    link: "https://supabase.com",
                },
            ],
        },
        {
            icon: Wrench,
            title: "Productivity & SaaS",
            color: "#8b5cf6",
            items: [
                {
                    name: "Linear",
                    description: "For project management. Much faster than Jira. Cycles + Projects covers everything I need for Orbis 8.",
                    link: "https://linear.app",
                },
                {
                    name: "Raycast",
                    description: "Replaced Spotlight on day one. The clipboard history alone justifies the switch.",
                    link: "https://raycast.com",
                },
                {
                    name: "Obsidian",
                    description: "For personal notes and system architecture. The graph view of linked notes helps spot non-obvious connections.",
                    link: "https://obsidian.md",
                },
                {
                    name: "Screen Studio",
                    description: "For recording polished product demos. Automatic zooms and transitions make videos look way more professional.",
                    link: "https://screenstudio.lemonsqueezy.com",
                },
            ],
        },
    ],
};

/* ── Page ─────────────────────────────────────────────────────── */
export default async function UsesPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const isSpanish = lang === "es";
    const content = lang === "en" ? sections.en : sections.es;

    return (
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="mb-20">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--brand-light)]">
                    /uses
                </p>
                <h1 className="font-display text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl">
                    {isSpanish ? "Mi Stack &" : "My Stack &"}{" "}
                    <span className="gradient-text">
                        {isSpanish ? "Herramientas" : "Tools"}
                    </span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
                    {isSpanish
                        ? "El hardware, software y servicios que uso a diario para construir sistemas de alto rendimiento. Lista actualizada en Marzo 2026."
                        : "The hardware, software, and services I use daily to build high-performance systems. Updated March 2026."}
                </p>
            </div>

            {/* ── Sections ───────────────────────────────────────── */}
            <div className="space-y-20">
                {content.map((section) => {
                    const Icon = section.icon;
                    return (
                        <section key={section.title}>
                            {/* Section header */}
                            <div className="mb-8 flex items-center gap-3">
                                <div
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)]"
                                    style={{ background: `${section.color}1a` }}
                                >
                                    <Icon
                                        className="h-4.5 w-4.5"
                                        style={{ color: section.color }}
                                    />
                                </div>
                                <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                                    {section.title}
                                </h2>
                            </div>

                            {/* Items grid */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                {section.items.map((item) => (
                                    <div
                                        key={item.name}
                                        className="group card-glass p-5 transition-all duration-200 hover:border-[var(--border-brand)]"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] leading-snug">
                                                {item.name}
                                            </h3>
                                            {item.link && (
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`Visit ${item.name}`}
                                                    className="shrink-0 rounded-md border border-[var(--border)] p-1 text-[var(--text-muted)] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-[var(--border-brand)] hover:text-[var(--brand-light)]"
                                                >
                                                    <Globe className="h-3.5 w-3.5" />
                                                </a>
                                            )}
                                        </div>
                                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* ── Footer note ────────────────────────────────────── */}
            <div className="mt-24 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center">
                <p className="text-sm text-[var(--text-muted)]">
                    {isSpanish
                        ? "¿Curioso por algo que no está aquí? Escríbeme en "
                        : "Curious about something not listed here? Reach me on "}
                    <a
                        href={siteConfig.author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[var(--brand-light)] hover:underline"
                    >
                        LinkedIn
                    </a>
                    {isSpanish ? " o " : " or "}
                    <a
                        href={siteConfig.author.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[var(--brand-light)] hover:underline"
                    >
                        GitHub
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
