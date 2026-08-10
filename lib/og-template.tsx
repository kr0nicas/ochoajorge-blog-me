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
    /** Fixed glow hue; falls back to a deterministic hash of `pillar` */
    hue?: "blue" | "orange";
    /** Generated cover art (Vercel Blob URL) layered behind the right panel */
    coverUrl?: string;
}

/**
 * Grotesk Suizo OG template: #0c0c0d background, subtle grid, radial glow
 * (blue or orange alternating by pillar), mono kicker `// pillar`,
 * Space Grotesk title, ochoajorge.me brand mark.
 */
export async function renderOgImage({ title, pillar, readingTime, hue: hueOverride, coverUrl }: OgOptions) {
    const { spaceGrotesk, jetbrainsMono } = await loadOgFonts();
    let coverSrc: string | null = null;
    if (coverUrl) {
        try {
            const res = await fetch(coverUrl, { signal: AbortSignal.timeout(5000) });
            const type = res.headers.get("content-type") ?? "";
            if (res.ok && type.startsWith("image/")) {
                const buffer = Buffer.from(await res.arrayBuffer());
                coverSrc = `data:${type};base64,${buffer.toString("base64")}`;
            }
        } catch {
            // cover unavailable — render the classic template
        }
    }
    const hue = hueOverride ?? pillarHue(pillar);
    const glow =
        hue === "blue"
            ? "radial-gradient(circle, rgba(13,64,245,0.45), transparent 65%)"
            : "radial-gradient(circle, rgba(255,92,57,0.4), transparent 65%)";
    // Kicker uses the opposite accent so it always pops against the glow
    const kickerColor = hue === "blue" ? "#ff7857" : "#6b8cff";
    const MAX_TITLE_CHARS = 120;
    const displayTitle =
        title.length > MAX_TITLE_CHARS
            ? `${title.slice(0, MAX_TITLE_CHARS - 1).trimEnd()}…`
            : title;
    const titleFontSize =
        displayTitle.length > 90 ? "44px" : displayTitle.length > 60 ? "56px" : "68px";

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

                {/* Cover art panel — right 40%, fading into the base background */}
                {coverSrc ? (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "480px",
                            height: "100%",
                            display: "flex",
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={coverSrc}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(90deg, #0c0c0d 0%, rgba(12,12,13,0.72) 30%, rgba(12,12,13,0.18) 100%)",
                            }}
                        />
                    </div>
                ) : null}

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
                        fontSize: titleFontSize,
                        lineHeight: 1.08,
                        letterSpacing: "-0.02em",
                        color: "#fafafa",
                        maxWidth: coverSrc ? "660px" : "980px",
                    }}
                >
                    {displayTitle}
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
