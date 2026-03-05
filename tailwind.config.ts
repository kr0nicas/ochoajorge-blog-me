import type { Config } from "tailwindcss";

/**
 * Tailwind Config — Personal Blog
 * 
 * Principio: Los colores de Tailwind apuntan a variables CSS.
 * El cambio de tema se hace en globals.css (dark/light classes).
 * 
 * NUNCA hardcodear colores aquí directamente.
 */
const config: Config = {
    // next-themes añade la clase "dark" o "light" al <html>
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
        "./content/**/*.{md,mdx}",
    ],
    theme: {
        extend: {
            // ─── Colors — all backed by CSS variables ────────────────
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brand: {
                    DEFAULT: "var(--brand)",
                    light: "var(--brand-light)",
                    dark: "var(--brand-dark)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    light: "var(--accent-light)",
                    dark: "var(--accent-dark)",
                },
                surface: {
                    DEFAULT: "var(--bg-surface)",
                    elevated: "var(--bg-elevated)",
                    base: "var(--bg-base)",
                },
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                    muted: "var(--text-muted)",
                },
                border: {
                    DEFAULT: "var(--border)",
                    strong: "var(--border-strong)",
                    brand: "var(--border-brand)",
                },
            },
            // ─── Typography ──────────────────────────────────────────
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                display: ["var(--font-outfit)", "system-ui", "sans-serif"],
                mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
            },
            // ─── Prose ───────────────────────────────────────────────
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: "72ch",
                        color: "var(--tw-prose-body)",
                        "[class~='lead']": { color: "var(--tw-prose-lead)" },
                    },
                },
            },
            // ─── Box Shadows — reference CSS vars ───────────────────
            boxShadow: {
                "brand-glow": "var(--shadow-brand)",
                "brand-sm": "var(--shadow-brand-sm)",
                "accent-glow": "var(--shadow-accent)",
                "card": "var(--shadow-md)",
                "sm": "var(--shadow-sm)",
                "lg": "var(--shadow-lg)",
            },
            // ─── Animations ──────────────────────────────────────────
            animation: {
                "float": "float 6s ease-in-out infinite",
                "float-delayed": "float 6s ease-in-out 3s infinite",
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "shimmer": "shimmer 2s linear infinite",
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.4s ease-out",
                "glow": "glow 2s ease-in-out infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-12px)" },
                },
                shimmer: {
                    from: { backgroundPosition: "0 0" },
                    to: { backgroundPosition: "-200% 0" },
                },
                fadeIn: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                slideUp: {
                    from: { opacity: "0", transform: "translateY(16px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                glow: {
                    "0%, 100%": { opacity: "0.6" },
                    "50%": { opacity: "1" },
                },
            },
            // ─── Border Radius ───────────────────────────────────────
            borderRadius: {
                "xl": "1rem",
                "2xl": "1.5rem",
                "3xl": "2rem",
            },
            // ─── Background Images ───────────────────────────────────
            backgroundImage: {
                "grid-pattern":
                    "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
                "brand-gradient": "linear-gradient(135deg, var(--brand-light), var(--accent))",
                "hero-gradient":
                    "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(var(--brand-rgb),0.25), transparent)",
            },
        },
    },
    plugins: [],
};

export default config;
