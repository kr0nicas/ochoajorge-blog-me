import type { Config } from "tailwindcss";

const config: Config = {
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
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Brand palette
                brand: {
                    DEFAULT: "#6366f1",  // indigo principal
                    light: "#818cf8",
                    dark: "#4f46e5",
                },
                accent: {
                    DEFAULT: "#22d3ee",  // cyan para highlights y código
                    light: "#67e8f9",
                    dark: "#0891b2",
                },
                surface: {
                    DEFAULT: "#13131a",
                    elevated: "#1a1a24",
                    border: "#ffffff0d",
                },
            },
            fontFamily: {
                sans: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
                display: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
                mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: "72ch",
                        color: "var(--tw-prose-body)",
                        "[class~='lead']": {
                            color: "var(--tw-prose-lead)",
                        },
                    },
                },
            },
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
            boxShadow: {
                "brand-glow": "0 0 30px rgba(99, 102, 241, 0.3)",
                "accent-glow": "0 0 20px rgba(34, 211, 238, 0.25)",
                "glass": "0 8px 32px rgba(0, 0, 0, 0.4)",
                "card": "0 4px 20px rgba(0, 0, 0, 0.3)",
            },
            borderRadius: {
                "xl": "1rem",
                "2xl": "1.5rem",
                "3xl": "2rem",
            },
            backgroundImage: {
                "grid-pattern":
                    "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
                "brand-gradient": "linear-gradient(135deg, #6366f1, #22d3ee)",
                "hero-gradient":
                    "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(99,102,241,0.3), rgba(255,255,255,0))",
            },
        },
    },
    plugins: [],
};

export default config;
