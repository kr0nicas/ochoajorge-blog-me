import Link from "next/link";
import { Github, Linkedin, Twitter, Rss } from "lucide-react";
import { siteConfig } from "@/lib/utils";
import { getDictionary, Locale } from "@/lib/dictionary";

interface FooterProps {
    lang: string;
}

export function Footer({ lang }: FooterProps) {
    const dict = getDictionary(lang as Locale);

    const socialLinks = [
        {
            href: siteConfig.author.github,
            label: "GitHub",
            icon: Github,
        },
        {
            href: siteConfig.author.linkedin,
            label: "LinkedIn",
            icon: Linkedin,
        },
        {
            href: `https://x.com/${siteConfig.author.twitter.replace("@", "")}`,
            label: "Twitter",
            icon: Twitter,
        },
        {
            href: "feed.xml",
            label: "RSS Feed",
            icon: Rss,
        },
    ];

    const footerLinks = [
        { href: `/${lang}/blog`, label: dict.nav.blog },
        { href: `/${lang}/projects`, label: dict.nav.projects },
        { href: `/${lang}/uses`, label: dict.nav.uses },
        { href: `/${lang}/about`, label: dict.nav.about },
    ];

    return (
        <footer className="border-t border-[var(--border)] bg-[var(--bg-base)]">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                    {/* Brand */}
                    <div className="text-center sm:text-left">
                        <p className="font-display font-semibold text-[var(--text-primary)]">
                            Jorge Ochoa
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                            {lang === "es" ? "Arquitecto de Software · Python · Next.js · IA" : "Software Architect · Python · Next.js · AI"}
                        </p>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex items-center gap-4">
                        {footerLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Social Links */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map(({ href, label, icon: Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--border-brand)] hover:text-[var(--brand-light)] hover:shadow-[var(--shadow-brand-sm)]"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-8 border-t border-[var(--border)] pt-6 text-center">
                    <p className="text-xs text-[var(--text-muted)]">
                        © {new Date().getFullYear()} Jorge Ochoa. {dict.footer.built_with}{" "}
                        <a
                            href="https://nextjs.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--brand-light)] hover:underline"
                        >
                            Next.js
                        </a>{" "}
                        and{" "}
                        <a
                            href="https://tailwindcss.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--brand-light)] hover:underline"
                        >
                            Tailwind CSS
                        </a>
                        .
                    </p>
                </div>
            </div>
        </footer>
    );
}
