#!/usr/bin/env node
/**
 * Guards the single source of truth for the site host.
 *
 * The canonical host lives in config/site-metadata.json and everything else —
 * sitemap <loc>s, canonicals, robots.txt, OG tags, JSON-LD — derives from it via
 * siteConfig.url. When a literal host is pasted into a component instead, the
 * two drift apart silently: the sitemap advertises one host while the server
 * serves another, and Google reports every submitted URL as a redirect.
 *
 * That is not hypothetical. It is exactly what happened before this check
 * existed. Fails the build if a literal site URL reappears in source.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

/** The only file allowed to choose the host. */
const SOURCE_OF_TRUTH = "config/site-metadata.json";

/**
 * Two tiers, because the two kinds of file have different options.
 *
 * Source can import siteConfig, so writing any host literal there is the bug —
 * it creates a second place the host lives, which is how the sitemap ended up
 * advertising a host the server did not serve.
 *
 * Static assets under public/ cannot import anything; llms.txt has to spell the
 * URLs out. There the bug is narrower: naming the *wrong* host. That file sat
 * unreachable behind a middleware redirect long enough for its URLs to go stale
 * unnoticed, so it is worth watching even though it must contain literals.
 *
 * A bare "ochoajorge.me" is allowed everywhere: it appears as brand text in
 * citation strings and OG templates, and in hello@ochoajorge.me — a name and an
 * address, not links.
 */
const TIERS = [
    {
        roots: ["app", "lib", "components", "middleware.js"],
        extensions: new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]),
        pattern: /https?:\/\/(?:www\.)?ochoajorge\.me/,
        rule: "source must not hardcode the host",
        fix: `import { siteConfig } from "@/lib/utils"; // ... use siteConfig.url`,
    },
    {
        roots: ["public"],
        extensions: new Set([".txt"]),
        // Only the non-canonical host. www is expected here.
        pattern: /https?:\/\/ochoajorge\.me/,
        rule: "static assets must use the canonical host",
        fix: "write https://www.ochoajorge.me — static files cannot import siteConfig",
    },
];

function* walk(dir, extensions) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
            yield* walk(full, extensions);
        } else if (extensions.has(path.extname(entry.name))) {
            yield full;
        }
    }
}

function* targets(roots, extensions) {
    for (const entry of roots) {
        const full = path.join(ROOT, entry);
        if (!fs.existsSync(full)) continue;
        if (fs.statSync(full).isDirectory()) yield* walk(full, extensions);
        else yield full;
    }
}

const failures = [];

for (const tier of TIERS) {
    for (const file of targets(tier.roots, tier.extensions)) {
        fs.readFileSync(file, "utf-8")
            .split("\n")
            .forEach((line, index) => {
                if (tier.pattern.test(line)) {
                    failures.push({
                        tier,
                        file: path.relative(ROOT, file),
                        line: index + 1,
                        text: line.trim(),
                    });
                }
            });
    }
}

if (failures.length === 0) {
    console.log("✓ canonical host: source imports it, static assets agree with it");
    process.exit(0);
}

console.error(
    `\n✗ canonical host: ${failures.length} violation${failures.length === 1 ? "" : "s"} found.\n`
);
for (const tier of TIERS) {
    const own = failures.filter((f) => f.tier === tier);
    if (own.length === 0) continue;
    console.error(`  ${tier.rule}:`);
    for (const { file, line, text } of own) {
        console.error(`    ${file}:${line}`);
        console.error(`      ${text}`);
    }
    console.error(`\n    → ${tier.fix}\n`);
}
console.error(`The host is chosen in ${SOURCE_OF_TRUTH}.\n`);
process.exit(1);
