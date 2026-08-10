"use client";

import { useEffect, useRef, useState } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

/**
 * Comments via Giscus (GitHub Discussions). The iframe is heavy, so it only
 * mounts when the reader actually scrolls near the end of the article
 * (IntersectionObserver with a generous rootMargin to hide the load).
 */
export function Comments({ lang }: { lang: string }) {
    const { resolvedTheme } = useTheme();
    const containerRef = useRef<HTMLElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        if (!("IntersectionObserver" in window)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- fallback for browsers without IntersectionObserver
            setShouldLoad(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setShouldLoad(true);
            },
            { rootMargin: "600px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={containerRef}
            className="mt-20 border-t border-[var(--border)] pt-12"
        >
            <h2 className="mb-8 font-display text-2xl font-bold text-[var(--text-primary)]">
                {lang === "es" ? "Discusión" : "Discussion"}
            </h2>
            <div className="min-h-[280px] rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 sm:p-8">
                {shouldLoad && (
                    <Giscus
                        id="comments"
                        repo="kr0nicas/ochoajorge-blog-me"
                        repoId="R_kgDORa5J1g"
                        category="Comments"
                        categoryId="DIC_kwDORa5J1s4DDCf6"
                        mapping="pathname"
                        strict="0"
                        reactionsEnabled="1"
                        emitMetadata="0"
                        inputPosition="bottom"
                        theme={resolvedTheme === "dark" ? "transparent_dark" : "light"}
                        lang={lang === "es" ? "es" : "en"}
                        loading="lazy"
                    />
                )}
            </div>
        </section>
    );
}
