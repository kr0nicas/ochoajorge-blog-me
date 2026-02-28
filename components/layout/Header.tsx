"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/blog", label: "Blog" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
];

export function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] glass">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-display font-semibold text-[var(--text-primary)] transition-opacity hover:opacity-80"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                            <Code2 className="h-4 w-4 text-white" />
                        </div>
                        <span className="hidden sm:inline">Jorge Ochoa</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden items-center gap-1 md:flex">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                                    pathname === href || pathname.startsWith(href + "/")
                                        ? "bg-[rgba(99,102,241,0.15)] text-[var(--brand-light)]"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        id="mobile-menu-button"
                        className="flex md:hidden items-center justify-center rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text-primary)]"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div className="border-t border-[var(--border)] bg-[var(--bg-surface)] md:hidden">
                    <nav className="mx-auto max-w-4xl px-4 py-3 space-y-1">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                                    pathname === href || pathname.startsWith(href + "/")
                                        ? "bg-[rgba(99,102,241,0.15)] text-[var(--brand-light)]"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
