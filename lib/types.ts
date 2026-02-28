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
}

export interface PostWithContent extends Post {
    content: string;
}
