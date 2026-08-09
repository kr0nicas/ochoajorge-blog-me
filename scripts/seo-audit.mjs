import fs from "fs";
import path from "path";
import matter from "gray-matter";
import siteMetadata from "../config/site-metadata.json" with { type: "json" };

/**
 * SEO Audit Script: validates localized MDX posts metadata.
 * Usage:
 *   npm run seo:audit
 *   npm run seo:audit -- es
 */

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const SUPPORTED_LOCALES = ["es", "en"];

// Keep in sync with lib/pillars.ts (scripts cannot import TS modules)
const PILLAR_IDS = ["construir-con-ia", "agentes-en-produccion", "arquitectura", "seguridad"];

const localeArg = process.argv[2];
const targetLocales = localeArg
    ? SUPPORTED_LOCALES.includes(localeArg)
        ? [localeArg]
        : []
    : [...SUPPORTED_LOCALES];

if (localeArg && targetLocales.length === 0) {
    console.error("Invalid locale. Use: es | en");
    process.exit(1);
}

let errors = 0;
let warnings = 0;
let checked = 0;

for (const locale of targetLocales) {
    const localeDir = path.join(POSTS_DIR, locale);
    if (!fs.existsSync(localeDir)) {
        console.warn(`Warning: locale directory not found: ${localeDir}`);
        warnings++;
        continue;
    }

    const files = fs
        .readdirSync(localeDir)
        .filter((file) => {
            const isMarkdownFile = file.endsWith(".mdx") || file.endsWith(".md");
            if (!isMarkdownFile) return false;

            // Exclude social media templates (LinkedIn, X threads), same as lib/posts.ts
            const slug = file.replace(/\.(mdx|md)$/, "");
            return !slug.startsWith("linkedin-") && !slug.startsWith("x-thread-");
        });

    for (const file of files) {
        const fullPath = path.join(localeDir, file);
        const raw = fs.readFileSync(fullPath, "utf-8");
        const { data } = matter(raw);

        if (data.draft) continue;
        checked++;

        if (!data.title || typeof data.title !== "string") {
            console.error(`Error: ${locale}/${file} is missing "title".`);
            errors++;
        }

        if (!data.description || typeof data.description !== "string") {
            console.error(`Error: ${locale}/${file} is missing "description".`);
            errors++;
        } else if (data.description.length < 130 || data.description.length > 170) {
            console.warn(
                `Warning: ${locale}/${file} description length is ${data.description.length} (ideal: 150-160).`
            );
            warnings++;
        }

        if (!PILLAR_IDS.includes(data.pillar)) {
            console.warn(
                `Warning: ${locale}/${file} missing or non-canonical "pillar" (got: ${data.pillar ?? "none"}).`
            );
            warnings++;
        }

        if (!data.date || typeof data.date !== "string") {
            console.error(`Error: ${locale}/${file} is missing "date".`);
            errors++;
        }

        // "canonical" is an optional override; the post page derives it from the slug
        // when absent (see app/[lang]/blog/[slug]/page.tsx), so only validate if present.
        if (data.canonical && typeof data.canonical !== "string") {
            console.error(`Error: ${locale}/${file} has non-string "canonical".`);
            errors++;
        } else if (data.canonical && !data.canonical.startsWith(siteMetadata.url)) {
            console.warn(
                `Warning: ${locale}/${file} canonical (${data.canonical}) should be under ${siteMetadata.url}.`
            );
            warnings++;
        }

        if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
            console.warn(`Warning: ${locale}/${file} has no tags.`);
            warnings++;
        }

        if (data.lang && data.lang !== locale) {
            console.warn(
                `Warning: ${locale}/${file} has lang="${data.lang}" but it is inside "${locale}" directory.`
            );
            warnings++;
        }

        if (
            data.series &&
            (typeof data.series !== "object" ||
                !data.series.name ||
                data.series.part === undefined)
        ) {
            console.error(`Error: ${locale}/${file} has malformed "series".`);
            errors++;
        }

        if (!data.ogImage && !data.coverImage) {
            console.warn(`Warning: ${locale}/${file} has no ogImage or coverImage defined.`);
            warnings++;
        }
    }
}

if (checked === 0) {
    console.warn("No published posts found to audit (all drafts or missing files).");
}

if (errors > 0) {
    console.error(`\nAudit failed: ${errors} error(s), ${warnings} warning(s).`);
    process.exit(1);
} else {
    console.log(`SEO audit passed: ${checked} post(s) checked, ${warnings} warning(s).`);
}
