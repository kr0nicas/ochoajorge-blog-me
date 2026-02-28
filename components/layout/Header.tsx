"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search } from "@/components/blog/Search";

const navLinks = [
    { href: "/blog", label: "Blog" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
];

export function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Add shadow + stronger glass after scrolling 20px
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b transition-all duration-300",
                scrolled
                    ? "border-[var(--border-strong)] bg-[rgba(10,10,15,0.85)] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                    : "border-[var(--border)] bg-[rgba(10,10,15,0.6)] backdrop-blur-md"
            )}
        >
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2.5 font-display font-semibold text-[var(--text-primary)] transition-opacity hover:opacity-90"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] shadow-[0_0_20px_rgba(99,102,241,0.45)] transition-shadow duration-300 group-hover:shadow-[0_0_28px_rgba(99,102,241,0.65)]">
                            <Code2 className="h-4 w-4 text-white" />
                        </div>
                        <span className="hidden sm:inline">Jorge Ochoa</span>
                    </Link>

                    {/* Desktop Search & Nav */}
                    <div className="hidden items-center gap-6 md:flex">
                        <Search />
                        <nav className="flex items-center gap-1" aria-label="Main navigation">
                            {navLinks.map(({ href, label }) => {
                                const isActive =
                                    pathname === href || pathname.startsWith(href + "/");
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={cn(
                                            "relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "text-[var(--brand-light)]"
                                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-active"
                                                className="absolute inset-0 rounded-lg bg-[rgba(99,102,241,0.15)]"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                            />
                                        )}
                                        <span className="relative">{label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Mobile: Search + Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <Search />
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="flex items-center justify-center rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text-primary)]"
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={mobileOpen ? "close" : "open"}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {mobileOpen ? (
                                        <X className="h-5 w-5" />
                                    ) : (
                                        <Menu className="h-5 w-5" />
                                    )}
                                </motion.span>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-[var(--border)] bg-[rgba(10,10,15,0.95)] backdrop-blur-xl md:hidden"
                    >
                        <nav className="mx-auto max-w-5xl space-y-1 px-4 py-3">
                            {navLinks.map(({ href, label }, i) => (
                                <motion.div
                                    key={href}
                                    initial={{ x: -12, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05, duration: 0.2 }}
                                >
                                    <Link
                                        href={href}
                                        className={cn(
                                            "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                                            pathname === href || pathname.startsWith(href + "/")
                                                ? "bg-[rgba(99,102,241,0.15)] text-[var(--brand-light)]"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)]"
                                        )}
                                    >
                                        {label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
