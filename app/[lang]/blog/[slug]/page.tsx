import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { compileMDXContent } from "@/lib/mdx";
import { siteConfig, type MetadataOverride } from "@/lib/utils";
import { PostHeader } from "@/components/blog/PostHeader";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { SeriesBanner } from "@/components/blog/SeriesBanner";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ReaderMode } from "@/components/blog/ReaderMode";
import { Comments } from "@/components/blog/Comments";
import { ReferencePanel } from "@/components/blog/ReferencePanel";
import { CitationButton } from "@/components/blog/CitationButton";
import { ShareButton } from "@/components/blog/ShareButton";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { Github } from "lucide-react";
import { slugify } from "@/lib/utils";
import { BlogPostingJsonLd, PersonJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";

interface PostPageProps {
    params: Promise<{ slug: string; lang: string }>;
}

export async function generateStaticParams({ params }: { params: { lang: string } }) {
    const { lang } = params;
    return getPostSlugs(lang).map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: PostPageProps): Promise<Metadata> {
    const { slug, lang } = await params;
    const post = getPostBySlug(slug, lang);
    if (!post) return {};

    const override: MetadataOverride | undefined = siteConfig.metadataOverrides?.[post.slug];
    const metadataTitle = override?.title ?? post.title;
    const metadataDescription = override?.description ?? post.description;
    const metadataCanonical =
        override?.canonical ?? `${siteConfig.url}/${lang}/blog/${post.slug}`;

    // Prefer explicit override, then post coverImage (frontmatter), then legacy post.ogImage, then site default.
    const ogImage = override?.ogImage ?? post.coverImage ?? post.ogImage ?? siteConfig.ogImage;
    const normalizedOgImage =
        ogImage && !ogImage.startsWith("http")
            ? new URL(ogImage.startsWith("/") ? ogImage : `/${ogImage}`, siteConfig.url).toString()
            : ogImage;
    const ogTitle = override?.ogTitle ?? metadataTitle;
    const ogDescription = override?.ogDescription ?? metadataDescription;

    return {
        title: metadataTitle,
        description: metadataDescription,
        alternates: {
            canonical: metadataCanonical,
        },
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            type: "article",
            publishedTime: post.date,
            authors: [siteConfig.author.name],
            tags: post.tags,
            url: metadataCanonical,
            images: normalizedOgImage
                ? [
                      {
                          url: normalizedOgImage,
                          width: 1200,
                          height: 630,
                          alt: metadataTitle,
                      },
                  ]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description: ogDescription,
            images: normalizedOgImage ? [normalizedOgImage] : [],
        },
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug, lang } = await params;
    const post = getPostBySlug(slug, lang);

    if (!post) notFound();

    const { content } = await compileMDXContent(post.content);
    const seriesSlug = post.series ? slugify(post.series.name) : undefined;

    // Normalize OG image for JSON-LD
    const ogImage = post.coverImage ?? post.ogImage ?? siteConfig.ogImage;
    const normalizedOgImage =
        ogImage && !ogImage.startsWith("http")
            ? new URL(ogImage.startsWith("/") ? ogImage : `/${ogImage}`, siteConfig.url).toString()
            : ogImage;

    const isSpanish = lang === "es";

    return (
        <>
            {/* JSON-LD Structured Data for AI Agents */}
            <BlogPostingJsonLd
                title={post.title}
                description={post.description}
                url={`${siteConfig.url}/${lang}/blog/${post.slug}`}
                datePublished={post.date}
                dateModified={post.date}
                author={{
                    name: siteConfig.author.name,
                    url: siteConfig.url,
                }}
                image={normalizedOgImage}
                tags={post.tags}
                seriesName={post.series?.name}
                seriesPart={post.series?.part}
            />

            {/* Author Person Schema */}
            <PersonJsonLd
                name={siteConfig.author.name}
                url={siteConfig.url}
                jobTitle="Specialist Technology Architect"
                worksFor={{
                    name: "Equifax LATAM",
                    url: "https://www.equifax.com/latam"
                }}
            />

            {/* Organization Schema */}
            <OrganizationJsonLd
                name="Jorge Ochoa"
                url={siteConfig.url}
                description="Personal blog about software architecture, AI systems, and clean code patterns"
                logo={siteConfig.ogImage}
                sameAs={[
                    siteConfig.author.github,
                    siteConfig.author.linkedin
                ]}
            />

            {/* Reading progress bar */}
            <ReadingProgress />

            {/* Reader mode toggle — floating top-right */}
            <div className="fixed right-4 top-20 z-40" data-reader-control>
                <ReaderMode lang={lang} />
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-[1fr_280px] xl:gap-12">
                    {/* ── Article ─────────────────────────────────── */}
                    <article className="min-w-0">
                        <div className="mx-auto max-w-3xl">
                            <PostHeader post={post} lang={lang} />

                            <div className="xl:hidden" data-reader-hide>
                                <TableOfContents lang={lang} variant="mobile" />
                            </div>

                            {/* MDX Content */}
                            <div
                                id="article-content"
                                className="prose-blog prose max-w-none"
                            >
                                {post.series && (
                                    <SeriesBanner
                                        series={post.series}
                                        currentSlug={post.slug}
                                        lang={lang}
                                    />
                                )}

                                {content}
                           </div>

                            <ReferencePanel
                                lang={lang as "es" | "en"}
                                tags={post.tags}
                                seriesName={post.series?.name}
                                seriesSlug={seriesSlug}
                                resources={post.resources}
                            />

                            {/* Related Posts */}
                            <RelatedPosts currentPost={post} lang={lang} />

                            {/* Newsletter — compact */}
                            <section className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
                                <p className="mb-1 font-mono text-sm text-[var(--brand)]">
                                    {"// newsletter"}
                                </p>
                                <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                                    {isSpanish
                                        ? "¿Te sirvió este artículo?"
                                        : "Was this article useful?"}
                                </h2>
                                <p className="mt-1 mb-4 text-sm text-[var(--text-secondary)]">
                                    {isSpanish
                                        ? "Recibe los siguientes en tu inbox. Sin spam, cancela cuando quieras."
                                        : "Get the next ones in your inbox. No spam, unsubscribe anytime."}
                                </p>
                                <NewsletterForm lang={lang} variant="compact" />
                            </section>

                            {/* Discussion */}
                            <Comments lang={lang} />

                            {/* Footer */}
                            <footer className="mt-16 border-t border-[var(--border)] pt-8">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm text-[var(--text-muted)]">
                                            {isSpanish ? "Escrito por" : "Written by"}{" "}
                                            <span className="font-medium text-[var(--text-primary)]">
                                                {siteConfig.author.name}
                                            </span>
                                            . {isSpanish ? "¿Encontraste un error?" : "Found a typo or an error?"}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <CitationButton
                                                title={post.title}
                                                url={`${siteConfig.url}/${lang}/blog/${post.slug}`}
                                                datePublished={post.date}
                                                lang={lang as "es" | "en"}
                                            />
                                            <ShareButton
                                                title={post.title}
                                                url={`${siteConfig.url}/${lang}/blog/${post.slug}`}
                                                lang={lang as "es" | "en"}
                                            />
                                        </div>
                                    </div>
                                    <a
                                        href={siteConfig.author.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--brand)] hover:text-[var(--brand-light)] no-underline"
                                    >
                                        <Github className="h-4 w-4" />
                                        {isSpanish ? "Abrir en GitHub" : "Open on GitHub"}
                                    </a>
                                </div>
                            </footer>
                        </div>
                    </article>

                    {/* ── Table of Contents (sticky, xl only) ─────── */}
                    <aside className="hidden xl:block">
                        <div className="sticky top-24">
                            <TableOfContents lang={lang} />
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
