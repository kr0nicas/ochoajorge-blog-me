import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jorge Ochoa — Software Architect & Writer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Root OG image — used for the homepage and any page without a specific image.
 * Uses @vercel/og (bundled with Next.js) to render a React tree to PNG.
 */
export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    padding: "64px",
                    background: "#0a0a0f",
                    position: "relative",
                    overflow: "hidden",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                {/* Grid pattern overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Top glow */}
                <div
                    style={{
                        position: "absolute",
                        top: "-200px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "900px",
                        height: "600px",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(ellipse, rgba(99,102,241,0.35) 0%, transparent 70%)",
                    }}
                />

                {/* Right orb */}
                <div
                    style={{
                        position: "absolute",
                        top: "80px",
                        right: "80px",
                        width: "300px",
                        height: "300px",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)",
                    }}
                />

                {/* Logo mark */}
                <div
                    style={{
                        position: "absolute",
                        top: "48px",
                        left: "64px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "#6366f1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "22px",
                            boxShadow: "0 0 24px rgba(99,102,241,0.5)",
                        }}
                    >
                        {"</>"}
                    </div>
                    <span
                        style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#f1f5f9",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        ochoajorge.me
                    </span>
                </div>

                {/* Main content */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", zIndex: 1 }}>
                    {/* Eyebrow */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 16px",
                            borderRadius: "9999px",
                            border: "1px solid rgba(99,102,241,0.35)",
                            background: "rgba(99,102,241,0.1)",
                            width: "fit-content",
                            color: "#818cf8",
                            fontSize: "14px",
                            fontWeight: 500,
                        }}
                    >
                        Software Architect · Builder · Writer
                    </div>

                    {/* Heading */}
                    <div
                        style={{
                            fontSize: "72px",
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: "-0.03em",
                            color: "#f1f5f9",
                        }}
                    >
                        Jorge Ochoa
                    </div>

                    {/* Sub */}
                    <div
                        style={{
                            fontSize: "24px",
                            color: "#94a3b8",
                            lineHeight: 1.4,
                            maxWidth: "700px",
                        }}
                    >
                        Clean Architecture · Python · Next.js · AI Engineering
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
