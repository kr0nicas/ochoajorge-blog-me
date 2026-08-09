"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

interface TerminalProps extends React.HTMLAttributes<HTMLPreElement> {
    "data-title"?: string;
    "data-language"?: string;
}

/**
 * Terminal — macOS-style window wrapper for MDX code blocks.
 * Dark body always (#0f0f10 via .terminal-body), even in light theme.
 * Filename comes from the fence meta (```python title="worker.py")
 * injected by lib/rehype-code-meta.ts as data attributes.
 */
export function Terminal({
    "data-title": title,
    "data-language": language,
    children,
    ...rest
}: TerminalProps) {
    const preRef = useRef<HTMLPreElement>(null);
    const [copied, setCopied] = useState(false);
    const label = title ?? (language ? `${language}` : "terminal");

    const handleCopy = async () => {
        const text = preRef.current?.textContent ?? "";
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard access denied — silent fail */
        }
    };

    return (
        <figure className="terminal">
            <div className="terminal-bar">
                <span className="terminal-dot terminal-dot-red" aria-hidden="true" />
                <span className="terminal-dot terminal-dot-yellow" aria-hidden="true" />
                <span className="terminal-dot terminal-dot-green" aria-hidden="true" />
                <span className="terminal-name">{label}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? "Copied" : "Copy code"}
                    className="terminal-copy"
                >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? "ok" : "copy"}</span>
                </button>
            </div>
            <pre ref={preRef} {...rest}>
                {children}
            </pre>
        </figure>
    );
}
