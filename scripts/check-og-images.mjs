#!/usr/bin/env node

import { getAllPosts } from '../lib/posts.ts';

const locale = 'es';

console.log('=== OG Images Check ===\n');

const allPosts = getAllPosts(locale);
const issues = [];

allPosts.forEach((post, i) => {
  const hasCoverImage = post.coverImage && post.coverImage.length > 0;
  const isLocalPath = post.coverImage && post.coverImage.startsWith('/');

  if (!hasCoverImage) {
    issues.push(`Post "${post.title}" has no coverImage`);
  } else if (isLocalPath) {
    issues.push(`Post "${post.title}" has local path: ${post.coverImage}`);
    console.log(`⚠️  ${post.title}`);
    console.log(`   coverImage: ${post.coverImage} (local path, might not exist)`);
  } else {
    // Check if URL is external
    try {
      new URL(post.coverImage);
      console.log(`✓ ${post.title}`);
      console.log(`   coverImage: ${post.coverImage}`);
    } catch {
      issues.push(`Post "${post.title}" has invalid coverImage URL: ${post.coverImage}`);
      console.log(`✗ ${post.title}`);
      console.log(`   coverImage: ${post.coverImage} (invalid URL)`);
    }
  }
  console.log('');
});

console.log('=== Summary ===');
console.log(`Total posts: ${allPosts.length}`);
console.log(`Issues: ${issues.length}`);

if (issues.length > 0) {
  console.log('\nIssues found:');
  issues.forEach(issue => console.log(`  - ${issue}`));
  process.exit(1);
} else {
  console.log('\n✓ All posts have valid external OG image URLs');
  process.exit(0);
}
