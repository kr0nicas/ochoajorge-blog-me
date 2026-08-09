import { renderOgImage, OG_SIZE } from "@/lib/og-template";
import { siteConfig } from "@/lib/utils";

// Node runtime required: the shared template reads font files with fs
export const alt = "Jorge Ochoa — Software Architect & Writer";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Root OG image — homepage and any page without a specific image. */
export default async function Image() {
    return renderOgImage({
        title: siteConfig.title,
        pillar: "blog",
    });
}
