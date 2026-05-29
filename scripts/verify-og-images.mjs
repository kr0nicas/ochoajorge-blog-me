#!/usr/bin/env node

import { getAllPosts } from '../lib/posts.js';

const locale = 'es';

console.log('=== OG Images Verification ===\n');

const allPosts = getAllPosts(locale);
const issues = [];

for (const post of allPosts) {
    const coverImage = post.coverImage || post.ogImage;

    if (!coverImage) {
        issues.push({
            slug: post.slug,
            title: post.title,
            issue: 'No OG image found',
            type: 'missing'
        });
        continue;
    }

    // Check if it's a local path (invalid for OG)
    if (coverImage.startsWith('/images/') || coverImage.startsWith('/')) {
        issues.push({
            slug: post.slug,
            title: post.title,
            issue: `Local path detected: ${coverImage}`,
            url: coverImage,
            type: 'local'
        });
        continue;
    }

    // Verify the URL is accessible (basic check)
    try {
        new URL(coverImage);
    } catch (error) {
        issues.push({
            slug: post.slug,
            title: post.title,
            issue: `Invalid URL: ${coverImage}`,
            url: coverImage,
            type: 'invalid'
        });
    }
}

// Print results
console.log(`Total posts: ${allPosts.length}`);
console.log(`Issues found: ${issues.length}\n`);

if (issues.length === 0) {
    console.log('✅ All posts have valid external OG images');
} else {
    console.log('❌ Issues detected:\n');
    
    for (const issue of issues) {
        console.log(`[${issue.type.toUpperCase()}] ${issue.title}`);
        console.log(`  Slug: ${issue.slug}`);
        console.log(`  Issue: ${issue.issue}`);
        if (issue.url) {
            console.log(`  URL: ${issue.url}`);
        }
        console.log('');
    }
}

// Exit with error code if issues found
process.exit(issues.length > 0 ? 1 : 0);
