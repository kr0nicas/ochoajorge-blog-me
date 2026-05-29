#!/bin/bash

echo "=== OG Metadata Verification ==="
echo ""

# Check a sample post for complete OG metadata
sample_post="ai-native-seo-preparando-tu-blog-para-la-era-de-los-agentes"
html_file=".next/server/app/es/blog/${sample_post}.html"

if [ ! -f "$html_file" ]; then
    echo "❌ HTML file not found for $sample_post"
    echo "Please run 'npm run build' first"
    exit 1
fi

echo "Checking OG metadata for: $sample_post"
echo ""

# Check required OG tags
tags=(
    "og:title"
    "og:description"
    "og:url"
    "og:image"
    "og:image:width"
    "og:image:height"
    "og:image:alt"
    "og:type"
    "article:published_time"
    "article:author"
    "twitter:card"
    "twitter:title"
    "twitter:description"
    "twitter:image"
)

missing=0
missing_tags=()

for tag in "${tags[@]}"; do
    if grep -q "property=\"$tag\"" "$html_file" || grep -q "name=\"$tag\"" "$html_file"; then
        echo "✅ $tag"
    else
        echo "❌ $tag (MISSING)"
        ((missing++))
        missing_tags+=("$tag")
    fi
done

echo ""
echo "Summary:"
echo "  Total tags checked: ${#tags[@]}"
echo "  Missing: $missing"

if [ $missing -eq 0 ]; then
    echo ""
    echo "✅ All required OG metadata tags are present"
    echo ""
    
    # Extract and display the OG image URL
    og_image=$(grep -oP 'og:image"[^>]*content="\K[^"]*' "$html_file" | head -1)
    echo "OG Image URL: $og_image"
    
    # Verify the image is accessible
    if [ -n "$og_image" ]; then
        http_code=$(curl -sI "$og_image" 2>&1 | grep -oE 'HTTP/[0-9.]+ [0-9]+' | head -1 | awk '{print $2}')
        echo "Image HTTP status: $http_code"
        
        if [ "$http_code" = "200" ]; then
            echo "✅ Image is accessible"
        else
            echo "❌ Image is not accessible (HTTP $http_code)"
        fi
    fi
    
    exit 0
else
    echo ""
    echo "❌ Missing tags:"
    for tag in "${missing_tags[@]}"; do
        echo "  - $tag"
    done
    exit 1
fi
