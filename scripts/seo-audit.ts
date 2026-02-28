import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * SEO Audit Script: validates MDX posts for metadata standards.
 * Runs check on all non-draft posts by default.
 */

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".mdx"));

let errors = 0;

files.forEach(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data } = matter(raw);

    // Check description length
    if (data.description && (data.description.length < 130 || data.description.length > 170)) {
        console.warn(`⚠️  SEO: ${file} description length is ${data.description.length} (IDEAL: 150-160)`);
    }

    // Check required fields
    if (!data.title) {
        console.error(`❌ ERROR: ${file} is missing mandatory "title" field.`);
        errors++;
    }

    if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
        console.warn(`⚠️  SEO: ${file} has no tags.`);
    }

    // Check series formatting
    if (data.series && (!data.series.name || data.series.part === undefined)) {
        console.error(`❌ ERROR: ${file} has a malformed "series" object.`);
        errors++;
    }
});

if (errors > 0) {
    console.error(`\n❌ Found ${errors} critical errors in posts metadata.`);
    process.exit(1);
} else {
    console.log("✅ SEO Audit passed! Content metadata is healthy.");
}
