"use client";

import { useState } from "react";
import { MessageCircle, Share2, Linkedin, ExternalLink, Copy, Check } from "lucide-react";

interface ShareButtonProps {
  title: string;
  url: string;
  lang: "es" | "en";
}

interface ShareTarget {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function ShareButton({ title, url, lang }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const targets: ShareTarget[] = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <MessageCircle className="h-4 w-4" />,
    },
    {
      label: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Linkedin className="h-4 w-4" />,
    },
    {
      label: "Bluesky",
      href: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`,
      icon: <ExternalLink className="h-4 w-4" />,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--brand)] hover:text-[var(--brand-light)]"
        title={lang === "es" ? "Compartir" : "Share"}
      >
        <Share2 className="h-4 w-4" />
        {lang === "es" ? "Compartir" : "Share"}
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute left-0 z-50 mt-2 w-44 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-1 shadow-lg">
            {targets.map((target) => (
              <a
                key={target.label}
                href={target.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--brand-light)]"
              >
                {target.icon}
                {target.label}
              </a>
            ))}
            <div className="my-1 border-t border-[var(--border)]" />
            <button
              onClick={() => {
                handleCopy();
                setShowMenu(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--brand-light)]"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied
                ? lang === "es"
                  ? "¡Copiado!"
                  : "Copied!"
                : lang === "es"
                  ? "Copiar enlace"
                  : "Copy link"}
            </button>
          </div>
        </>
      )}

      {copied && (
        <div className="absolute left-0 top-full mt-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs text-[var(--brand-light)] shadow-md">
          {lang === "es" ? "¡Enlace copiado!" : "Link copied!"}
        </div>
      )}
    </div>
  );
}
