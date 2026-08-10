import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Requests AI-generated images for a post from the n8n automation and patches
 * the MDX in place: coverImage/coverImageAlt into the frontmatter, inline
 * images right after their matching headings.
 *
 * Usage: npm run post:images -- <slug> [es|en] [--force]
 *
 * Contract and setup: docs/automation/n8n-post-images.md
 * NEVER blocks publishing: any webhook failure exits 0 with a notice.
 */

try {
    process.loadEnvFile(".env.local");
} catch {
    // no .env.local (e.g. Hermes' VPS) — vars must come from the environment
}

const TIMEOUT_MS = 5 * 60 * 1000;
const MAX_INLINE_IMAGES = 3;

// ── Sanitizers for hostile webhook strings ──────────────────────────
const singleLine = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const yamlValue = (value) => singleLine(value).replaceAll('"', "'");
const markdownAlt = (value) => singleLine(value).replace(/[[\]{}<>`]/g, "");
const isSafeUrl = (value) => typeof value === "string" && /^https:\/\/[^\s"()]+$/.test(value);

const args = process.argv.slice(2).filter((a) => a !== "--force");
const force = process.argv.includes("--force");
const [slug, lang = "es"] = args;

if (!slug || !["es", "en"].includes(lang)) {
    console.error("Usage: npm run post:images -- <slug> [es|en] [--force]");
    process.exit(1);
}

const contentRoot =
    process.env.POST_IMAGES_CONTENT_ROOT ?? path.join(process.cwd(), "content", "posts");
const filePath = path.join(contentRoot, lang, `${slug}.mdx`);

if (!existsSync(filePath)) {
    console.error(`Post not found: ${filePath}`);
    process.exit(1);
}

const webhookUrl = process.env.N8N_IMAGES_WEBHOOK_URL;
const webhookSecret = process.env.N8N_IMAGES_WEBHOOK_SECRET;
if (!webhookUrl || !webhookSecret) {
    console.log(
        "[post:images] N8N_IMAGES_WEBHOOK_URL / N8N_IMAGES_WEBHOOK_SECRET not set — skipping image generation. The post ships without images."
    );
    process.exit(0);
}

const raw = readFileSync(filePath, "utf8");
const { data: frontmatter, content: body } = matter(raw);

if (frontmatter.coverImage && !force) {
    console.log(
        `[post:images] ${slug} already has coverImage — nothing to do (use --force to regenerate).`
    );
    process.exit(0);
}

let response;
try {
    const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-webhook-secret": webhookSecret,
        },
        body: JSON.stringify({
            slug,
            lang,
            title: frontmatter.title ?? "",
            description: frontmatter.description ?? "",
            pillar: frontmatter.pillar ?? "",
            tags: frontmatter.tags ?? [],
            content: body,
            maxInlineImages: MAX_INLINE_IMAGES,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
        console.log(
            `[post:images] webhook responded ${res.status} — skipping. The post ships without images.`
        );
        process.exit(0);
    }
    response = await res.json();
} catch (err) {
    console.log(
        `[post:images] webhook unreachable (${err.name ?? "error"}) — skipping. The post ships without images.`
    );
    process.exit(0);
}

let updated = raw;

// ── Cover → frontmatter ─────────────────────────────────────────────
if (response.cover?.url && isSafeUrl(response.cover.url)) {
    const altSanitized = yamlValue(response.cover.alt);
    const coverLines = `coverImage: "${response.cover.url}"\ncoverImageAlt: "${altSanitized}"`;
    if (/^coverImage:/m.test(updated)) {
        updated = updated
            .replace(/^coverImage:.*$/m, () => `coverImage: "${response.cover.url}"`)
            .replace(/^coverImageAlt:.*$/m, () => `coverImageAlt: "${altSanitized}"`);
        if (!/^coverImageAlt:/m.test(updated)) {
            updated = updated.replace(/^coverImage:.*$/m, (line) => `${line}\ncoverImageAlt: "${altSanitized}"`);
        }
    } else {
        // Insert right before the closing --- of the frontmatter block
        updated = updated.replace(/^---\n([\s\S]*?)\n---/, (_, fm) => `---\n${fm}\n${coverLines}\n---`);
    }
    console.log(`[post:images] coverImage set: ${response.cover.url}`);
} else if (response.cover?.url) {
    console.log(`[post:images] skipping unsafe url: ${singleLine(response.cover.url)}`);
} else {
    console.log("[post:images] no cover in response — frontmatter untouched.");
}

// ── Inline → after exact heading match ──────────────────────────────
const orphans = [];
for (const image of response.inline ?? []) {
    if (!isSafeUrl(image.url)) {
        console.log(`[post:images] skipping unsafe url: ${singleLine(image.url)}`);
        continue;
    }
    const heading = (image.afterHeading ?? "").trim();
    const lines = updated.split("\n");
    const index = heading ? lines.findIndex((l) => l.trim() === heading) : -1;
    if (index === -1) {
        orphans.push(image);
        continue;
    }
    const altMarkdown = markdownAlt(image.alt);
    lines.splice(index + 1, 0, "", `![${altMarkdown}](${image.url})`);
    updated = lines.join("\n");
    console.log(`[post:images] inserted after "${heading}": ${image.url}`);
}

writeFileSync(filePath, updated);

if (orphans.length > 0) {
    console.log("\n[post:images] headings not found — place these manually:");
    for (const image of orphans) {
        const altMarkdown = markdownAlt(image.alt);
        console.log(`\n  # after: ${image.afterHeading}\n  ![${altMarkdown}](${image.url})`);
    }
}

console.log(`\n[post:images] done: ${filePath}`);
