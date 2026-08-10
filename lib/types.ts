import type { PillarId } from "./pillars";

export interface Post {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    draft: boolean;
    coverImage?: string;
    readingTime?: number; // minutes
    series?: {
        name: string;
        part: number;
    };
    featured?: boolean;
    lang?: "es" | "en";
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    resources?: Array<{
        label: string;
        url: string;
    }>;
    /** Canonical section (see lib/pillars.ts); absent = unassigned */
    pillar?: PillarId;
}

export interface PostWithContent extends Post {
    content: string;
}
