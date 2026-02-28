"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Sparkles } from "lucide-react";

const pillars = [
    { label: "Architecture", icon: "🏗️" },
    { label: "Python", icon: "🐍" },
    { label: "Next.js", icon: "▲" },
    { label: "AI / LLMs", icon: "🤖" },
    { label: "SaaS & ERP", icon: "🚀" },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
} as const;

interface HeroProps {
    githubUrl: string;
    linkedinUrl: string;
}

export function Hero({ githubUrl, linkedinUrl }: HeroProps) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    // Parallax: content drifts up subtly as user scrolls
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <section ref={ref} className="relative overflow-hidden">
            {/* ── Layered background ──────────────────────────────── */}
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-grid opacity-40" />

            {/* Primary radial glow from top center */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(99,102,241,0.25),transparent)]" />

            {/* Secondary accent glow — bottom left */}
            <div className="absolute bottom-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.08),transparent_70%)]" />

            {/* Floating orbs */}
            <motion.div
                className="absolute right-[10%] top-[15%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15),transparent_70%)]"
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute left-[5%] top-[40%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.12),transparent_70%)]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            {/* ── Content ─────────────────────────────────────────── */}
            <motion.div
                style={{ y, opacity }}
                className="relative mx-auto max-w-4xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-start gap-6"
                >
                    {/* Eyebrow badge */}
                    <motion.div variants={itemVariants}>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(99,102,241,0.35)] bg-[rgba(99,102,241,0.08)] py-1.5 pl-3 pr-4 text-sm text-[var(--brand-light)] backdrop-blur-sm">
                            <motion.span
                                className="flex h-2 w-2 rounded-full bg-[var(--accent)]"
                                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <Sparkles className="h-3.5 w-3.5" />
                            Software Architect · Builder · Writer
                        </div>
                    </motion.div>

                    {/* Main heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="font-display text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
                    >
                        <span className="text-[var(--text-primary)]">Hi, I&apos;m </span>
                        <span
                            className="gradient-text"
                            style={{
                                filter: "drop-shadow(0 0 40px rgba(99,102,241,0.4))",
                            }}
                        >
                            Jorge Ochoa
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        variants={itemVariants}
                        className="max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] sm:text-xl"
                    >
                        I build production-grade software —{" "}
                        <span className="font-medium text-[var(--text-primary)]">
                            ERPs, AI agents, and developer platforms
                        </span>
                        . I write about the patterns, mistakes, and lessons learned
                        along the way.
                    </motion.p>

                    {/* Content pillars */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-2"
                    >
                        {pillars.map(({ label, icon }, i) => (
                            <motion.span
                                key={label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                                whileHover={{ scale: 1.05, y: -1 }}
                                className="inline-flex cursor-default items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:border-[rgba(99,102,241,0.3)] hover:text-[var(--text-primary)]"
                            >
                                <span>{icon}</span>
                                {label}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap items-center gap-3"
                    >
                        <Link
                            href="/blog"
                            id="hero-cta-blog"
                            className="group inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(99,102,241,0.4)] transition-all duration-300 hover:bg-[var(--brand-dark)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] active:scale-[0.98]"
                        >
                            Read the blog
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>

                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            id="hero-cta-github"
                            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] backdrop-blur-sm transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] active:scale-[0.98]"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </a>

                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            id="hero-cta-linkedin"
                            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] backdrop-blur-sm transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] active:scale-[0.98]"
                        >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                        </a>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Bottom fade to body */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-base)] to-transparent" />
        </section>
    );
}
