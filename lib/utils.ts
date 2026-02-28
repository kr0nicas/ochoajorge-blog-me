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
 * Slugify a string — converts to lowercase, handles spaces and special chars.
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
}

/**
 * Site configuration — single source of truth for metadata.
 */
export const siteConfig = {
    name: "Jorge Ochoa",
    title: "Jorge Ochoa — Software Architect & Developer",
    description:
        "Software architect, Python & Next.js developer. Writing about Clean Architecture, AI systems, and building production-grade software.",
    url: "https://ochoajorge.me",
    ogImage: "https://ochoajorge.me/og.png",
    author: {
        name: "Jorge Ochoa",
        twitter: "@jorgeochoa",
        github: "https://github.com/jorgeochoa",
        linkedin: "https://linkedin.com/in/jorgeochoa",
        bluesky: "https://bsky.app/profile/kr0nicas.bsky.social",
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

/**
 * Format a date string for display.
 */
export function formatDate(dateString: string, locale: string = "es"): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch (e) {
        return dateString;
    }
}
