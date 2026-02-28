import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
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
