import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

// No edge runtime — getPostBySlug uses fs/path which require Node.js
export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
    params: Promise<{ slug: string; lang: string }>;
}

/**
 * Dynamic OG image for individual blog posts.
 * Generates a branded card with the post title, description, and tags.
 */
export default async function Image({ params }: Props) {
    const { slug, lang } = await params;
    const post = getPostBySlug(slug, lang);

    const title = post?.title ?? "Blog Post";
    const description = post?.description ?? "";
    const tags = post?.tags?.slice(0, 3) ?? [];

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    padding: "56px 64px",
                    background: "#0a0a0f",
                    position: "relative",
                    overflow: "hidden",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                {/* Grid overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Top glow — indigo */}
                <div
                    style={{
                        position: "absolute",
                        top: "-150px",
                        left: "-100px",
                        width: "700px",
                        height: "500px",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, transparent 70%)",
                    }}
                />

                {/* Bottom-right accent — cyan */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "-80px",
                        right: "-80px",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
                    }}
                />

                {/* Top: site logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: "#6366f1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            boxShadow: "0 0 20px rgba(99,102,241,0.5)",
                        }}
                    >
                        {"</>"}
                    </div>
                    <span style={{ fontSize: "16px", color: "#64748b", fontWeight: 500 }}>
                        ochoajorge.me
                    </span>
                </div>

                {/* Main content */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        position: "relative",
                        zIndex: 1,
                        maxWidth: "900px",
                    }}
                >
                    {/* Tags */}
                    {tags.length > 0 && (
                        <div style={{ display: "flex", gap: "8px" }}>
                            {tags.map((tag) => (
                                <div
                                    key={tag}
                                    style={{
                                        padding: "4px 12px",
                                        borderRadius: "9999px",
                                        border: "1px solid rgba(99,102,241,0.3)",
                                        background: "rgba(99,102,241,0.1)",
                                        color: "#818cf8",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                    }}
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <div
                        style={{
                            fontSize: title.length > 60 ? "48px" : "58px",
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: "-0.03em",
                            color: "#f1f5f9",
                        }}
                    >
                        {title}
                    </div>

                    {/* Description */}
                    {description && (
                        <div
                            style={{
                                fontSize: "20px",
                                color: "#64748b",
                                lineHeight: 1.5,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {description}
                        </div>
                    )}
                </div>

                {/* Bottom: reading time */}
                {post?.readingTime && (
                    <div
                        style={{
                            position: "relative",
                            zIndex: 1,
                            fontSize: "14px",
                            color: "#475569",
                        }}
                    >
                        {post.readingTime} min read
                    </div>
                )}
            </div>
        ),
        { ...size }
    );
}
