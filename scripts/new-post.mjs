import fs from "fs";
import path from "path";

/**
 * Script to scaffold a new localized MDX post with proper frontmatter.
 * Usage:
 *   npm run post:new -- "Post Title"
 *   npm run post:new -- "Post Title" en
 *   npm run post:new -- --lang es "Titulo del post"
 */

const SUPPORTED_LOCALES = ["es", "en"];

const rawArgs = process.argv.slice(2);
const args = [...rawArgs];

const langFlagIndex = args.findIndex((arg) => arg === "--lang" || arg === "-l");
let locale = "es";

if (langFlagIndex !== -1) {
    const maybeLocale = args[langFlagIndex + 1];
    if (!maybeLocale || !SUPPORTED_LOCALES.includes(maybeLocale)) {
        console.error("Invalid or missing locale. Use: es | en");
        process.exit(1);
    }
    locale = maybeLocale;
    args.splice(langFlagIndex, 2);
} else {
    const maybeLocale = args[args.length - 1];
    if (maybeLocale && SUPPORTED_LOCALES.includes(maybeLocale)) {
        locale = maybeLocale;
        args.pop();
    }
}

const title = args.join(" ").trim();

if (!title) {
    console.error('Please provide a title: npm run post:new -- "My Post Title" [es|en]');
    process.exit(1);
}

const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const date = new Date().toISOString().split("T")[0];
const localeDir = path.join(process.cwd(), "content/posts", locale);
const filePath = path.join(localeDir, `${slug}.mdx`);

if (fs.existsSync(filePath)) {
    console.error(`Post already exists: ${filePath}`);
    process.exit(1);
}

if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
}

const template = `---
title: "${title}"
description: "Write a 150-160 character summary for SEO and social preview."
date: "${date}"
tags: ["architecture", "software-engineering"]
lang: "${locale}"
draft: true
featured: false
---

## Problem

Describe the context and why this topic matters.

## Core Concept

Break down the main idea.

## Implementation

Provide real-world, production-ready code examples.

\`\`\`python
# Example code
def solve_problem():
    pass
\`\`\`

## Lessons Learned

Summary of key takeaways.

## Conclusion

Wrap up and point to related articles.
`;

try {
    fs.writeFileSync(filePath, template);
    console.log(`Created: content/posts/${locale}/${slug}.mdx`);
    console.log("Next steps:");
    console.log("1. Update description (150-160 chars)");
    console.log("2. Complete content and optional series/coverImage");
    console.log("3. Run npm run seo:audit");
    console.log("4. Set draft: false when ready");
} catch (err) {
    console.error("Failed to create post:", err);
}
