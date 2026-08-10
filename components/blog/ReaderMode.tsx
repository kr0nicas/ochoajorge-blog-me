"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ReaderMode — Toggle that hides everything except the article content.
 * Saves preference in localStorage. Works via CSS class on <body>.
 * 
 * CSS: when body has .reader-mode, header/footer/sidebar fade out,
 * and the article expands to a comfortable reading width.
 */
export function ReaderMode({ lang = "es" }: { lang?: string }) {
    const [active, setActive] = useState(false);
    const isSpanish = lang === "es";

    // Read persisted preference after mount — the initializer ran on the
    // server with `false`, so reading localStorage there would desync
    // server and client HTML (hydration mismatch).
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time post-hydration sync from localStorage
        setActive(localStorage.getItem("reader-mode") === "true");
    }, []);

    useEffect(() => {
        document.body.classList.toggle("reader-mode", active);
    }, [active]);

    const toggle = useCallback(() => {
        setActive((prev) => {
            const next = !prev;
            localStorage.setItem("reader-mode", String(next));
            document.body.classList.toggle("reader-mode", next);
            return next;
        });
    }, []);

    // Escape key exits reader mode
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && active) toggle();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [active, toggle]);

    return (
        <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={
                active
                    ? isSpanish ? "Salir del modo lector (Esc)" : "Exit reader mode (Esc)"
                    : isSpanish ? "Modo lector" : "Reader mode"
            }
            aria-label={isSpanish ? "Alternar modo lector" : "Toggle reader mode"}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${active
                    ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--text-on-brand)] shadow-[var(--shadow-brand-sm)]"
                    : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:border-[var(--border-brand)] hover:text-[var(--brand-light)]"
                }`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {active ? (
                    <motion.span
                        key="exit"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center"
                    >
                        <X className="h-3.5 w-3.5" />
                    </motion.span>
                ) : (
                    <motion.span
                        key="read"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center"
                    >
                        <BookOpen className="h-3.5 w-3.5" />
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
