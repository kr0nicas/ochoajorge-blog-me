# Social Media Publisher Setup Guide

## Overview

This is a production-ready automation script for automatically publishing social media content from your blog (ochoajorge.me) to LinkedIn and X (Twitter). The script follows clean architecture principles with proper security, error handling, retries, and logging.

## Features

- ✅ **Automated Publishing**: Auto-publishes to LinkedIn and X after blog posts are published
- ✅ **Security First**: All credentials in environment variables (never hardcoded)
- ✅ **Error Handling**: Comprehensive error handling with retry logic
- ✅ **Rate Limiting**: Respects API rate limits with exponential backoff
- ✅ **Logging**: Detailed logging with timestamps and error tracking
- ✅ **Thread Support**: X/Twitter thread format support
- ✅ **LinkedIn Articles**: Full LinkedIn article format support
- ✅ **Dry Run Mode**: Test without actually publishing
- ✅ **Tracking**: Tracks which posts have been published to avoid duplicates

## Prerequisites

### 1. Python Environment

```bash
# Ensure Python 3.9+ is installed
python3 --version

# Create virtual environment
cd ~/workspace-blog/scripts
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

## Setup Instructions

### Step 1: LinkedIn API Setup

1. **Create LinkedIn Developer Account**
   - Go to: https://www.linkedin.com/developers/
   - Sign in with your LinkedIn account
   - Apply for developer access (usually instant)

2. **Create Application**
   - Click "Create App"
   - Fill in app details:
     - App name: "OchoaJorge Blog Publisher"
     - App logo: Optional
     - Use case: "Personal blog automation"
   - Add products:
     - "Share on LinkedIn"
     - "Sign In with LinkedIn"
   - Configure OAuth 2.0:
     - Redirect URL: `http://localhost:8000/callback` (or your preferred URL)
     - Permissions: `r_liteprofile`, `r_emailaddress`, `w_member_social`

3. **Generate Access Token**
   - Use OAuth 2.0 flow to get access token
   - Or use LinkedIn's OAuth 2.0 tools page
   - Save these credentials

4. **Get Your LinkedIn User ID**
   - Use: `https://api.linkedin.com/v2/me` with your access token
   - Note down the `id` field (urn:li:person:XXXXXXXXX)
   - Extract the numeric ID portion

### Step 2: X (Twitter) API Setup

1. **Create Twitter Developer Account**
   - Go to: https://developer.twitter.com/en/portal/dashboard
   - Sign in with your Twitter account
   - Apply for developer access

2. **Create Project and App**
   - Click "Create Project"
   - Name: "OchoaJorge Blog Publisher"
   - Create app within the project
   - Enable "Read and write" permissions
   - Generate API keys and access tokens

3. **Save Credentials**
   - API Key
   - API Secret
   - Access Token
   - Access Secret

### Step 3: Environment Variables

1. **Copy Example File**
```bash
cd ~/workspace-blog/scripts
cp .env.example .env
```

2. **Fill in Credentials**
```bash
# Edit .env file
nano .env  # or use your preferred editor
```

3. **Verify Variables**
```bash
python3 social_media_publisher.py --check-env
```

All variables should show "✓ SET".

### Step 4: Create Social Media Templates

Your blog posts should have corresponding social media templates:

**LinkedIn Template Format:**
```bash
# File: content/posts/es/linkedin-your-post-slug.md
# Post Title

Your LinkedIn content here...

Leer el análisis completo: https://ochoajorge.me/es/blog/your-post-slug

#TechLeadership #SoftwareArchitecture #AI
```

**X Thread Template Format:**
```bash
# File: content/posts/es/x-thread-your-post-slug.md
# X Thread: Post Title

1/5
First tweet of thread...

2/5
Second tweet...

🔗 Full thread: https://ochoajorge.me/es/blog/your-post-slug

#AI #SoftwareArchitecture
```

## Usage

### Basic Commands

```bash
# Activate virtual environment
cd ~/workspace-blog/scripts
source venv/bin/activate

# List all published posts
python3 social_media_publisher.py --list-posts

# Publish specific post
python3 social_media_publisher.py --post-slug your-post-slug

# Publish all unpublished posts
python3 social_media_publisher.py

# Dry run (test without publishing)
python3 social_media_publisher.py --dry-run

# Check environment variables
python3 social_media_publisher.py --check-env
```

### Examples

```bash
# Publish specific post
python3 social_media_publisher.py --post-slug deuda-tecnica-en-la-era-de-la-ia-mitos-y-realidades

# Test run for all posts
python3 social_media_publisher.py --dry-run

# See what's available to publish
python3 social_media_publisher.py --list-posts
```

## Cron Job Setup

### Option 1: User Cron (Recommended)

```bash
# Edit crontab
crontab -e

# Add this line (run every hour)
0 * * * * cd /home/kr0nicas/workspace-blog/scripts && /home/kr0nicas/workspace-blog/scripts/venv/bin/python3 social_media_publisher.py >> /home/kr0nicas/.hermes/logs/cron_output.log 2>&1

# Or run every 6 hours
0 */6 * * * cd /home/kr0nicas/workspace-blog/scripts && /home/kr0nicas/workspace-blog/scripts/venv/bin/python3 social_media_publisher.py >> /home/kr0nicas/.hermes/logs/cron_output.log 2>&1
```

### Option 2: System Cron (Optional)

Create `/etc/cron.d/social-media-publisher`:
```bash
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# Run as user kr0nicas every hour
0 * * * * kr0nicas cd /home/kr0nicas/workspace-blog/scripts && /home/kr0nicas/workspace-blog/scripts/venv/bin/python3 social_media_publisher.py >> /home/kr0nicas/.hermes/logs/cron_output.log 2>&1
```

### Option 3: Systemd Timer (Alternative)

Create `~/.config/systemd/user/social-media-publisher.service`:
```ini
[Unit]
Description=Social Media Publisher
After=network.target

[Service]
Type=oneshot
WorkingDirectory=/home/kr0nicas/workspace-blog/scripts
ExecStart=/home/kr0nicas/workspace-blog/scripts/venv/bin/python3 social_media_publisher.py
Environment="PATH=/home/kr0nicas/workspace-blog/scripts/venv/bin"
```

Create `~/.config/systemd/user/social-media-publisher.timer`:
```ini
[Unit]
Description=Run Social Media Publisher hourly

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
```

Enable the timer:
```bash
systemctl --user enable social-media-publisher.timer
systemctl --user start social-media-publisher.timer
```

## Testing & Validation

### 1. Environment Check
```bash
python3 social_media_publisher.py --check-env
```

### 2. List Posts
```bash
python3 social_media_publisher.py --list-posts
```

### 3. Dry Run
```bash
python3 social_media_publisher.py --dry-run
```

### 4. Test Single Post
```bash
# First, create test templates if needed
# Then run dry run
python3 social_media_publisher.py --post-slug your-test-post --dry-run

# If dry run succeeds, publish for real
python3 social_media_publisher.py --post-slug your-test-post
```

### 5. Check Logs
```bash
# View logs
tail -f ~/.hermes/logs/social_media_publisher.log

# Check cron logs
tail -f ~/.hermes/logs/cron_output.log

# Check tracking data
cat ~/.hermes/logs/social_media_tracker.json
```

### 6. Manual Verification

After publishing, verify:
1. Check your LinkedIn profile for the post
2. Check your X/Twitter profile for the thread
3. Verify the content matches your templates
4. Check the blog URL is correct
5. Verify hashtags are included

## Monitoring & Maintenance

### Regular Tasks

```bash
# Check logs daily
tail -100 ~/.hermes/logs/social_media_publisher.log

# Review tracking data weekly
cat ~/.hermes/logs/social_media_tracker.json | jq .

# Check API usage (in developer portals)
# LinkedIn: https://www.linkedin.com/developers/apps
# X: https://developer.twitter.com/en/portal/dashboard

# Rotate credentials quarterly
# Update access tokens in .env file
```

### Troubleshooting

**Common Issues:**

1. **Authentication Failed**
   - Verify credentials in .env
   - Check access tokens are not expired
   - Verify API permissions

2. **Rate Limit Exceeded**
   - Check API rate limits in developer portals
   - Increase retry backoff time
   - Reduce cron frequency

3. **Template Not Found**
   - Verify template naming: `linkedin-{slug}.md` and `x-thread-{slug}.md`
   - Check templates are in `content/posts/es/` directory
   - Ensure blog post `draft: false`

4. **Content Validation Failed**
   - Check tweet length (max 280 chars, URLs count as 23)
   - Verify markdown formatting
   - Check for special characters

### Error Codes

| Error | Meaning | Solution |
|-------|---------|----------|
| `ConfigurationError` | Missing environment variables | Check .env file |
| `AuthenticationError` | Invalid credentials | Regenerate access tokens |
| `RateLimitError` | API rate limit exceeded | Wait or reduce frequency |
| `ContentError` | Invalid content | Fix template content |

## Security Best Practices

1. **Never commit .env to version control**
   ```bash
   # Add to .gitignore
   echo ".env" >> ~/workspace-blog/.gitignore
   echo "venv/" >> ~/workspace-blog/.gitignore
   ```

2. **Rotate credentials regularly**
   - Update access tokens every 90 days
   - Use separate credentials for dev/prod

3. **Monitor API usage**
   - Check developer portals regularly
   - Set up alerts for unusual activity

4. **Limit permissions**
   - Only grant necessary API permissions
   - Use least privilege principle

5. **Secure your computer**
   - Use SSH keys, not passwords
   - Enable 2FA on all accounts

## Architecture Overview

```
social_media_publisher.py
├── Configuration (Config class)
├── Data Models (BlogPost, SocialMediaTemplate, PublishResult)
├── Exceptions (Custom error hierarchy)
├── Logging (File + console handlers)
├── Utilities (Environment vars, retries, validation)
├── Clients
│   ├── LinkedInClient (UGC API)
│   └── XClient (Twitter API v2)
├── Post Discovery (Find published posts and templates)
├── Publish Tracking (Track published posts)
└── SocialMediaPublisher (Main orchestrator)
```

## Support & Maintenance

For issues or questions:
1. Check logs: `~/.hermes/logs/social_media_publisher.log`
2. Verify environment: `--check-env`
3. Test with dry run: `--dry-run`
4. Review API status pages:
   - LinkedIn: https://www.linkedin.com/help/linkedin/answer/a108718
   - X: https://status.twitterstat.us/

## License

This script is proprietary software for Jorge Ochoa's personal blog automation.

---

**Author**: Jorge Ochoa (Equifax LATAM)
**Created**: July 2026
**Version**: 1.0.0