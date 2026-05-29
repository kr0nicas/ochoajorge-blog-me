"use client";

import { useState } from "react";
import { Copy, Check, Quote } from "lucide-react";
import { generateCitation } from "@/lib/citation";

interface CitationButtonProps {
  title: string;
  url: string;
  datePublished: string;
  lang: "es" | "en";
}

export function CitationButton({
  title,
  url,
  datePublished,
  lang,
}: CitationButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const citations = generateCitation({
    title,
    author: "Jorge Ochoa",
    url,
    datePublished,
    lang,
  });

  const handleCopy = (format: "bibtex" | "apa" | "mla" | "json") => {
    navigator.clipboard.writeText(citations[format]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--brand)] hover:text-[var(--brand-light)]"
        title={lang === "es" ? "Copiar cita" : "Copy citation"}
      >
        <Quote className="h-4 w-4" />
        {lang === "es" ? "Citar para IA" : "Cite for AI"}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl bg-[var(--bg-elevated)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                {lang === "es" ? "Formatos de Cita" : "Citation Formats"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)]"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* BibTeX */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">
                    BibTeX
                  </label>
                  <button
                    onClick={() => handleCopy("bibtex")}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)]"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {lang === "es" ? "Copiar" : "Copy"}
                  </button>
                </div>
                <pre className="overflow-auto rounded-lg bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-secondary)]">
                  <code>{citations.bibtex}</code>
                </pre>
              </div>

              {/* APA */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">
                    APA (7th ed)
                  </label>
                  <button
                    onClick={() => handleCopy("apa")}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)]"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {lang === "es" ? "Copiar" : "Copy"}
                  </button>
                </div>
                <pre className="overflow-auto rounded-lg bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-secondary)]">
                  <code>{citations.apa}</code>
                </pre>
              </div>

              {/* MLA */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">
                    MLA (9th ed)
                  </label>
                  <button
                    onClick={() => handleCopy("mla")}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)]"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {lang === "es" ? "Copiar" : "Copy"}
                  </button>
                </div>
                <pre className="overflow-auto rounded-lg bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-secondary)]">
                  <code>{citations.mla}</code>
                </pre>
              </div>

              {/* JSON for AI */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-[var(--brand-light)]">
                    JSON (AI Agents)
                  </label>
                  <button
                    onClick={() => handleCopy("json")}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)]"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {lang === "es" ? "Copiar" : "Copy"}
                  </button>
                </div>
                <pre className="overflow-auto rounded-lg bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-secondary)]">
                  <code>{citations.json}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}