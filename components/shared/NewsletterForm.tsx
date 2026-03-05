"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

/* ── Submit button (reads formStatus internally) ──────────────── */
function SubmitButton({ lang }: { lang: string }) {
    const { pending } = useFormStatus();
    const isSpanish = lang === "es";

    return (
        <button
            type="submit"
            disabled={pending}
            id="newsletter-submit-btn"
            className="group flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-[var(--shadow-brand-sm)] transition-all duration-200 hover:bg-[var(--brand-dark)] hover:shadow-[var(--shadow-brand)] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <>
                    {isSpanish ? "Suscribirse" : "Subscribe"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
            )}
        </button>
    );
}

/* ── Main component ───────────────────────────────────────────── */
interface NewsletterFormProps {
    lang?: string;
    /** compact: single-line inline form. default: full card with description */
    variant?: "compact" | "full";
}

export function NewsletterForm({ lang = "es", variant = "full" }: NewsletterFormProps) {
    const isSpanish = lang === "es";
    const formRef = useRef<HTMLFormElement>(null);

    const [state, action] = useActionState(subscribeToNewsletter, null);

    // Reset form on successful submission
    useEffect(() => {
        if (state?.success) formRef.current?.reset();
    }, [state]);

    const inputClasses =
        "h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-200 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20";

    /* ── Compact variant (inline, for footer/sidebar) ── */
    if (variant === "compact") {
        return (
            <div>
                <form ref={formRef} action={action} className="flex gap-2">
                    <input type="hidden" name="lang" value={lang} />
                    <input
                        type="email"
                        name="email"
                        id="newsletter-email-compact"
                        required
                        placeholder={isSpanish ? "tu@email.com" : "you@email.com"}
                        className={inputClasses}
                        autoComplete="email"
                    />
                    <SubmitButton lang={lang} />
                </form>
                <AnimatePresence mode="wait">
                    {state && (
                        <motion.p
                            key={state.success ? "ok" : "err"}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${state.success ? "text-emerald-500" : "text-red-400"}`}
                        >
                            {state.success ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                                <AlertCircle className="h-3.5 w-3.5" />
                            )}
                            {state.success ? state.message : state.error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    /* ── Full variant (card, for homepage/dedicated section) ── */
    return (
        <section
            id="newsletter"
            className="relative overflow-hidden rounded-2xl border border-[var(--border-brand)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-brand-sm)] sm:p-10"
        >
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(var(--brand-rgb),0.10),transparent_70%)]" />

            <div className="relative">
                {/* Icon */}
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-brand)] bg-[rgba(var(--brand-rgb),0.08)]">
                    <Mail className="h-5 w-5 text-[var(--brand-light)]" />
                </div>

                {/* Heading */}
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--brand-light)]">
                    Newsletter
                </p>
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                    {isSpanish ? "Aprendamos juntos" : "Let's learn together"}
                </h2>
                <p className="mt-3 max-w-xl text-[var(--text-secondary)]">
                    {isSpanish
                        ? "Artículos sobre arquitectura de software, Python, Next.js e IA aplicada. Sin spam, sin relleno — solo contenido que vale tu tiempo."
                        : "Articles on software architecture, Python, Next.js, and applied AI. No spam, no filler — only content worth your time."}
                </p>

                {/* Form */}
                <AnimatePresence mode="wait">
                    {state?.success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4"
                        >
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                            <p className="text-sm font-medium text-emerald-400">
                                {state.message}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            ref={formRef}
                            action={action}
                            className="mt-6"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <input type="hidden" name="lang" value={lang} />
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="email"
                                    name="email"
                                    id="newsletter-email-full"
                                    required
                                    placeholder={isSpanish ? "tu@email.com" : "you@email.com"}
                                    className={`${inputClasses} sm:flex-1`}
                                    autoComplete="email"
                                />
                                <SubmitButton lang={lang} />
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {state?.success === false && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-2 flex items-center gap-1.5 text-xs text-red-400"
                                    >
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        {state.error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <p className="mt-3 text-xs text-[var(--text-muted)]">
                                {isSpanish
                                    ? "Sin spam. Cancela cuando quieras."
                                    : "No spam. Unsubscribe anytime."}
                            </p>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
