import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import type { ReactElement } from "react";
import { FileTree } from "@/components/mdx/FileTree";
import { Terminal } from "@/components/mdx/Terminal";
import { rehypeCodeMeta } from "@/lib/rehype-code-meta";
import {
    Callout,
    ComparisonTable,
    Steps,
    Step,
    CodeComparison,
} from "@/components/mdx/MDXComponents";

interface MDXResult {
    content: ReactElement;
}

/**
 * Custom MDX components available in all posts.
 * Import-once here, available everywhere in MDX without explicit imports.
 */
const mdxComponents = {
    // Interactive layout components
    FileTree,
    Callout,
    ComparisonTable,
    Steps,
    Step,
    CodeComparison,
    // Every fenced code block renders inside a Terminal window
    pre: Terminal,
};

/**
 * Compile MDX content with all plugins and custom components applied server-side.
 * Uses next-mdx-remote/rsc for full Turbopack compatibility.
 */
export async function compileMDXContent(source: string): Promise<MDXResult> {
    const { content } = await compileMDX<{ title: string }>({
        source,
        components: mdxComponents,
        options: {
            parseFrontmatter: false, // Already parsed by gray-matter in posts.ts
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["anchor"] } }],
                    rehypeCodeMeta,
                    rehypeHighlight,
                ],
            },
        },
    });

    return { content };
}
