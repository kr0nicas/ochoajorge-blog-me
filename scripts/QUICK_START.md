# Social Media Publisher - Quick Reference Guide

## Essential Commands

```bash
cd ~/workspace-blog/scripts

# Setup (run once)
./setup_social_media.sh

# Environment check
python3 social_media_publisher.py --check-env

# List published posts
python3 social_media_publisher.py --list-posts

# Dry run (test without publishing)
python3 social_media_publisher.py --dry-run

# Publish specific post
python3 social_media_publisher.py --post-slug your-post-slug

# Publish all unpublished posts
python3 social_media_publisher.py

# Run tests
python3 test_social_media.py

# View logs
tail -f ~/.hermes/logs/social_media_publisher.log

# Check tracking data
cat ~/.hermes/logs/social_media_tracker.json
```

## Quick Setup (5 minutes)

1. **Setup environment**
   ```bash
   cd ~/workspace-blog/scripts
   ./setup_social_media.sh
   ```

2. **Add credentials**
   ```bash
   nano .env
   # Add your LinkedIn and X API credentials
   ```

3. **Verify setup**
   ```bash
   python3 social_media_publisher.py --check-env
   python3 test_social_media.py
   ```

4. **Test publish**
   ```bash
   python3 social_media_publisher.py --dry-run
   ```

5. **Publish for real**
   ```bash
   python3 social_media_publisher.py --post-slug your-post-slug
   ```

## Template Naming Convention

Place templates in `~/workspace-blog/content/posts/es/`:

- **LinkedIn**: `linkedin-{post-slug}.md`
- **X Thread**: `x-thread-{post-slug}.md`

Example:
- Blog post: `deuda-tecnica-en-la-era-de-la-ia-mitos-y-realidades.mdx`
- LinkedIn: `linkedin-deuda-tecnica-en-la-era-de-la-ia-mitos-y-realidades.md`
- X Thread: `x-thread-deuda-tecnica-en-la-era-de-la-ia-mitos-y-realidades.md`

## Cron Job Setup

```bash
# Edit crontab
crontab -e

# Add this line (run every hour)
0 * * * * cd /home/kr0nicas/workspace-blog/scripts && /home/kr0nicas/workspace-blog/scripts/venv/bin/python3 social_media_publisher.py >> /home/kr0nicas/.hermes/logs/cron_output.log 2>&1
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Missing env vars | Edit `.env` file |
| Authentication failed | Regenerate access tokens |
| Rate limit exceeded | Wait or reduce cron frequency |
| Template not found | Check template naming convention |
| Content too long | Edit template content |

## Files Created

- `social_media_publisher.py` - Main script
- `requirements.txt` - Python dependencies
- `.env.example` - Environment variables template
- `README_SOCIAL_MEDIA.md` - Full documentation
- `setup_social_media.sh` - Setup script
- `test_social_media.py` - Test suite
- `QUICK_START.md` - This file

## Getting Help

1. Check logs: `tail -f ~/.hermes/logs/social_media_publisher.log`
2. Run tests: `python3 test_social_media.py`
3. Read docs: `README_SOCIAL_MEDIA.md`
4. Verify env: `--check-env`

## Security Reminders

- ✅ Never commit `.env` to git
- ✅ Rotate credentials every 90 days
- ✅ Use separate dev/prod credentials
- ✅ Monitor API usage regularly
- ✅ Keep your computer secure