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
    canonical?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
}

export interface PostWithContent extends Post {
    content: string;
}
