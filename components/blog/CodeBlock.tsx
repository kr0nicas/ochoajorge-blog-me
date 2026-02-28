"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
    children: React.ReactNode;
    /** Optional filename shown in the title bar */
    filename?: string;
    /** Language label shown in the top-right corner */
    language?: string;
}

/**
 * CodeBlock — premium code block wrapper with:
 *  - Filename / language badge header
 *  - One-click copy button with animated checkmark feedback
 *
 * Usage in MDX:
 *   ```python filename="domain/entities/invoice.py"
 *   ...
 *   ```
 *
 * rehype-pretty-code renders the <pre> and injects `data-language` and
 * `data-rehype-pretty-code-figure` on the wrapping <figure>. This component
 * is the custom <pre> override wired up in mdx-components.tsx.
 */
export function CodeBlock({ children, filename, language }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        // Grab visible text from all <span> tokens inside this block
        const container = document.activeElement?.closest("figure") ??
            (typeof window !== "undefined"
                ? document.querySelector("[data-rehype-pretty-code-figure]")
                : null);

        // Try to get the raw code text from the pre element
        const pre = (container ?? document).querySelector("pre");
        const text = pre?.textContent ?? "";

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard access denied — silent fail */
        }
    };

    return (
        <figure
            data-rehype-pretty-code-figure
            className="group relative my-6 overflow-hidden rounded-xl border border-[var(--border)]"
        >
            {/* Header bar */}
            {(filename || language) && (
                <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2">
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                        {filename ?? language}
                    </span>
                    {language && filename && (
                        <span className="rounded bg-[var(--brand)] bg-opacity-15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-light)]">
                            {language}
                        </span>
                    )}
                </div>
            )}

            {/* Copy button */}
            <button
                onClick={handleCopy}
                aria-label={copied ? "Copied!" : "Copy code"}
                className="absolute right-3 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] opacity-0 transition-all duration-200 hover:border-[var(--brand)] hover:text-[var(--brand-light)] group-hover:opacity-100 focus-visible:opacity-100"
                style={{ top: filename || language ? "2.5rem" : "0.75rem" }}
            >
                {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                    <Copy className="h-3.5 w-3.5" />
                )}
            </button>

            {/* The actual <pre> injected by rehype-pretty-code */}
            {children}
        </figure>
    );
}
