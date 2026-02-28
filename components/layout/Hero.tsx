"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Sparkles } from "lucide-react";

interface HeroProps {
    githubUrl: string;
    linkedinUrl: string;
    blueskyUrl: string;
    lang: string;
    dict: {
        title: string;
        subtitle: string;
    };
}

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

// Bluesky SVG Icon
const BlueskyIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 10.8c-1.32-2.31-3.6-5.8-6.12-6.84C3.36 2.94 2 3.6 2 6c0 1.2.6 4.8 1.2 6 .6 1.2 2.4 2.4 3.6 2.4-1.2 0-3 .6-3 1.8 0 1.8 1.8 4.2 4.2 4.2 3 0 4.8-2.4 4.8-4.2 0 1.8 1.8 4.2 4.8 4.2 2.4 0 4.2-2.4 4.2-4.2 0-1.2-1.8-1.8-3-1.8 1.2 0 3-1.2 3.6-2.4.6-1.2 1.2-4.8 1.2-6 0-2.4-1.36-3.06-3.88-2.04-2.52 1.04-4.8 4.53-6.12 6.84Z" />
    </svg>
);

export function Hero({ githubUrl, linkedinUrl, blueskyUrl, lang, dict }: HeroProps) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <section ref={ref} className="relative overflow-hidden">
            {/* ── Minimalist Background ──────────────────────────── */}
            <div className="absolute inset-0 bg-[var(--bg-base)]" />

            {/* ── Content ─────────────────────────────────────────── */}
            <motion.div
                style={{ y, opacity }}
                className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-4"
                >
                    {/* Header Row: Photo + Name */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Profile Photo */}
                        <motion.div
                            variants={itemVariants}
                            className="relative group shrink-0"
                        >
                            <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border-2 border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl">
                                <div className="absolute inset-0 bg-[url('https://6pxof7rpjdk6gkca.public.blob.vercel-storage.com/IMG20260121162350~2.jpeg')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                            </div>
                        </motion.div>

                        {/* Name */}
                        <div className="flex flex-col items-start">
                            <motion.h1
                                variants={itemVariants}
                                className="font-display text-2xl font-extrabold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl"
                            >
                                {lang === 'es' ? 'Soy ' : "I'm "}
                                <span className="gradient-text">Jorge Ochoa</span>
                            </motion.h1>
                            <motion.div variants={itemVariants} className="mt-1">
                                <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[var(--brand-light)]">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    Software Architect · Builder
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Bio & Socials Row */}
                    <div className="max-w-2xl space-y-4">
                        {/* Subheading */}
                        <motion.p
                            variants={itemVariants}
                            className="text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg font-medium"
                        >
                            {dict.subtitle}
                        </motion.p>

                        {/* Social Links */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap items-center gap-3"
                        >
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="GitHub"
                                className="group flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--brand-light)] hover:text-[var(--text-primary)] hover:bg-[var(--brand)]/5"
                            >
                                <Github className="h-3.5 w-3.5" />
                                GH
                            </a>

                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="LinkedIn"
                                className="group flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--brand-light)] hover:text-[var(--text-primary)] hover:bg-[var(--brand)]/5"
                            >
                                <Linkedin className="h-3.5 w-3.5" />
                                LI
                            </a>

                            <a
                                href={blueskyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Bluesky"
                                className="group flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] transition-all duration-300 hover:border-[#0285FF] hover:text-[var(--text-primary)] hover:bg-[#0285FF]/5"
                            >
                                <BlueskyIcon className="h-3.5 w-3.5" />
                                BS
                            </a>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom fade to body */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg-base)] to-transparent" />
        </section>
    );
}
