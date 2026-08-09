"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

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
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
} as const;

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

const SOCIAL_LINK_CLASSES =
    "flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--brand-light)] hover:text-[var(--text-primary)]";

export function Hero({ githubUrl, linkedinUrl, blueskyUrl, lang, dict }: HeroProps) {
    return (
        <section className="relative overflow-hidden bg-[var(--bg-base)]">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
            >
                {/* Prompt */}
                <motion.p
                    variants={itemVariants}
                    className="font-mono text-sm text-[var(--brand)]"
                    aria-hidden="true"
                >
                    $ whoami
                </motion.p>

                {/* Headline */}
                <motion.h1
                    variants={itemVariants}
                    className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-7xl"
                >
                    Jorge Ochoa
                    <span className="text-[var(--brand)]">.</span>
                </motion.h1>

                {/* Role line */}
                <motion.p
                    variants={itemVariants}
                    className="mt-3 font-mono text-sm text-[var(--text-muted)]"
                >
                    {dict.title}
                </motion.p>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg"
                >
                    {dict.subtitle}
                </motion.p>

                {/* Socials */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 flex flex-wrap items-center gap-3"
                >
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="GitHub"
                        className={SOCIAL_LINK_CLASSES}
                    >
                        <Github className="h-3.5 w-3.5" />
                        GH
                    </a>
                    <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="LinkedIn"
                        className={SOCIAL_LINK_CLASSES}
                    >
                        <Linkedin className="h-3.5 w-3.5" />
                        LI
                    </a>
                    <a
                        href={blueskyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Bluesky"
                        className={SOCIAL_LINK_CLASSES}
                    >
                        <BlueskyIcon className="h-3.5 w-3.5" />
                        BS
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}
