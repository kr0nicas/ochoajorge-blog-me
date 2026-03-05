import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/*/admin/"], // Ocultar páginas de administración y APIs del rastreo
        },
        sitemap: `${siteConfig.url}/sitemap.xml`,
    };
}
