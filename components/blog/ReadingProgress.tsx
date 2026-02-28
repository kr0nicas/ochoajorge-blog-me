"use client";

import { useEffect, useState } from "react";

/**
 * ReadingProgress — sticky bar at the top of the page that fills
 * as the user scrolls through the article. Client component.
 */
export function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const article = document.getElementById("article-content");
            if (!article) return;

            const { top, height } = article.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // How many pixels of the article have scrolled past the top
            const scrolled = Math.max(0, -top);
            const total = Math.max(1, height - windowHeight);
            const pct = Math.min(100, (scrolled / total) * 100);

            setProgress(pct);
        };

        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress(); // initial call
        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <div
            role="progressbar"
            aria-label="Reading progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="fixed top-0 left-0 right-0 z-50 h-[2px]"
            style={{ background: "var(--bg-elevated)" }}
        >
            <div
                className="h-full transition-[width] duration-100 ease-linear"
                style={{
                    width: `${progress}%`,
                    background:
                        "linear-gradient(to right, var(--brand), var(--accent))",
                }}
            />
        </div>
    );
}
