import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PILLAR_IDS, PILLARS, pillarByRouteSlug } from "@/lib/pillars";
import { PillarLanding } from "@/components/pillars/PillarLanding";
import { localizedAlternates } from "@/lib/utils";

export const revalidate = 60;

interface Props {
    params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
    return PILLAR_IDS.map((id) => ({ slug: PILLARS[id].routeSlug.es }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const pillar = pillarByRouteSlug(slug, "es");
    if (!pillar) return {};
    return {
        title: pillar.name.es,
        description: pillar.intro.es,
        alternates: localizedAlternates("es", {
            es: `/temas/${pillar.routeSlug.es}`,
            en: `/topics/${pillar.routeSlug.en}`,
        }),
    };
}

export default async function TemaPage({ params }: Props) {
    const { lang, slug } = await params;
    const pillar = pillarByRouteSlug(slug, "es");
    if (!pillar) notFound();
    if (lang !== "es") redirect(`/en/topics/${pillar.routeSlug.en}`);
    return <PillarLanding lang="es" pillar={pillar} />;
}
