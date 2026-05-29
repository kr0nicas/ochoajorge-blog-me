#!/usr/bin/env node

import { getAllPosts, getFeaturedPosts } from '../lib/posts.ts';

const locale = 'es';

console.log('=== Posts Analysis ===\n');

// Get all posts
const allPosts = getAllPosts(locale);
console.log(`Total posts: ${allPosts.length}`);

// Get featured posts
const featuredPosts = getFeaturedPosts(8, locale);
console.log(`Featured posts (homepage, max 8): ${featuredPosts.length}\n`);

// Show featured posts with details
console.log('=== Featured Posts (Homepage) ===');
console.log('Order: Featured first, then by date descending\n');

featuredPosts.forEach((post, i) => {
  const featured = post.featured ? '⭐' : '  ';
  const draft = post.draft ? '📝' : '  ';
  console.log(`${i+1}. ${featured}${draft} ${post.date} | ${post.title}`);
});

// Show all posts in order
console.log('\n=== All Posts (Sorted Order) ===');
allPosts.forEach((post, i) => {
  const featured = post.featured ? '⭐' : '  ';
  const draft = post.draft ? '📝' : '  ';
  console.log(`${i+1}. ${featured}${draft} ${post.date} | ${post.title}`);
});

// Check for potential issues
console.log('\n=== Issues ===');
const issues = [];

// Check for posts without dates
const postsWithoutDates = allPosts.filter(p => !p.date);
if (postsWithoutDates.length > 0) {
  issues.push(`${postsWithoutDates.length} posts without dates`);
}

// Check for posts with future dates
const now = new Date();
const postsWithFutureDates = allPosts.filter(p => new Date(p.date) > now);
if (postsWithFutureDates.length > 0) {
  issues.push(`${postsWithFutureDates.length} posts with future dates`);
}

// Check for duplicate slugs
const slugCounts = allPosts.reduce((acc, p) => {
  acc[p.slug] = (acc[p.slug] || 0) + 1;
  return acc;
}, {});
const duplicateSlugs = Object.entries(slugCounts).filter(([_, count]) => count > 1);
if (duplicateSlugs.length > 0) {
  issues.push(`${duplicateSlugs.length} duplicate slugs`);
}

// Check for social media templates
const socialTemplates = ['linkedin-', 'x-thread-'];
const foundSocialTemplates = allPosts.filter(p =>
  socialTemplates.some(prefix => p.slug.startsWith(prefix))
);
if (foundSocialTemplates.length > 0) {
  issues.push(`${foundSocialTemplates.length} social media templates in listing`);
}

if (issues.length === 0) {
  console.log('✓ No issues found');
} else {
  issues.forEach(issue => console.log(`✗ ${issue}`));
}

console.log('\n=== Posts per Tag ===');
const tagCounts = allPosts.reduce((acc, p) => {
  (p.tags || []).forEach(tag => {
    acc[tag] = (acc[tag] || 0) + 1;
  });
  return acc;
}, {});

Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([tag, count]) => {
    console.log(`${tag}: ${count}`);
  });

console.log('\n=== Posts per Series ===');
const seriesCounts = allPosts.reduce((acc, p) => {
  if (p.series?.name) {
    acc[p.series.name] = (acc[p.series.name] || 0) + 1;
  }
  return acc;
}, {});

Object.entries(seriesCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([series, count]) => {
    console.log(`${series}: ${count}`);
  });
