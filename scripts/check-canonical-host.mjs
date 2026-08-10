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
const SCANNED_DIRS = ["app", "lib", "components", "middleware.js"];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

/** The only file allowed to spell the host out. */
const SOURCE_OF_TRUTH = "config/site-metadata.json";

/**
 * Matches a site URL literal: the bare domain preceded by a scheme.
 * A bare "ochoajorge.me" is deliberately allowed — it appears as brand text in
 * citation strings and OG templates, where it is a name, not a URL. Likewise
 * "hello@ochoajorge.me" is an address, not a link.
 */
const HOST_LITERAL = /https?:\/\/(?:www\.)?ochoajorge\.me/;

function* walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
            yield* walk(full);
        } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
            yield full;
        }
    }
}

function* targets() {
    for (const entry of SCANNED_DIRS) {
        const full = path.join(ROOT, entry);
        if (!fs.existsSync(full)) continue;
        if (fs.statSync(full).isDirectory()) yield* walk(full);
        else yield full;
    }
}

const violations = [];

for (const file of targets()) {
    const lines = fs.readFileSync(file, "utf-8").split("\n");
    lines.forEach((line, index) => {
        if (HOST_LITERAL.test(line)) {
            violations.push({
                file: path.relative(ROOT, file),
                line: index + 1,
                text: line.trim(),
            });
        }
    });
}

if (violations.length === 0) {
    console.log("✓ canonical host: no hardcoded site URLs in source");
    process.exit(0);
}

console.error(
    `\n✗ canonical host: ${violations.length} hardcoded site URL${violations.length === 1 ? "" : "s"} found.\n`
);
for (const { file, line, text } of violations) {
    console.error(`  ${file}:${line}`);
    console.error(`    ${text}\n`);
}
console.error(`The host belongs in ${SOURCE_OF_TRUTH}. Import it instead:\n`);
console.error(`  import { siteConfig } from "@/lib/utils";`);
console.error(`  // ... use siteConfig.url\n`);
process.exit(1);
