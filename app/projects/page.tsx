import type { Metadata } from "next";
import { FolderCode, Github, ExternalLink, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Projects | Jorge Ochoa",
    description: "A showcase of technical projects and open-source contributions by Jorge Ochoa.",
};

interface Project {
    title: string;
    description: string;
    tech: string[];
    github?: string;
    link?: string;
    featured?: boolean;
    image?: string;
}

const projects: Project[] = [
    {
        title: "Orbis 8",
        description: "A multi-tenant ERP SaaS designed for small and medium businesses. Features fiscal compliance for Central America, automated inventory, and AI-driven reporting.",
        tech: ["FastAPI", "Next.js", "PostgreSQL", "Tailwind CSS"],
        link: "https://orbis8.com",
        featured: true,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    },
    {
        title: "FastAPI Clean Template",
        description: "A professional boilerplate for FastAPI following Hexagonal Architecture. Includes ready-to-use Auth, PostgreSQL (SQLAlchemy), and test examples.",
        tech: ["Python", "SQLAlchemy", "Pytest", "Docker"],
        github: "https://github.com/jorgeochoa/fastapi-clean-arch",
        featured: true,
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop",
    },
    {
        title: "Agentic Tools CLI",
        description: "A CLI tool built with Go to help developers scaffold and manage AI agent tools for LangGraph and other LLM frameworks.",
        tech: ["Go", "Cobra", "LangGraph"],
        github: "https://github.com/jorgeochoa/agentic-cli",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    },
    {
        title: "Hexagonal SVG Visualizer",
        description: "React component to visualize complex dependency trees in hexagonal software systems.",
        tech: ["React", "D3.js", "SVG"],
        github: "https://github.com/jorgeochoa/hex-svg",
        image: "https://images.unsplash.com/photo-1504868584819-f8e90526354a?q=80&w=800&auto=format&fit=crop",
    }
];

export default function ProjectsPage() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
            <header className="mb-20">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand-light)] border border-[var(--brand)]/20 shadow-lg shadow-[var(--brand)]/5 mb-6">
                    <FolderCode className="h-6 w-6" />
                </div>
                <h1 className="font-display text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl lg:text-6xl tracking-tight">
                    Projects & <span className="gradient-text">Creations</span>
                </h1>
                <p className="mt-8 text-lg leading-relaxed text-[var(--text-secondary)] max-w-2xl">
                    A selection of the systems I&apos;ve built and the experiments I&apos;ve run.
                    From production-ready SaaS to open-source developer tooling.
                </p>
            </header>

            <div className="grid gap-12 sm:grid-cols-2 lg:gap-16">
                {projects.map((project, i) => (
                    <div key={i} className="group relative flex flex-col">
                        {/* Image / Thumbnail */}
                        <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[var(--brand)]/30 group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)]">
                            {/* Background image placeholder */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${project.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Badge */}
                            <div className="absolute top-4 left-4">
                                {project.featured && (
                                    <span className="inline-flex rounded-full bg-[var(--brand)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                                        Featured
                                    </span>
                                )}
                            </div>

                            {/* Project title inside image for premium look */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <h2 className="font-display text-2xl font-bold text-white group-hover:text-[var(--brand-light)] transition-colors">
                                    {project.title}
                                </h2>
                            </div>
                        </div>

                        {/* Info */}
                        <p className="text-sm leading-relaxed text-[var(--text-secondary)] mb-6 flex-1">
                            {project.description}
                        </p>

                        {/* Tech & Links */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map(t => (
                                    <span key={t} className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                                        #{t}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] transition-colors hover:text-[var(--brand-light)]" aria-label="GitHub Repo">
                                        <Github className="h-5 w-5" />
                                    </a>
                                )}
                                {project.link && (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] transition-colors hover:text-[var(--brand-light)]" aria-label="Live Demo">
                                        <ExternalLink className="h-5 w-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="mt-32 rounded-3xl border border-[var(--border-strong)] bg-gradient-to-br from-[var(--bg-elevated)] to-black p-12 text-center shadow-2xl overflow-hidden relative">
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--brand)]/10 blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-[100px]" />

                <h3 className="relative z-10 font-display text-3xl font-bold text-[var(--text-primary)]">Interested in working together?</h3>
                <p className="relative z-10 mt-4 text-[var(--text-secondary)]">I&apos;m currently available for architecture consulting and high-impact development.</p>
                <div className="relative z-10 mt-10">
                    <Link href="/about" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                        Get in touch
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
