import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PILLAR_IDS, PILLARS, pillarByRouteSlug } from "@/lib/pillars";
import { PillarLanding } from "@/components/pillars/PillarLanding";
import { siteConfig } from "@/lib/utils";

interface Props {
    params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
    return PILLAR_IDS.map((id) => ({ slug: PILLARS[id].routeSlug.en }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const pillar = pillarByRouteSlug(slug, "en");
    if (!pillar) return {};
    const canonical = `${siteConfig.url}/en/topics/${pillar.routeSlug.en}`;
    return {
        title: pillar.name.en,
        description: pillar.intro.en,
        alternates: {
            canonical,
            languages: {
                es: `${siteConfig.url}/es/temas/${pillar.routeSlug.es}`,
                en: canonical,
            },
        },
    };
}

export default async function TopicPage({ params }: Props) {
    const { lang, slug } = await params;
    const pillar = pillarByRouteSlug(slug, "en");
    if (!pillar) notFound();
    if (lang !== "en") redirect(`/es/temas/${pillar.routeSlug.es}`);
    return <PillarLanding lang="en" pillar={pillar} />;
}
