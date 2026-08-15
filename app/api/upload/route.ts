import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request): Promise<NextResponse> {
    const secret = process.env.UPLOAD_SECRET;
    if (!secret) {
        return NextResponse.json(
            { error: "Upload secret not configured" },
            { status: 500 }
        );
    }
    if (!safeEqual(request.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const pathname = searchParams.get("pathname");
    const filename = searchParams.get("filename") || "image.png";

    // Deterministic destination for automated post images (n8n): no random
    // suffix, overwrite allowed so regeneration replaces the previous asset.
    const PATHNAME_RE = /^posts\/[a-z0-9-]+\/[a-z0-9][a-z0-9.-]*$/;
    if (pathname !== null && !PATHNAME_RE.test(pathname)) {
        return NextResponse.json(
            { error: "Invalid pathname (expected posts/<slug>/<file>)" },
            { status: 400 }
        );
    }

    // El store puede estar conectado por token clásico (BLOB_READ_WRITE_TOKEN)
    // o por OIDC (BLOB_STORE_ID + token de runtime); con cualquiera de los dos
    // el SDK sabe autenticarse solo.
    if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
        return NextResponse.json(
            { error: "Vercel Blob not configured" },
            { status: 500 }
        );
    }

    try {
        const body = request.body;
        if (!body) {
            return NextResponse.json({ error: "No body provided" }, { status: 400 });
        }

        const blob = pathname
            ? await put(pathname, body, {
                  access: "public",
                  addRandomSuffix: false,
                  allowOverwrite: true,
              })
            : await put(filename, body, { access: "public" });

        return NextResponse.json(blob);
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
