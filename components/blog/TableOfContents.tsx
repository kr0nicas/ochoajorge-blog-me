"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Heading {
    id: string;
    text: string;
    level: number; // 2 | 3 | 4
}

interface TableOfContentsProps {
    lang?: string;
    variant?: "sidebar" | "mobile";
}

export function TableOfContents({ lang = "es", variant = "sidebar" }: TableOfContentsProps) {
    const isSpanish = lang === "es";
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const article = document.getElementById("article-content");
        if (!article) return;

        const nodes = article.querySelectorAll<HTMLHeadingElement>(
            "h2[id], h3[id], h4[id]"
        );

        const parsed = Array.from(nodes).map((el) => ({
            id: el.id,
            text: el.textContent?.replace(/#/g, "").trim() ?? "",
            level: parseInt(el.tagName[1], 10),
        }));

        // Defer update to avoid synchronous setState in effect body.
        const rafId = window.requestAnimationFrame(() => setHeadings(parsed));
        return () => window.cancelAnimationFrame(rafId);
    }, []);

    // IntersectionObserver to track active heading
    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const visible = entries.find((e) => e.isIntersecting);
            if (visible) setActiveId(visible.target.id);
        },
        []
    );

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(handleIntersect, {
            rootMargin: "-80px 0px -60% 0px",
            threshold: 0,
        });

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings, handleIntersect]);

    if (headings.length < 2) return null;

    const list = (
        <ol className="space-y-1.5 text-sm">
            {headings.map(({ id, text, level }) => (
                <li key={id}>
                    <a
                        href={`#${id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document
                                .getElementById(id)
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={cn(
                            "block truncate rounded py-1 transition-colors duration-150 no-underline",
                            level === 2 && "pl-0",
                            level === 3 && "pl-3",
                            level === 4 && "pl-6",
                            activeId === id
                                ? "text-[var(--brand-light)] font-medium"
                                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                        )}
                    >
                        {text}
                    </a>
                </li>
            ))}
        </ol>
    );

    if (variant === "mobile") {
        return (
            <details className="card mb-8 p-4 xl:hidden">
                <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                    {isSpanish ? "En esta página" : "On this page"}
                </summary>
                <nav
                    aria-label={isSpanish ? "Tabla de contenidos" : "Table of contents"}
                    className="mt-4"
                >
                    {list}
                </nav>
            </details>
        );
    }

    return (
        <nav
            aria-label={isSpanish ? "Tabla de contenidos" : "Table of contents"}
            className="card hidden p-5 xl:block"
        >
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {isSpanish ? "En esta página" : "On this page"}
            </p>
            {list}
        </nav>
    );
}
