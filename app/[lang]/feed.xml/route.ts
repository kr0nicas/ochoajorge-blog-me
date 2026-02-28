import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/utils";
import { NextRequest } from "next/server";

/**
 * Route Handler to generate a localized dynamic RSS feed.
 * Next.js will serve this at /[lang]/feed.xml
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ lang: string }> }
) {
    const { lang } = await params;
    const posts = getAllPosts(lang);
    const lastBuildDate = new Date().toUTCString();

    const isSpanish = lang === "es";
    const feedUrl = `${siteConfig.url}/${lang}/feed.xml`;

    const rssItems = posts
        .map((post) => {
            const url = `${siteConfig.url}/${lang}/blog/${post.slug}`;
            const pubDate = new Date(post.date).toUTCString();

            return `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <link>${url}</link>
            <guid isPermaLink="true">${url}</guid>
            <pubDate>${pubDate}</pubDate>
            <description><![CDATA[${post.description}]]></description>
            ${post.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('')}
        </item>`;
        })
        .join("");

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title><![CDATA[${siteConfig.name} Blog]]></title>
        <link>${siteConfig.url}/${lang}</link>
        <description><![CDATA[${isSpanish ? siteConfig.description : "Software architecture, Python, Next.js and AI systems."}]]></description>
        <language>${lang}</language>
        <lastBuildDate>${lastBuildDate}</lastBuildDate>
        <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
        ${rssItems}
    </channel>
</rss>`;

    return new Response(rssXml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        },
    });
}

export async function generateStaticParams() {
    return [{ lang: "es" }, { lang: "en" }];
}
