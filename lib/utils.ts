import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind CSS classes safely.
 * Combines clsx (conditional classes) with tailwind-merge (conflict resolution).
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Site configuration — single source of truth for metadata.
 */
export const siteConfig = {
    name: "Jorge Ochoa",
    title: "Jorge Ochoa — Software Architect & Developer",
    description:
        "Software architect, Python & Next.js developer. Writing about Clean Architecture, AI systems, and building production-grade software.",
    url: "https://jorgeochoa.dev",
    ogImage: "https://jorgeochoa.dev/og.png",
    author: {
        name: "Jorge Ochoa",
        twitter: "@jorgeochoa",
        github: "https://github.com/jorgeochoa",
        linkedin: "https://linkedin.com/in/jorgeochoa",
    },
    keywords: [
        "software architecture",
        "clean architecture",
        "python",
        "next.js",
        "fastapi",
        "langchain",
        "ai engineering",
        "erp",
        "saas",
    ],
};

export type SiteConfig = typeof siteConfig;
