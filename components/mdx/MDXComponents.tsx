"use client";

import { Children, cloneElement, isValidElement, useState, type ReactElement } from "react";
import { Copy, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════
   <Callout /> — Highlight note/tip/warning/danger in MDX posts

   Usage:
   <Callout type="tip">
     This is a useful tip about something.
   </Callout>
   ══════════════════════════════════════════════════════════════ */

type CalloutType = "note" | "tip" | "warning" | "danger" | "success" | "info";

const calloutConfig: Record<CalloutType, { icon: string; label: string; bg: string; border: string; text: string }> = {
    note: {
        icon: "💡",
        label: "Nota",
        bg: "rgba(var(--brand-rgb), 0.07)",
        border: "rgba(var(--brand-rgb), 0.25)",
        text: "var(--brand-light)",
    },
    info: {
        icon: "ℹ️",
        label: "Información",
        bg: "rgba(59, 130, 246, 0.07)",
        border: "rgba(59, 130, 246, 0.25)",
        text: "#3b82f6",
    },
    tip: {
        icon: "✨",
        label: "Tip",
        bg: "rgba(16, 185, 129, 0.07)",
        border: "rgba(16, 185, 129, 0.25)",
        text: "#10b981",
    },
    warning: {
        icon: "⚠️",
        label: "Atención",
        bg: "rgba(245, 158, 11, 0.07)",
        border: "rgba(245, 158, 11, 0.25)",
        text: "#f59e0b",
    },
    danger: {
        icon: "🚨",
        label: "Peligro",
        bg: "rgba(239, 68, 68, 0.07)",
        border: "rgba(239, 68, 68, 0.25)",
        text: "#ef4444",
    },
    success: {
        icon: "✅",
        label: "Excelente",
        bg: "rgba(34, 197, 94, 0.07)",
        border: "rgba(34, 197, 94, 0.25)",
        text: "#22c55e",
    },
};

export function Callout({
    type = "note",
    title,
    children,
}: {
    type?: CalloutType;
    title?: string;
    children: React.ReactNode;
}) {
    const config = calloutConfig[type];

    return (
        <div
            className="not-prose my-6 rounded-xl p-4 text-sm leading-relaxed"
            style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
            }}
        >
            <div className="mb-2 flex items-center gap-2 font-semibold" style={{ color: config.text }}>
                <span>{config.icon}</span>
                <span>{title ?? config.label}</span>
            </div>
            <div className="text-[var(--text-secondary)]">{children}</div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   <ComparisonTable /> — Side-by-side technical comparison

   Usage:
   <ComparisonTable
     headers={["Hexagonal", "Simple MVC"]}
     rows={[
       ["Testable sin DB", "Tests lentos"],
       ["Más archivos", "Menos código inicial"],
     ]}
   />
   ══════════════════════════════════════════════════════════════ */

export function ComparisonTable({
    headers = "",
    rows = "",
    highlight = 0,
}: {
    headers?: string;
    rows?: string;
    highlight?: number; // index of the "winning" column
}) {
    // Parse JSON strings to arrays
    const parsedHeaders = headers ? JSON.parse(headers) : [];
    const parsedRows = rows ? JSON.parse(rows) : [];

    return (
        <div className="not-prose my-6 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                        {parsedHeaders.map((h: string, i: number) => (
                            <th
                                key={i}
                                className={cn(
                                    "px-4 py-3 text-left font-semibold",
                                    i === highlight
                                        ? "text-[var(--brand-light)]"
                                        : "text-[var(--text-primary)]"
                                )}
                            >
                                {i === highlight && (
                                    <span className="mr-1.5 rounded-full bg-[var(--brand)] px-1.5 py-px text-[9px] font-bold text-[var(--text-on-brand)]">
                                        ✓
                                    </span>
                                )}
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {parsedRows.map((row: string[], ri: number) => (
                        <tr
                            key={ri}
                            className="border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[var(--bg-elevated)]"
                        >
                            {row.map((cell: string, ci: number) => (
                                <td
                                    key={ci}
                                    className={cn(
                                        "px-4 py-2.5 text-[var(--text-secondary)]",
                                        ci === highlight && "font-medium text-[var(--text-primary)]"
                                    )}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   <Step /> and <Steps /> — Numbered step-by-step guide

   Usage:
   <Steps>
     <Step title="Instala las dependencias">
       Run `npm install fastapi uvicorn`
     </Step>
     <Step title="Crea tu primer endpoint">
       ...
     </Step>
   </Steps>
   ══════════════════════════════════════════════════════════════ */

export function Steps({ children }: { children: React.ReactNode }) {
    const childrenWithIndex = Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child as ReactElement<{ index?: number }>, {
            index: index + 1,
        });
    });

    return (
        <div className="not-prose my-6 space-y-4">
            {childrenWithIndex}
        </div>
    );
}

export function Step({
    title,
    children,
    index,
}: {
    title: string;
    children: React.ReactNode;
    index?: number;
}) {
    const num = index ?? 0;

    return (
        <div className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-[var(--text-on-brand)] shadow-[var(--shadow-brand-sm)]">
                {num}
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-[var(--text-primary)]">{title}</p>
                <div className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {children}
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   <CodeComparison /> — Before/After tabbed code blocks

   Usage in MDX:
   <CodeComparison
     before={{
       label: "❌ Antes",
       code: `direct db call here`
     }}
     after={{
       label: "✅ Después",
       code: `clean repository pattern`
     }}
   />
   ══════════════════════════════════════════════════════════════ */

export function CodeComparison({
    before,
    after,
}: {
    before: string;
    after: string;
}) {
    const [tab, setTab] = useState<"before" | "after">("before");
    const [copied, setCopied] = useState(false);

    // Parse JSON strings
    const beforeObj = before ? JSON.parse(before) : { label: "", code: "" };
    const afterObj = after ? JSON.parse(after) : { label: "", code: "" };
    const currentCode = tab === "before" ? beforeObj.code : afterObj.code;

    const copy = () => {
        navigator.clipboard.writeText(currentCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="not-prose my-6 overflow-hidden rounded-xl border border-[var(--border)] shadow-lg">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-[#232326] bg-[#1a1a1c] px-3 py-2">
                <div className="flex gap-1">
                    {(["before", "after"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={cn(
                                "rounded-md px-3 py-1 text-xs font-semibold transition-all duration-150",
                                tab === t
                                    ? "bg-[var(--brand)] text-[var(--text-on-brand)]"
                                    : "text-[#a8a8a8] hover:text-[#fafafa]"
                            )}
                        >
                            {t === "before" ? beforeObj.label : afterObj.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={copy}
                    className="flex items-center gap-1 rounded-md border border-[#232326] px-2 py-1 text-[10px] text-[#a8a8a8] transition-all duration-150 hover:border-[#6b8cff] hover:text-[#6b8cff]"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                            <motion.span key="check" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-emerald-400">
                                <CheckCheck className="h-3 w-3" /> Copiado
                            </motion.span>
                        ) : (
                            <motion.span key="copy" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                                <Copy className="h-3 w-3" /> Copiar
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Code */}
            <AnimatePresence mode="wait">
                <motion.pre
                    key={tab}
                    initial={{ opacity: 0, x: tab === "after" ? 8 : -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-x-auto bg-[#0f0f10] p-4 text-xs leading-relaxed text-[#fafafa]"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    <span className="font-mono whitespace-pre">{currentCode}</span>
                </motion.pre>
            </AnimatePresence>
        </div>
    );
}
