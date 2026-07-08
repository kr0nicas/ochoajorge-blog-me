#!/bin/bash
# Quick Test Script - Validates social media publisher without API credentials

echo "=========================================="
echo "Social Media Publisher - Quick Validation"
echo "=========================================="
echo ""

cd /home/kr0nicas/workspace-blog/scripts

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found"
    echo "Run: ./setup_social_media.sh"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Test 1: Run test suite
echo "🧪 Running test suite..."
python3 test_social_media.py
TEST_EXIT=$?

if [ $TEST_EXIT -eq 0 ]; then
    echo "✅ All tests passed"
else
    echo "❌ Some tests failed"
fi

echo ""

# Test 2: List published posts
echo "📝 Listing published posts..."
python3 social_media_publisher.py --list-posts | head -20
echo ""

# Test 3: Dry run
echo "🔍 Running dry run (first 5 posts)..."
python3 social_media_publisher.py --dry-run 2>&1 | grep -E "(Processing post|LINKEDIN:|X:)" | head -20
echo ""

# Test 4: Check logs
echo "📋 Checking logs..."
if [ -f ~/.hermes/logs/social_media_publisher.log ]; then
    echo "✅ Log file exists: ~/.hermes/logs/social_media_publisher.log"
    echo "Last 5 log entries:"
    tail -5 ~/.hermes/logs/social_media_publisher.log
else
    echo "⚠️  Log file not found yet (will be created on first run)"
fi

echo ""
echo "=========================================="
echo "Quick Validation Complete"
echo "=========================================="

if [ $TEST_EXIT -eq 0 ]; then
    echo "✅ System is ready for production use"
    echo ""
    echo "Next steps:"
    echo "1. Add API credentials to .env file"
    echo "2. Run: python3 social_media_publisher.py --check-env"
    echo "3. Test with: python3 social_media_publisher.py --dry-run"
    echo "4. Setup cron job (see README_SOCIAL_MEDIA.md)"
else
    echo "❌ Some issues found - please review above"
fi