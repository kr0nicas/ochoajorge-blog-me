import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import siteMetadata from "@/config/site-metadata.json";

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
    title: "Jorge Ochoa — Technology Architect, Cloud & AI",
    description:
        "Technology Architect and Developer from El Salvador. Writing about Kubernetes, Google Cloud, Go, Clean Architecture, and AI Agents for high-performance systems.",
    url: siteMetadata.url,
    ogImage: siteMetadata.ogImage,
    author: {
        name: siteMetadata.authorName,
        twitter: "@kr0nicas",
        github: "https://github.com/kr0nicas",
        linkedin: "https://www.linkedin.com/in/jorge-ochoa-rebollo/",
        bluesky: "https://bsky.app/profile/kr0nicas.bsky.social",
    },
    keywords: [
        "technology architecture",
        "cloud architecture",
        "google cloud",
        "gcp",
        "kubernetes",
        "docker",
        "golang",
        "clean architecture",
        "hexagonal architecture",
        "ai agents",
        "python",
        "next.js",
        "devops",
        "automation",
    ],
    metadataOverrides: {
        // Añade overrides por slug si necesitas personalizar metadata para SEO o redes sociales
        // "custom-series-intro": {
        //     title: "Override Title",
        //     description: "Custom description length for SEO.",
        //     ogImage: "https://example.com/custom-og.png",
        // },
    },
};

export type SiteConfig = typeof siteConfig;

export type MetadataOverride = {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonical?: string;
};

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
    } catch {
        return dateString;
    }
}
