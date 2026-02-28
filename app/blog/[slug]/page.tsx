import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { compileMDXContent } from "@/lib/mdx";
import { siteConfig } from "@/lib/utils";
import { PostHeader } from "@/components/blog/PostHeader";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { SeriesBanner } from "@/components/blog/SeriesBanner";
import Link from "next/link";
import { Github } from "lucide-react";

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

            {/* Gradient reading progress bar */}
            <ReadingProgress />

            {/*
             * Two-column layout on XL screens:
             *   Left (main) — article content
             *   Right (sticky) — table of contents
             */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-[1fr_280px] xl:gap-12">
                    {/* ── Article ─────────────────────────────────── */}
                    <article className="min-w-0">
                        <div className="mx-auto max-w-3xl">
                            <PostHeader post={post} />

                            {/* MDX Content */}
                            <div
                                id="article-content"
                                className="prose-blog prose prose-invert max-w-none"
                            >
                                {post.series && (
                                    <SeriesBanner
                                        series={post.series}
                                        currentSlug={post.slug}
                                    />
                                )}

                                {content}
                            </div>

                            {/* Footer */}
                            <footer className="mt-16 border-t border-[var(--border)] pt-8">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Written by{" "}
                                        <span className="font-medium text-[var(--text-primary)]">
                                            {siteConfig.author.name}
                                        </span>
                                        . Found a typo or an error?
                                    </p>
                                    <a
                                        href={siteConfig.author.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--brand)] hover:text-[var(--brand-light)] no-underline"
                                    >
                                        <Github className="h-4 w-4" />
                                        Open on GitHub
                                    </a>
                                </div>
                            </footer>
                        </div>
                    </article>

                    {/* ── Table of Contents (sticky, xl only) ─────── */}
                    <aside className="hidden xl:block">
                        <div className="sticky top-24">
                            <TableOfContents />
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
