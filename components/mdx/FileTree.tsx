"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════
   <FileTree /> — Interactive file tree for MDX posts
   
   Usage in MDX:
   <FileTree>
     {`
       src/
         app/
           layout.tsx  [highlight]
           page.tsx
         lib/
           utils.ts
         components/
     `}
   </FileTree>
   ══════════════════════════════════════════════════════════════ */

interface TreeNode {
    name: string;
    isDir: boolean;
    highlight: boolean;
    children: TreeNode[];
    depth: number;
}

function parseLine(line: string, depth: number): TreeNode | null {
    const trimmed = line.trim();
    if (!trimmed) return null;

    const highlight = trimmed.includes("[highlight]");
    const name = trimmed.replace("[highlight]", "").trim();
    const isDir = name.endsWith("/");

    return {
        name: isDir ? name.slice(0, -1) : name,
        isDir,
        highlight,
        children: [],
        depth,
    };
}

function buildTree(lines: string[]): TreeNode[] {
    const roots: TreeNode[] = [];
    const stack: { node: TreeNode; indent: number }[] = [];

    for (const line of lines) {
        if (!line.trim()) continue;
        const indent = line.search(/\S/);
        const depth = Math.floor(indent / 2);
        const node = parseLine(line, depth);
        if (!node) continue;

        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }

        if (stack.length === 0) {
            roots.push(node);
        } else {
            stack[stack.length - 1].node.children.push(node);
        }

        stack.push({ node, indent });
    }

    return roots;
}

function TreeNodeView({ node }: { node: TreeNode }) {
    const [open, setOpen] = useState(true);
    const hasChildren = node.children.length > 0;

    return (
        <div>
            <div
                className={cn(
                    "group flex items-center gap-1.5 rounded-md px-2 py-0.5 text-sm transition-colors duration-100",
                    node.highlight
                        ? "bg-[rgba(var(--brand-rgb),0.12)] text-[var(--brand-light)] font-medium"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
                    hasChildren && "cursor-pointer"
                )}
                onClick={() => hasChildren && setOpen((v) => !v)}
            >
                {/* Expand/collapse chevron */}
                {hasChildren ? (
                    <span className="text-[var(--text-muted)]">
                        {open ? (
                            <ChevronDown className="h-3 w-3" />
                        ) : (
                            <ChevronRight className="h-3 w-3" />
                        )}
                    </span>
                ) : (
                    <span className="w-3" />
                )}

                {/* Icon */}
                {node.isDir ? (
                    open && hasChildren ? (
                        <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[var(--brand-light)]" />
                    ) : (
                        <Folder className="h-3.5 w-3.5 shrink-0 text-[var(--brand-light)]" />
                    )
                ) : (
                    <File className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
                )}

                {/* Name */}
                <span className="font-mono text-xs">{node.name}{node.isDir ? "/" : ""}</span>

                {/* Highlight badge */}
                {node.highlight && (
                    <span className="ml-auto rounded-full bg-[var(--brand)] px-1.5 py-px text-[9px] font-bold text-white">
                        •
                    </span>
                )}
            </div>

            {/* Children */}
            <AnimatePresence>
                {open && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="ml-4 border-l border-[var(--border)] pl-2"
                    >
                        {node.children.map((child, i) => (
                            <TreeNodeView key={i} node={child} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function FileTree({
    children,
    title,
}: {
    children: string;
    title?: string;
}) {
    const lines = children
        .split("\n")
        .filter((l) => l.trim() !== "");
    const tree = buildTree(lines);

    return (
        <div className="not-prose my-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
                <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                </div>
                {title && (
                    <span className="ml-2 text-xs text-[var(--text-muted)] font-mono">
                        {title}
                    </span>
                )}
            </div>
            {/* Tree */}
            <div className="p-3">
                {tree.map((node, i) => (
                    <TreeNodeView key={i} node={node} />
                ))}
            </div>
        </div>
    );
}
