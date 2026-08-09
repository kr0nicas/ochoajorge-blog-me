import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PillarsIndex } from "@/components/pillars/PillarsIndex";
import { siteConfig } from "@/lib/utils";

interface Props {
    params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
    title: "Temas",
    description:
        "Cuatro secciones orientadas a problemas reales: construir con IA, agentes en producción, arquitectura y seguridad.",
    alternates: {
        canonical: `${siteConfig.url}/es/temas`,
        languages: {
            es: `${siteConfig.url}/es/temas`,
            en: `${siteConfig.url}/en/topics`,
        },
    },
};

export default async function TemasPage({ params }: Props) {
    const { lang } = await params;
    if (lang !== "es") redirect("/en/topics");
    return <PillarsIndex lang="es" />;
}
