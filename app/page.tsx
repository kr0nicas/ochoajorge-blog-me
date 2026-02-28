import Link from "next/link";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import type { Metadata } from "next";
import { getFeaturedPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

const pillars = [
  { label: "Architecture", emoji: "🏗️" },
  { label: "Python", emoji: "🐍" },
  { label: "Next.js", emoji: "▲" },
  { label: "AI / LLMs", emoji: "🤖" },
  { label: "SaaS / ERP", emoji: "🚀" },
];

export default function HomePage() {
  const featuredPosts = getFeaturedPosts(3);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Subtle grid + radial gradient background */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.2),transparent)]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.08)] px-4 py-1.5 text-sm text-[var(--brand-light)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Software Architect · Builder · Writer
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-[var(--text-primary)]">Hi, I&apos;m </span>
            <span className="gradient-text">Jorge Ochoa</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 max-w-2xl text-lg text-[var(--text-secondary)] leading-relaxed">
            I build production-grade software —{" "}
            <span className="text-[var(--text-primary)] font-medium">
              ERPs, AI agents, and developer platforms
            </span>
            . I write about the patterns, mistakes, and lessons learned along the way.
          </p>

          {/* Content Pillars */}
          <div className="mt-6 flex flex-wrap gap-2">
            {pillars.map(({ label, emoji }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)]"
              >
                <span>{emoji}</span>
                {label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/blog"
              id="hero-cta-blog"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.35)] transition-all duration-200 hover:bg-[var(--brand-dark)] hover:shadow-[0_0_32px_rgba(99,102,241,0.5)]"
            >
              Read the blog
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={siteConfig.author.github}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-cta-github"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href={siteConfig.author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-cta-linkedin"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ── Featured Posts ────────────────────────────────────────── */}
      {featuredPosts.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              Latest Writing
            </h2>
            <Link
              href="/blog"
              id="homepage-view-all-posts"
              className="flex items-center gap-1.5 text-sm text-[var(--brand-light)] transition-opacity hover:opacity-80"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post, i) => (
              <PostCard
                key={post.slug}
                post={post}
                featured={i === 0}
                className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── About Teaser ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="card-glass p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                About me
              </h2>
              <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                I&apos;m a software architect and full-stack developer based in El Salvador.
                Currently building{" "}
                <span className="text-[var(--text-primary)] font-medium">Orbis 8</span>, a
                multi-tenant ERP SaaS for SMBs, using Python, Go, and Next.js. I&apos;m
                passionate about clean architecture, AI engineering, and developer experience.
              </p>
              <Link
                href="/about"
                id="homepage-about-link"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-light)] transition-opacity hover:opacity-80"
              >
                More about me
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 lg:flex-shrink-0">
              {[
                { value: "5+", label: "Years" },
                { value: "20+", label: "Projects" },
                { value: "∞", label: "Coffee" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] p-4"
                >
                  <span className="font-display text-2xl font-bold gradient-text">
                    {value}
                  </span>
                  <span className="mt-1 text-xs text-[var(--text-muted)]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
