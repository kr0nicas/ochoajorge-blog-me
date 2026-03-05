"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Resend Audience ID — set in .env.local and Vercel env
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";

type SubscribeResult =
    | { success: true; message: string }
    | { success: false; error: string };

/**
 * Server Action: Subscribe an email to the Resend Audience.
 * Handles duplicates gracefully (Resend returns 409 for existing contacts).
 */
export async function subscribeToNewsletter(
    _prevState: SubscribeResult | null,
    formData: FormData
): Promise<SubscribeResult> {
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const lang = formData.get("lang")?.toString() ?? "es";
    const isSpanish = lang === "es";

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {
            success: false,
            error: isSpanish
                ? "Por favor ingresa un email válido."
                : "Please enter a valid email address.",
        };
    }

    if (!process.env.RESEND_API_KEY) {
        console.warn("[Newsletter] RESEND_API_KEY not set — skipping.");
        return {
            success: true,
            message: isSpanish
                ? "¡Suscrito! (modo demo — configura RESEND_API_KEY en producción)"
                : "Subscribed! (demo mode — set RESEND_API_KEY in production)",
        };
    }

    try {
        if (!AUDIENCE_ID) {
            throw new Error("RESEND_AUDIENCE_ID not configured");
        }

        await resend.contacts.create({
            email,
            audienceId: AUDIENCE_ID,
            unsubscribed: false,
        });

        // Send a welcome email
        await resend.emails.send({
            from: "Jorge Ochoa <hello@ochoajorge.me>",
            to: email,
            subject: isSpanish
                ? "👋 Bienvenido al newsletter de Jorge Ochoa"
                : "👋 Welcome to Jorge Ochoa's newsletter",
            html: isSpanish
                ? `
                    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #191919;">
                        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Bienvenido 👋</h1>
                        <p style="font-size: 16px; line-height: 1.6; color: #4f4f4f;">
                            Gracias por suscribirte. Recibirás mis artículos sobre arquitectura de software, Python, Next.js e IA aplicada cuando los publique.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #4f4f4f; margin-top: 16px;">
                            Promesa: sin spam, sin contenido de relleno. Solo cosas que valen tu tiempo.
                        </p>
                        <p style="margin-top: 32px; font-size: 14px; color: #86888a;">
                            — Jorge Ochoa · <a href="https://ochoajorge.me" style="color: #0a66c2;">ochoajorge.me</a>
                        </p>
                    </div>
                `
                : `
                    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #191919;">
                        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Welcome 👋</h1>
                        <p style="font-size: 16px; line-height: 1.6; color: #4f4f4f;">
                            Thanks for subscribing. You'll receive my articles on software architecture, Python, Next.js, and applied AI as I publish them.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #4f4f4f; margin-top: 16px;">
                            Promise: no spam, no filler content. Only things worth your time.
                        </p>
                        <p style="margin-top: 32px; font-size: 14px; color: #86888a;">
                            — Jorge Ochoa · <a href="https://ochoajorge.me" style="color: #0a66c2;">ochoajorge.me</a>
                        </p>
                    </div>
                `,
        });

        return {
            success: true,
            message: isSpanish
                ? "¡Suscrito! Revisa tu inbox para el email de bienvenida."
                : "Subscribed! Check your inbox for the welcome email.",
        };
    } catch (err: unknown) {
        // Resend returns 422 for existing contacts in some configurations
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes("already exists") || message.includes("422")) {
            return {
                success: true,
                message: isSpanish
                    ? "¡Ya estás suscrito! Te avisaremos con cada nuevo artículo."
                    : "You're already subscribed! We'll notify you on each new article.",
            };
        }

        console.error("[Newsletter] Resend error:", err);
        return {
            success: false,
            error: isSpanish
                ? "Algo salió mal. Inténtalo de nuevo más tarde."
                : "Something went wrong. Please try again later.",
        };
    }
}
