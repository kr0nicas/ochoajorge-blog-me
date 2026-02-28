"use client";

import { useState, useRef } from "react";
import { Upload, Copy, Check, FileImage, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PutBlobResult } from "@vercel/blob";

export default function AdminUploadPage({ params }: { params: Promise<{ lang: string }> }) {
    const [isLoading, setIsLoading] = useState(false);
    const [blob, setBlob] = useState<PutBlobResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.[0]) return;

        setIsLoading(true);
        setError(null);
        setBlob(null);

        const file = event.target.files[0];

        try {
            const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                method: "POST",
                body: file,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Upload failed");
            }

            const newBlob = (await response.json()) as PutBlobResult;
            setBlob(newBlob);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (!blob?.url) return;
        await navigator.clipboard.writeText(blob.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-20">
            <Link
                href="/"
                className="group mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--brand-light)] transition-colors"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to home
            </Link>

            <div className="card-glass p-8 space-y-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-[var(--text-primary)]">
                        Upload to <span className="gradient-text">Vercel Blob</span>
                    </h1>
                    <p className="mt-2 text-[var(--text-secondary)]">
                        Use this tool to upload images for your blog posts without committing them to Git.
                    </p>
                </div>

                {/* Upload Zone */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-elevated)]/30 p-12 transition-all cursor-pointer",
                        isLoading ? "opacity-50 pointer-events-none" : "hover:border-[var(--brand)]/50 hover:bg-[var(--brand)]/5"
                    )}
                >
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        accept="image/*"
                    />

                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-light)]" />
                            <p className="text-sm font-medium text-[var(--text-primary)]">Uploading image...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand-light)] transition-colors group-hover:bg-[var(--brand)]/20">
                                <Upload className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[var(--text-primary)]">
                                    Click or drag to upload
                                </p>
                                <p className="mt-1 text-xs text-[var(--text-muted)]">
                                    PNG, JPG, WebP (up to 5MB)
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status messages */}
                {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-medium text-red-400">
                        {error}. Make sure you added <code className="bg-red-500/10 px-1 rounded">BLOB_READ_WRITE_TOKEN</code> to Vercel.
                    </div>
                )}

                {/* Success/Result */}
                {blob && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)] text-[var(--brand-light)] overflow-hidden">
                                {blob.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                    <img src={blob.url} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <FileImage className="h-6 w-6" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0 pr-4">
                                <p className="truncate text-xs font-medium text-[var(--text-primary)]">
                                    {blob.pathname}
                                </p>
                                <p className="text-[10px] text-[var(--text-muted)]">
                                    Upload successful!
                                </p>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-90",
                                    copied ? "bg-green-500/20 text-green-400" : "bg-[var(--brand)]/10 text-[var(--brand-light)] hover:bg-[var(--brand)]/20 shadow-sm"
                                )}
                                title="Copy image URL"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="text-[10px] text-center font-bold uppercase tracking-widest text-[var(--text-muted)]">
                            Paste the URL into your MDX post
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
