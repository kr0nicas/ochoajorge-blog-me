import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { ReactElement } from "react";

interface MDXResult {
    content: ReactElement;
}

/**
 * Compile MDX content with all plugins applied server-side.
 * Uses next-mdx-remote/rsc for full Turbopack compatibility.
 */
export async function compileMDXContent(source: string): Promise<MDXResult> {
    const { content } = await compileMDX<{ title: string }>({
        source,
        options: {
            parseFrontmatter: false, // Already parsed by gray-matter in posts.ts
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["anchor"] } }],
                    [rehypePrettyCode, { theme: "one-dark-pro", keepBackground: false }],
                ],
            },
        },
    });

    return { content };
}
