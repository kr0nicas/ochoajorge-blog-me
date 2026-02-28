"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search } from "@/components/blog/Search";
import { getDictionary, Locale } from "@/lib/dictionary";

interface HeaderProps {
    lang: string;
}

export function Header({ lang }: HeaderProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dict = getDictionary(lang as Locale);

    const navLinks = [
        { href: `/${lang}/blog`, label: dict.nav.blog },
        { href: `/${lang}/projects`, label: dict.nav.projects },
        { href: `/${lang}/about`, label: dict.nav.about },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                        href={`/${lang}`}
                        className="group flex items-center gap-2.5 font-display font-semibold text-[var(--text-primary)] transition-opacity hover:opacity-90"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] shadow-[0_0_20px_rgba(99,102,241,0.45)] transition-shadow duration-300 group-hover:shadow-[0_0_28px_rgba(99,102,241,0.65)]">
                            <Code2 className="h-4 w-4 text-white" />
                        </div>
                        <span className="hidden sm:inline">Jorge Ochoa</span>
                    </Link>

                    {/* Desktop Search & Nav */}
                    <div className="hidden items-center gap-6 md:flex">
                        <Search dict={dict.nav} />
                        <nav className="flex items-center gap-1" aria-label="Main navigation">
                            {navLinks.map(({ href, label }) => {
                                const isActive = pathname === href || (href !== `/${lang}` && pathname.startsWith(href));
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

                        {/* Lang Switcher (Simplified & Explicit) */}
                        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] p-1 bg-[var(--bg-elevated)]/30 backdrop-blur-sm">
                            <Link
                                href={pathname.replace(`/${lang}`, "/es")}
                                className={cn(
                                    "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                                    lang === "es"
                                        ? "bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/20"
                                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                )}
                            >
                                ES
                            </Link>
                            <span className="h-3 w-px bg-[var(--border-strong)]" />
                            <Link
                                href={pathname.replace(`/${lang}`, "/en")}
                                className={cn(
                                    "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                                    lang === "en"
                                        ? "bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/20"
                                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                )}
                            >
                                EN
                            </Link>
                        </div>
                    </div>

                    {/* Mobile: Search + Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <Search dict={dict.nav} />
                        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] p-0.5 bg-[var(--bg-elevated)]/30">
                            <Link
                                href={pathname.replace(`/${lang}`, "/es")}
                                className={cn(
                                    "px-1.5 py-1 text-[10px] font-bold uppercase rounded-md",
                                    lang === "es" ? "bg-[var(--brand)] text-white" : "text-[var(--text-muted)]"
                                )}
                            >
                                ES
                            </Link>
                            <Link
                                href={pathname.replace(`/${lang}`, "/en")}
                                className={cn(
                                    "px-1.5 py-1 text-[10px] font-bold uppercase rounded-md",
                                    lang === "en" ? "bg-[var(--brand)] text-white" : "text-[var(--text-muted)]"
                                )}
                            >
                                EN
                            </Link>
                        </div>
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
                                            pathname === href || (href !== `/${lang}` && pathname.startsWith(href))
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
