#!/usr/bin/env python3
"""
Testing and Validation Script for Social Media Publisher
Runs comprehensive tests to ensure the system works correctly
"""

import sys
import json
import logging
from pathlib import Path
from datetime import datetime, timezone

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent))

from social_media_publisher import (
    BlogPost,
    SocialMediaTemplate,
    PostDiscovery,
    Platform,
    validate_content,
    Config
)

# Test results tracking
test_results = {
    'passed': [],
    'failed': [],
    'skipped': []
}

def test(test_name: str, test_func):
    """Run a test and track results"""
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print('='*80)
    
    try:
        test_func()
        print(f"✓ PASSED: {test_name}")
        test_results['passed'].append(test_name)
        return True
    except AssertionError as e:
        print(f"✗ FAILED: {test_name}")
        print(f"  Error: {str(e)}")
        test_results['failed'].append((test_name, str(e)))
        return False
    except Exception as e:
        print(f"✗ ERROR: {test_name}")
        print(f"  Unexpected error: {str(e)}")
        test_results['failed'].append((test_name, f"Unexpected error: {str(e)}"))
        return False

def assert_equals(actual, expected, message=""):
    """Assert equality with custom message"""
    if actual != expected:
        raise AssertionError(f"{message}\nExpected: {expected}\nActual: {actual}")

def assert_true(condition, message=""):
    """Assert truthiness"""
    if not condition:
        raise AssertionError(message)

def assert_not_empty(value, message=""):
    """Assert value is not empty"""
    if not value:
        raise AssertionError(message)

def assert_file_exists(path: Path, message=""):
    """Assert file exists"""
    if not path.exists():
        raise AssertionError(f"{message}\nFile not found: {path}")

# =============================================================================
# TEST SUITES
# =============================================================================

def test_config_paths():
    """Test configuration paths exist"""
    print("Checking workspace paths...")
    assert_true(Config.WORKSPACE_BLOG.exists(), 
                f"Workspace blog directory not found: {Config.WORKSPACE_BLOG}")
    assert_true(Config.CONTENT_DIR.exists(),
                f"Content directory not found: {Config.CONTENT_DIR}")
    print(f"✓ Workspace: {Config.WORKSPACE_BLOG}")
    print(f"✓ Content dir: {Config.CONTENT_DIR}")

def test_blog_post_parsing():
    """Test parsing blog posts from MDX files"""
    print("Testing blog post parsing...")
    
    mdx_files = list(Config.CONTENT_DIR.glob('*.mdx'))
    assert_true(len(mdx_files) > 0, "No MDX files found")
    print(f"Found {len(mdx_files)} MDX files")
    
    # Test parsing one file
    sample_file = mdx_files[0]
    print(f"Testing: {sample_file.name}")
    
    post = BlogPost.from_mdx(sample_file)
    print(f"  Slug: {post.slug}")
    print(f"  Title: {post.title}")
    print(f"  Date: {post.date}")
    print(f"  Draft: {post.draft}")
    print(f"  URL: {post.url}")
    
    assert_not_empty(post.slug, "Post slug is empty")
    assert_not_empty(post.title, "Post title is empty")
    assert_not_empty(post.url, "Post URL is empty")
    assert_true(isinstance(post.draft, bool), "Draft should be boolean")

def test_published_posts_discovery():
    """Test discovering published posts"""
    print("Testing published posts discovery...")
    
    posts = PostDiscovery.get_published_posts()
    print(f"Found {len(posts)} published posts")
    
    for post in posts[:3]:  # Show first 3
        print(f"  - {post.slug} (draft: {post.draft})")
        assert_true(not post.draft, "Post should not be draft")
    
    # Verify all are published
    for post in posts:
        assert_true(not post.draft, f"Post {post.slug} is marked as draft")

def test_social_template_parsing():
    """Test parsing social media templates"""
    print("Testing social media template parsing...")
    
    # Find LinkedIn template
    linkedin_files = list(Config.CONTENT_DIR.glob('linkedin-*.md'))
    if not linkedin_files:
        print("  No LinkedIn templates found (skipping)")
        test_results['skipped'].append("LinkedIn template parsing")
        return
    
    print(f"Found {len(linkedin_files)} LinkedIn templates")
    
    # Test parsing LinkedIn template
    sample_template = linkedin_files[0]
    print(f"Testing: {sample_template.name}")
    
    template = SocialMediaTemplate.from_file(sample_template)
    print(f"  Platform: {template.platform.value}")
    print(f"  Content length: {len(template.content)} chars")
    
    assert_equals(template.platform, Platform.LINKEDIN, 
                  "Template should be LinkedIn platform")
    assert_not_empty(template.content, "Template content is empty")
    
    # Test X thread template
    x_files = list(Config.CONTENT_DIR.glob('x-thread-*.md'))
    if not x_files:
        print("  No X thread templates found (skipping)")
        test_results['skipped'].append("X thread template parsing")
        return
    
    print(f"Found {len(x_files)} X thread templates")
    
    # Test parsing X thread template
    sample_x_template = x_files[0]
    print(f"Testing: {sample_x_template.name}")
    
    x_template = SocialMediaTemplate.from_file(sample_x_template)
    print(f"  Platform: {x_template.platform.value}")
    print(f"  Content length: {len(x_template.content)} chars")
    
    assert_equals(x_template.platform, Platform.X_TWITTER,
                  "Template should be X platform")

def test_x_thread_extraction():
    """Test extracting tweets from X thread format"""
    print("Testing X thread extraction...")
    
    x_files = list(Config.CONTENT_DIR.glob('x-thread-*.md'))
    if not x_files:
        print("  No X thread templates found (skipping)")
        test_results['skipped'].append("X thread extraction")
        return
    
    template = SocialMediaTemplate.from_file(x_files[0])
    tweets = template.extract_tweets()
    
    print(f"Extracted {len(tweets)} tweets")
    
    for i, tweet in enumerate(tweets[:5]):  # Show first 5
        print(f"  Tweet {i+1}: {len(tweet)} chars")
    
    assert_true(len(tweets) > 0, "No tweets extracted")
    
    # Verify tweets have content
    for tweet in tweets:
        assert_not_empty(tweet, "Tweet is empty")

def test_template_post_matching():
    """Test matching templates with blog posts"""
    print("Testing template-post matching...")
    
    posts = PostDiscovery.get_published_posts()
    assert_true(len(posts) > 0, "No published posts found")
    
    # Check a few posts for templates
    matched_count = 0
    for post in posts[:5]:
        linkedin_template = PostDiscovery.find_social_template(post, Platform.LINKEDIN)
        x_template = PostDiscovery.find_social_template(post, Platform.X_TWITTER)
        
        has_linkedin = linkedin_template is not None
        has_x = x_template is not None
        
        print(f"  {post.slug}:")
        print(f"    LinkedIn: {'✓' if has_linkedin else '✗'}")
        print(f"    X: {'✓' if has_x else '✗'}")
        
        if has_linkedin or has_x:
            matched_count += 1
    
    print(f"\n{matched_count} out of 5 posts have at least one social template")

def test_content_validation():
    """Test content validation"""
    print("Testing content validation...")
    
    # Test valid LinkedIn content
    valid_linkedin = "This is a valid LinkedIn post"
    try:
        validate_content(valid_linkedin, Platform.LINKEDIN)
        print("✓ Valid LinkedIn content accepted")
    except Exception as e:
        raise AssertionError(f"Valid LinkedIn content rejected: {str(e)}")
    
    # Test empty content
    empty_content = ""
    try:
        validate_content(empty_content, Platform.LINKEDIN)
        raise AssertionError("Empty content should be rejected")
    except Exception as e:
        print("✓ Empty content rejected correctly")
    
    # Test valid X content
    valid_x = "This is a valid tweet"
    try:
        validate_content(valid_x, Platform.X_TWITTER)
        print("✓ Valid X content accepted")
    except Exception as e:
        raise AssertionError(f"Valid X content rejected: {str(e)}")
    
    # Test X content with URL
    x_with_url = "Check this out: https://example.com"
    try:
        validate_content(x_with_url, Platform.X_TWITTER)
        print("✓ X content with URL accepted")
    except Exception as e:
        raise AssertionError(f"X content with URL rejected: {str(e)}")
    
    # Test X content that's too long
    very_long_x = "A" * 300
    try:
        validate_content(very_long_x, Platform.X_TWITTER)
        raise AssertionError("Very long X content should be rejected")
    except Exception as e:
        print("✓ Very long X content rejected correctly")

def test_log_directory():
    """Test log directory exists and is writable"""
    print("Testing log directory...")
    
    assert_true(Config.LOG_DIR.exists(), 
                f"Log directory not found: {Config.LOG_DIR}")
    
    # Try to create a test file
    test_file = Config.LOG_DIR / "test_write.txt"
    try:
        test_file.write_text("test")
        test_file.unlink()
        print("✓ Log directory is writable")
    except Exception as e:
        raise AssertionError(f"Cannot write to log directory: {str(e)}")

def test_tracking_file():
    """Test tracking file can be created and read"""
    print("Testing tracking file...")
    
    from social_media_publisher import PublishTracker
    
    tracker = PublishTracker()
    
    # Test marking as published
    test_slug = "test-post"
    tracker.mark_published(test_slug, Platform.LINKEDIN, "test-id-123")
    
    # Test checking if published
    is_published = tracker.is_published(test_slug, Platform.LINKEDIN)
    assert_true(is_published, "Post should be marked as published")
    
    print("✓ Tracking file works correctly")
    
    # Clean up
    if test_slug in tracker.tracker:
        del tracker.tracker[test_slug]
        tracker._save_tracker()

# =============================================================================
# MAIN TEST RUNNER
# =============================================================================

def run_all_tests():
    """Run all tests"""
    print("\n" + "="*80)
    print(" SOCIAL MEDIA PUBLISHER - TEST SUITE")
    print("="*80)
    print(f"Started at: {datetime.now(timezone.utc).isoformat()}")
    print()
    
    # Run all tests
    test("Configuration Paths", test_config_paths)
    test("Blog Post Parsing", test_blog_post_parsing)
    test("Published Posts Discovery", test_published_posts_discovery)
    test("Social Template Parsing", test_social_template_parsing)
    test("X Thread Extraction", test_x_thread_extraction)
    test("Template-Post Matching", test_template_post_matching)
    test("Content Validation", test_content_validation)
    test("Log Directory", test_log_directory)
    test("Tracking File", test_tracking_file)
    
    # Print summary
    print("\n" + "="*80)
    print(" TEST SUMMARY")
    print("="*80)
    print(f"Passed: {len(test_results['passed'])}")
    print(f"Failed: {len(test_results['failed'])}")
    print(f"Skipped: {len(test_results['skipped'])}")
    
    if test_results['failed']:
        print("\nFailed tests:")
        for test_name, error in test_results['failed']:
            print(f"  ✗ {test_name}")
            print(f"    {error}")
    
    if test_results['skipped']:
        print("\nSkipped tests:")
        for test_name in test_results['skipped']:
            print(f"  ⊝ {test_name}")
    
    print("="*80)
    print(f"Finished at: {datetime.now(timezone.utc).isoformat()}")
    
    # Return exit code
    return 0 if not test_results['failed'] else 1

if __name__ == '__main__':
    sys.exit(run_all_tests())