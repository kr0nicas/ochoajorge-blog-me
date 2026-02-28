"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { siteConfig } from "@/lib/utils";

/**
 * Comments component using Giscus (GitHub Discussions-based).
 * Requires the repo to have Discussions enabled and configured.
 */
export function Comments() {
    const { theme } = useTheme();

    return (
        <section className="mt-20 border-t border-[var(--border)] pt-12">
            <h2 className="mb-8 font-display text-2xl font-bold text-[var(--text-primary)]">
                Discussion
            </h2>
            <div className="rounded-2xl bg-[var(--bg-elevated)]/30 p-4 sm:p-8 backdrop-blur-md border border-[var(--border)] shadow-xl">
                <Giscus
                    id="comments"
                    repo="jorgeochoa/personal-blog" // USER: Make sure this is your correct repo!
                    repoId="R_kgDON-H2mQ"        // Placeholder — normally obtained from giscus.app
                    category="General"
                    categoryId="DIC_kwDON-H2mc4Cn8C6" // Placeholder
                    mapping="pathname"
                    term="Welcome to my blog!"
                    reactionsEnabled="1"
                    emitMetadata="0"
                    inputPosition="top"
                    theme={theme === "dark" ? "transparent_dark" : "light"}
                    lang="en"
                    loading="lazy"
                />
            </div>
        </section>
    );
}
