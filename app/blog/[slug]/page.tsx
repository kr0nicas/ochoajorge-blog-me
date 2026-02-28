import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getPostSlugs, formatDate } from "@/lib/posts";
import { compileMDXContent } from "@/lib/mdx";
import { siteConfig } from "@/lib/utils";
import { Calendar, Clock, Tag } from "lucide-react";

interface PostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return {};

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
            authors: [siteConfig.author.name],
            tags: post.tags,
            url: `${siteConfig.url}/blog/${post.slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
        },
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) notFound();

    // Compile MDX with all plugins (syntax highlighting, slug, autolink)
    const { content } = await compileMDXContent(post.content);

    // JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        author: {
            "@type": "Person",
            name: siteConfig.author.name,
            url: siteConfig.url,
        },
        publisher: {
            "@type": "Person",
            name: siteConfig.author.name,
        },
        keywords: post.tags.join(", "),
        url: `${siteConfig.url}/blog/${post.slug}`,
    };

    return (
        <>
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <header className="mb-10">
                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span key={tag} className="tag">
                                    <Tag className="h-2.5 w-2.5" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="font-display text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
                        {post.title}
                    </h1>

                    {/* Description */}
                    <p className="mt-4 text-lg text-[var(--text-secondary)] leading-relaxed">
                        {post.description}
                    </p>

                    {/* Meta */}
                    <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-6">
                        <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.date)}
                        </span>
                        {post.readingTime && (
                            <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                                <Clock className="h-4 w-4" />
                                {post.readingTime} min read
                            </span>
                        )}
                    </div>
                </header>

                {/* MDX Content — rendered server-side with full plugin support */}
                <div className="prose-blog prose prose-invert max-w-none">
                    {content}
                </div>

                {/* Footer spacer */}
                <div className="mt-16 border-t border-[var(--border)] pt-8">
                    <p className="text-sm text-[var(--text-muted)]">
                        Written by{" "}
                        <span className="text-[var(--text-primary)] font-medium">
                            {siteConfig.author.name}
                        </span>
                        . Found an error?{" "}
                        <a
                            href={siteConfig.author.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--brand-light)] hover:underline"
                        >
                            Open an issue on GitHub
                        </a>
                        .
                    </p>
                </div>
            </article>
        </>
    );
}
