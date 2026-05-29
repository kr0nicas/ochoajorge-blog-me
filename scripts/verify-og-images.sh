#!/bin/bash

echo "=== OG Images Verification ==="
echo ""

# Count total posts
total_posts=$(find content/posts/es -name "*.mdx" | wc -l)
echo "Total posts: $total_posts"
echo ""

# Check for posts without OG images
missing_images=0
local_paths=0

for post in content/posts/es/*.mdx; do
    if [ ! -f "$post" ]; then
        continue
    fi
    
    slug=$(basename "$post" .mdx)
    
    # Extract coverImage from frontmatter
    cover_image=$(grep -E "^coverImage:" "$post" | sed 's/^coverImage: *//' | tr -d '"')
    
    if [ -z "$cover_image" ]; then
        echo "❌ [$slug] No OG image found"
        ((missing_images++))
    elif [[ "$cover_image" == /* ]]; then
        echo "⚠️  [$slug] Local path detected: $cover_image"
        ((local_paths++))
    fi
done

echo ""
echo "Issues:"
echo "  Missing OG images: $missing_images"
echo "  Local paths (invalid): $local_paths"

if [ $missing_images -eq 0 ] && [ $local_paths -eq 0 ]; then
    echo ""
    echo "✅ All posts have valid external OG images"
    exit 0
else
    echo ""
    echo "❌ Issues detected"
    exit 1
fi
