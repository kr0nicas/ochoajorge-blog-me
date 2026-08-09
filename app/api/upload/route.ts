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
    const filename = searchParams.get("filename") || "image.png";

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
            { error: "Vercel Blob token not configured" },
            { status: 500 }
        );
    }

    try {
        const body = request.body;
        if (!body) {
            return NextResponse.json({ error: "No body provided" }, { status: 400 });
        }

        const blob = await put(filename, body, {
            access: "public",
        });

        return NextResponse.json(blob);
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
