import fs from "fs";
import path from "path";

/**
 * Script to scaffold a new MDX post with proper frontmatter and structure.
 * Usage: tsx scripts/new-post.ts "Post Title" 
 */

const title = process.argv[2];

if (!title) {
    console.error("❌ Please provide a title: npm run post:new \"My Post Title\"");
    process.exit(1);
}

const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const date = new Date().toISOString().split("T")[0];
const filePath = path.join(process.cwd(), "content/posts", `${slug}.mdx`);

if (fs.existsSync(filePath)) {
    console.error(`❌ Error: Post at ${filePath} already exists.`);
    process.exit(1);
}

const template = `---
title: "${title}"
description: "Brief summary (150-160 chars) for SEO and social preview."
date: "${date}"
tags: ["Architecture", "Software Engineering"]
series:
  name: ""
  part: 1
draft: true
---

## The Problem

Start by describing the context and why this topic matters. Engage the reader here.

## The Core Concept

Break down the main idea. Use diagrams if needed.

### Deep Dive

More technical details here.

## Implementation / Code

Provide real-world, production-ready code examples.

\`\`\`python
# Example code
def solve_problem():
    pass
\`\`\`

## Lessons Learned

Summary of key takeaways.

## Conclusion

Wrap up and invite discussion via Giscus below.
`;

try {
    fs.writeFileSync(filePath, template);
    console.log(`✅ Success! New post created at: content/posts/${slug}.mdx`);
    console.log(`👉 Next steps: 
   1. Open the file
   2. Edit description (150-160 chars)
   3. Write your content
   4. Change draft: false to publish`);
} catch (err) {
    console.error("❌ Failed to create post:", err);
}
