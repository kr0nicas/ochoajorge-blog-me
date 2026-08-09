import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PillarsIndex } from "@/components/pillars/PillarsIndex";

interface Props {
    params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
    title: "Topics",
    description:
        "Four problem-oriented sections: building with AI, agents in production, architecture, and security.",
};

export default async function TopicsPage({ params }: Props) {
    const { lang } = await params;
    if (lang !== "en") redirect("/es/temas");
    return <PillarsIndex lang="en" />;
}
