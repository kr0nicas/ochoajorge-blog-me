import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

/** Blue vs orange glow, deterministic per pillar (first tag). */
function pillarHue(pillar: string): "blue" | "orange" {
    let sum = 0;
    for (const char of pillar) sum += char.charCodeAt(0);
    return sum % 2 === 0 ? "blue" : "orange";
}

async function loadOgFonts() {
    const dir = path.join(process.cwd(), "assets", "og-fonts");
    const [spaceGrotesk, jetbrainsMono] = await Promise.all([
        readFile(path.join(dir, "SpaceGrotesk-Bold.ttf")),
        readFile(path.join(dir, "JetBrainsMono-Regular.ttf")),
    ]);
    return { spaceGrotesk, jetbrainsMono };
}

interface OgOptions {
    title: string;
    pillar: string;
    readingTime?: number;
}

/**
 * Grotesk Suizo OG template: #0c0c0d background, subtle grid, radial glow
 * (blue or orange alternating by pillar), mono kicker `// pillar`,
 * Space Grotesk title, ochoajorge.me brand mark.
 */
export async function renderOgImage({ title, pillar, readingTime }: OgOptions) {
    const { spaceGrotesk, jetbrainsMono } = await loadOgFonts();
    const hue = pillarHue(pillar);
    const glow =
        hue === "blue"
            ? "radial-gradient(circle, rgba(13,64,245,0.45), transparent 65%)"
            : "radial-gradient(circle, rgba(255,92,57,0.4), transparent 65%)";
    // Kicker uses the opposite accent so it always pops against the glow
    const kickerColor = hue === "blue" ? "#ff7857" : "#6b8cff";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "72px 80px",
                    background: "#0c0c0d",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Subtle grid */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(107,140,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(107,140,255,0.08) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />

                {/* Radial glow — blue or orange by pillar */}
                <div
                    style={{
                        position: "absolute",
                        width: "720px",
                        height: "640px",
                        right: "-180px",
                        top: "-240px",
                        background: glow,
                    }}
                />

                {/* Brand mark */}
                <div
                    style={{
                        position: "absolute",
                        top: "56px",
                        left: "80px",
                        fontFamily: "JetBrains Mono",
                        fontSize: "22px",
                        color: "#8f8f8f",
                    }}
                >
                    ochoajorge.me
                </div>

                {/* Kicker */}
                <div
                    style={{
                        position: "relative",
                        fontFamily: "JetBrains Mono",
                        fontSize: "24px",
                        color: kickerColor,
                        marginBottom: "18px",
                    }}
                >
                    {`// ${pillar}`}
                </div>

                {/* Title */}
                <div
                    style={{
                        position: "relative",
                        fontFamily: "Space Grotesk",
                        fontWeight: 700,
                        fontSize: title.length > 60 ? "56px" : "68px",
                        lineHeight: 1.08,
                        letterSpacing: "-0.02em",
                        color: "#fafafa",
                        maxWidth: "980px",
                    }}
                >
                    {title}
                </div>

                {/* Reading time */}
                {readingTime ? (
                    <div
                        style={{
                            position: "relative",
                            marginTop: "28px",
                            fontFamily: "JetBrains Mono",
                            fontSize: "20px",
                            color: "#7d7d7d",
                        }}
                    >
                        {`${readingTime} min`}
                    </div>
                ) : null}
            </div>
        ),
        {
            ...OG_SIZE,
            fonts: [
                { name: "Space Grotesk", data: spaceGrotesk, weight: 700, style: "normal" },
                { name: "JetBrains Mono", data: jetbrainsMono, weight: 400, style: "normal" },
            ],
        }
    );
}
