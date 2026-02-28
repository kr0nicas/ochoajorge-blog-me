import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/utils";

/**
 * Route Handler to generate a dynamic RSS feed.
 * Next.js will serve this at /feed.xml
 */
export async function GET() {
    const posts = getAllPosts();
    const lastBuildDate = new Date().toUTCString();

    const rssItems = posts
        .map((post) => {
            const url = `${siteConfig.url}/blog/${post.slug}`;
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
        <title><![CDATA[${siteConfig.name}]]></title>
        <link>${siteConfig.url}</link>
        <description><![CDATA[${siteConfig.description}]]></description>
        <language>en</language>
        <lastBuildDate>${lastBuildDate}</lastBuildDate>
        <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
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
