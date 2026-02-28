import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Articles on software architecture, Python, Next.js, AI systems, and building production-grade software.",
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="mb-12">
                <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">
                    Blog
                </h1>
                <p className="mt-3 text-[var(--text-secondary)]">
                    Thoughts on architecture, Python, AI, and building software that lasts.
                    {posts.length > 0 && (
                        <span className="ml-2 text-sm text-[var(--text-muted)]">
                            ({posts.length} article{posts.length !== 1 ? "s" : ""})
                        </span>
                    )}
                </p>
            </div>

            {/* Posts Grid */}
            {posts.length === 0 ? (
                <div className="card-glass flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-2xl">✍️</p>
                    <p className="mt-3 text-[var(--text-secondary)]">
                        First post coming soon...
                    </p>
                </div>
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
                    {posts.map((post) => (
                        <li key={post.slug}>
                            <PostCard post={post} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
