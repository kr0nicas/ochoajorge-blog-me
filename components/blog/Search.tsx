"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search as SearchIcon, X, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn, formatDate } from "@/lib/utils";

interface SearchResult {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    series?: string;
    date: string;
}

export function Search() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const fuseRef = useRef<Fuse<SearchResult> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const fetchIndex = useCallback(async () => {
        if (fuseRef.current) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/posts/search");
            const data = await res.json();
            fuseRef.current = new Fuse(data, {
                keys: ["title", "description", "tags", "series"],
                threshold: 0.3,
            });
        } catch (error) {
            console.error("Failed to fetch search index:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const toggleSearch = useCallback(() => {
        setIsOpen((prev) => !prev);
        if (!isOpen) {
            setQuery("");
            setSelectedIndex(0);
            fetchIndex();
        }
    }, [isOpen, fetchIndex]);

    // Handle K key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                toggleSearch();
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSearch]);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Search logic
    useEffect(() => {
        if (!query || !fuseRef.current) {
            setResults([]);
            return;
        }
        const searchResults = fuseRef.current.search(query).map(r => r.item);
        setResults(searchResults.slice(0, 8)); // Limit to 8 results
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % (results.length || 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % (results.length || 1));
        } else if (e.key === "Enter") {
            if (results[selectedIndex]) {
                router.push(`/blog/${results[selectedIndex].slug}`);
                setIsOpen(false);
            }
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={toggleSearch}
                className="group flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-1.5 text-xs text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--brand)] hover:bg-[var(--brand)]/5"
                aria-label="Search posts"
            >
                <SearchIcon className="h-3.5 w-3.5 transition-colors group-hover:text-[var(--brand-light)]" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden rounded bg-[var(--border-strong)] px-1.5 py-0.5 font-sans text-[10px] font-bold sm:inline group-hover:bg-[var(--brand)]/10 group-hover:text-[var(--brand-light)]">
                    ⌘K
                </kbd>
            </button>

            {/* Search Palette Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[#0f0f13] shadow-2xl"
                        >
                            {/* Input Area */}
                            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-4">
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-[var(--brand-light)]" />
                                ) : (
                                    <SearchIcon className="h-5 w-5 text-[var(--brand-light)]" />
                                )}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search articles, tags, series..."
                                    className="flex-1 bg-transparent text-lg text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                                />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Results Area */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {query && results.length > 0 ? (
                                    <ul className="p-2 space-y-1">
                                        {results.map((result, i) => (
                                            <li key={result.slug}>
                                                <Link
                                                    href={`/blog/${result.slug}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        "group flex flex-col rounded-xl px-4 py-3 transition-colors",
                                                        i === selectedIndex
                                                            ? "bg-[var(--brand)]/10"
                                                            : "hover:bg-[var(--bg-elevated)]"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <h4 className={cn(
                                                            "font-medium transition-colors",
                                                            i === selectedIndex ? "text-[var(--brand-light)]" : "text-[var(--text-primary)]"
                                                        )}>
                                                            {result.title}
                                                        </h4>
                                                        <ArrowRight className={cn(
                                                            "h-4 w-4 transition-all",
                                                            i === selectedIndex ? "translate-x-0 opacity-100 text-[var(--brand-light)]" : "-translate-x-2 opacity-0"
                                                        )} />
                                                    </div>
                                                    <p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)]">
                                                        {result.description}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-3 text-[10px] uppercase font-bold tracking-wider text-[var(--brand-light)]/50">
                                                        <span>{formatDate(result.date)}</span>
                                                        {result.series && (
                                                            <span className="flex items-center gap-1">
                                                                <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
                                                                Series: {result.series}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : query ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <p className="text-[var(--text-secondary)]">No results found for &ldquo;{query}&rdquo;</p>
                                        <p className="mt-1 text-sm text-[var(--text-muted)]">Try searching for different keywords</p>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center">
                                        <p className="text-sm text-[var(--text-muted)]">
                                            Start typing to search across all articles...
                                        </p>
                                        <div className="mt-10 grid grid-cols-2 gap-3 text-left">
                                            {["Python", "FastAPI", "Next.js", "Clean Architecture"].map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setQuery(tag)}
                                                    className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-xs text-[var(--text-secondary)] hover:border-[var(--brand)] hover:text-[var(--text-primary)] transition-all"
                                                >
                                                    <SearchIcon className="h-3 w-3 opacity-50" />
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2 text-[10px] text-[var(--text-muted)]">
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1.5">
                                        <kbd className="rounded border border-[var(--border-strong)] px-1 py-0.5 leading-none bg-[var(--bg-elevated)]">↑↓</kbd>
                                        to navigate
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <kbd className="rounded border border-[var(--border-strong)] px-1 py-0.5 leading-none bg-[var(--bg-elevated)]">Enter</kbd>
                                        to select
                                    </span>
                                </div>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="rounded border border-[var(--border-strong)] px-1 py-0.5 leading-none bg-[var(--bg-elevated)]">Esc</kbd>
                                    to close
                                </span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
