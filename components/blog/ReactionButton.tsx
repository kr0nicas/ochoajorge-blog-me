"use client";

import { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";

interface ReactionButtonProps {
    slug: string;
    lang: string;
}

type Status = "loading" | "ready" | "hidden";

/**
 * Star reaction for a post. Optimistic localStorage dedupe (one per browser),
 * hides itself entirely if the reactions endpoint errors or is not configured.
 */
export function ReactionButton({ slug, lang }: ReactionButtonProps) {
    const [status, setStatus] = useState<Status>("loading");
    const [count, setCount] = useState(0);
    const [reacted, setReacted] = useState(false);
    const storageKey = `reaction:${lang}:${slug}`;

    useEffect(() => {
        let cancelled = false;
        setStatus("loading");
        try {
            setReacted(window.localStorage.getItem(storageKey) === "1");
        } catch {
            // localStorage unavailable (private mode) — dedupe just won't persist
        }
        fetch(`/api/reactions/${slug}?lang=${lang}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
            .then((data: { count: number }) => {
                if (cancelled) return;
                setCount(data.count);
                setStatus("ready");
            })
            .catch(() => {
                if (!cancelled) setStatus("hidden");
            });
        return () => {
            cancelled = true;
        };
    }, [slug, lang, storageKey]);

    const react = useCallback(async () => {
        if (reacted || status !== "ready") return;
        setReacted(true);
        setCount((c) => c + 1);
        try {
            window.localStorage.setItem(storageKey, "1");
        } catch {
            // best-effort persistence
        }
        try {
            const res = await fetch(`/api/reactions/${slug}?lang=${lang}`, {
                method: "POST",
            });
            if (!res.ok) throw new Error(String(res.status));
            const data: { count: number } = await res.json();
            setCount(data.count);
        } catch {
            setReacted(false);
            setCount((c) => Math.max(0, c - 1));
            try {
                window.localStorage.removeItem(storageKey);
            } catch {
                // ignore
            }
        }
    }, [reacted, status, slug, lang, storageKey]);

    if (status === "hidden") return null;

    const label =
        lang === "es"
            ? reacted
                ? "Ya marcaste este artículo"
                : "Marcar como favorito"
            : reacted
              ? "You already starred this article"
              : "Mark as favorite";

    return (
        <button
            type="button"
            onClick={react}
            aria-pressed={reacted}
            aria-label={label}
            title={label}
            className={`flex items-center gap-1.5 font-mono text-sm transition-colors ${
                reacted
                    ? "cursor-default text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:text-[var(--accent)]"
            }`}
        >
            <Star
                className={`h-4 w-4 ${reacted ? "fill-current" : ""}`}
                aria-hidden="true"
            />
            <span className="tabular-nums">{status === "loading" ? "·" : count}</span>
        </button>
    );
}
