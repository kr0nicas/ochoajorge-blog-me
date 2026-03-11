"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

/**
 * Comments component using Giscus (GitHub Discussions-based).
 * Requires the repo to have Discussions enabled and configured.
 */
export function Comments({ lang }: { lang: string }) {
    const { theme } = useTheme();

    return (
        <section className="mt-20 border-t border-[var(--border)] pt-12">
            <h2 className="mb-8 font-display text-2xl font-bold text-[var(--text-primary)]">
                Discussion
            </h2>
            <div className="rounded-2xl bg-[var(--bg-elevated)]/30 p-4 sm:p-8 backdrop-blur-md border border-[var(--border)] shadow-xl">
                <Giscus
                    id="comments"
                    repo="kr0nicas/ochoajorge-blog-me"
                    repoId="R_kgDORa5J1g"
                    category="Show and tell"
                    categoryId="DIC_kwDORa5J1s4C3Yzk"
                    mapping="pathname"
                    term="Welcome to my blog!"
                    reactionsEnabled="1"
                    emitMetadata="0"
                    inputPosition="bottom"
                    theme={theme === "dark" ? "transparent_dark" : "light"}
                    lang={lang === "es" ? "es" : "en"}
                    loading="lazy"
                />
            </div>
        </section>
    );
}
