import type { Metadata } from "next";
import { siteConfig } from "@/lib/utils";
import { ArrowRight, Mail, MapPin, Briefcase, GraduationCap, Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About | Jorge Ochoa",
    description: "Software architect and developer based in El Salvador. Building Orbis 8 and writing about high-performance software systems.",
};

const experience = [
    {
        title: "Founder & Software Architect",
        company: "Orbis 8",
        period: "2024 — Present",
        description: "Leading the development of a multi-tenant ERP SaaS for SMBs in Central America. Built with Next.js, FastAPI, and Go using Clean Architecture principles.",
    },
    {
        title: "Freelance Solutions Architect",
        company: "Various Tech Startups",
        period: "2021 — 2024",
        description: "Consulted on cloud-native migrations, CI/CD pipelines, and microservices architecture for multiple international clients.",
    },
    {
        title: "Senior Full-Stack Developer",
        company: "Regional Fintech",
        period: "2019 — 2021",
        description: "Developed and maintained core banking ledger systems using Python and legacy Java integration.",
    },
];

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
            {/* ── Headline ────────────────────────────────────────── */}
            <div className="mb-20">
                <h1 className="font-display text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                    I build tools for <span className="gradient-text">ambitious projects</span>.
                </h1>
                <p className="mt-8 text-lg leading-relaxed text-[var(--text-secondary)] max-w-3xl">
                    I&apos;m Jorge, a software architect from El Salvador. I specialize in building scalable backends,
                    intuitive frontends, and the bridges between them. Currently, I&apos;m focused on making ERP software
                    actually pleasant to use with <span className="text-[var(--text-primary)] font-medium">Orbis 8</span>.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <MapPin className="h-4 w-4 text-[var(--brand-light)]" />
                        San Salvador, SV
                    </div>
                    <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <Mail className="h-4 w-4 text-[var(--brand-light)]" />
                        jorge@example.com
                    </div>
                </div>
            </div>

            {/* ── Main Bio Section ────────────────────────────────── */}
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-24">
                <div className="lg:col-span-7">
                    <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-6"> My Journey </h2>
                    <div className="prose prose-invert max-w-none text-[var(--text-secondary)] space-y-4">
                        <p>
                            My fascination with software began when I realized that with enough lines of code,
                            I could solve problems for thousands of people from my bedroom.
                            Since then, I&apos;ve dedicated my career to understanding how robust systems are built.
                        </p>
                        <p>
                            I believe in <strong>Simplicity over Cleverness</strong>.
                            I advocate for Clean Architecture, Hexagonal patterns, and Type-safety
                            not because they are trendy, but because they allow teams to move fast without breaking things
                            long after the initial launch.
                        </p>
                        <p>
                            Outside of coding, I enjoy roasting my own coffee, reading about systemic design,
                            and exploring the beautiful mountains of my home country.
                        </p>
                    </div>

                    <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-8 mt-16 flex items-center gap-3">
                        <Briefcase className="h-6 w-6 text-[var(--brand-light)]" />
                        Experience
                    </h2>
                    <div className="space-y-12">
                        {experience.map((item, i) => (
                            <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-1.5 before:h-[calc(100%-8px)] before:w-px before:bg-[var(--border)]">
                                <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full border border-[var(--brand)] bg-[var(--bg-base)] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{item.title}</h3>
                                    <span className="text-sm font-medium text-[var(--brand-light)] tabular-nums">{item.period}</span>
                                </div>
                                <p className="text-sm font-medium text-[var(--text-muted)] mt-1">{item.company}</p>
                                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Sidebar: Connect ─────────────────────────────── */}
                <aside className="lg:col-span-5">
                    <div className="sticky top-24 space-y-8">
                        {/* Profile Image card mock/placeholder */}
                        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 shadow-2xl">
                            <div className="aspect-square relative rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] overflow-hidden flex items-center justify-center">
                                <span className="text-5xl font-display font-bold text-white/20">JO</span>
                                {/* Mock image overlay */}
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-60" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-sm font-bold text-white uppercase tracking-widest">Built in SV</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="card-glass p-6">
                            <h3 className="font-display font-bold text-[var(--text-primary)] mb-4">Connect</h3>
                            <div className="space-y-3">
                                <a href={siteConfig.author.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--brand)] hover:text-[var(--text-primary)]">
                                    <Github className="h-4 w-4" />
                                    GitHub
                                    <ArrowRight className="h-3 w-3 ml-auto opacity-40" />
                                </a>
                                <a href={siteConfig.author.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--brand)] hover:text-[var(--text-primary)]">
                                    <Linkedin className="h-4 w-4" />
                                    LinkedIn
                                    <ArrowRight className="h-3 w-3 ml-auto opacity-40" />
                                </a>
                                <a href={`https://twitter.com/${siteConfig.author.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--brand)] hover:text-[var(--text-primary)]">
                                    <Twitter className="h-4 w-4" />
                                    Twitter
                                    <ArrowRight className="h-3 w-3 ml-auto opacity-40" />
                                </a>
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="card-glass p-6">
                            <h3 className="font-display font-bold text-[var(--text-primary)] mb-4 uppercase text-xs tracking-widest">Technical Arsenal</h3>
                            <div className="flex flex-wrap gap-2">
                                {["Python", "FastAPI", "Go", "PostgreSQL", "React", "Next.js", "Tailwind", "Docker", "AWS", "AI Agents"].map(tech => (
                                    <span key={tech} className="rounded-full bg-[var(--border)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border border-[var(--border-strong)]/20">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
