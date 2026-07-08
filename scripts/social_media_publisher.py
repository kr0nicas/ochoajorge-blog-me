#!/usr/bin/env python3
"""
Social Media Publisher for ochoajorge.me
Automatically publishes LinkedIn and X (Twitter) content after blog posts are published.

Author: Jorge Ochoa (Equifax LATAM)
Architecture: Clean, production-ready with error handling, retries, and logging
"""

import os
import re
import sys
import json
import logging
import argparse
import time
from pathlib import Path
from typing import Any, Optional, Dict, List
from dataclasses import dataclass, field
from datetime import datetime, date, timezone
from enum import Enum

import requests
import frontmatter
import tweepy

# Load credentials from a local .env file if present. python-dotenv is a
# declared dependency; without this the documented cron invocation
# (`venv/bin/python publisher.py`) runs with NO credentials and silently
# publishes nothing.
try:
    from dotenv import load_dotenv

    # Look for .env next to this script (scripts/.env), which is where
    # setup_social_media.sh creates it.
    load_dotenv(Path(__file__).resolve().parent / ".env")
except ImportError:  # dotenv optional at runtime; env vars may be exported
    pass
# LinkedIn API - using direct REST API calls instead of python_linkedin_v2
# from python_linkedin_v2 import linkedin

# =============================================================================
# CONFIGURATION & CONSTANTS
# =============================================================================

class Platform(Enum):
    """Social media platforms supported"""
    LINKEDIN = "linkedin"
    X_TWITTER = "x"

class Config:
    """Configuration management with environment variable support"""
    
    # Paths
    WORKSPACE_BLOG = Path.home() / "workspace-blog"
    CONTENT_DIR = WORKSPACE_BLOG / "content" / "posts" / "es"
    
    # Environment variable names.
    #
    # Each entry is (canonical_name, [aliases...]). The canonical names follow
    # the project spec; aliases keep older .env files working so a rename does
    # not silently break a live deployment. The first name that resolves to a
    # non-empty value wins (see get_env_var).
    #
    # LinkedIn: client id/secret are only needed to *mint* an access token via
    # OAuth; posting only needs the access token + author URN. They are therefore
    # optional at runtime.
    LINKEDIN_CLIENT_ID = ("LINKEDIN_CLIENT_ID", ["LINKEDIN_API_KEY"])
    LINKEDIN_CLIENT_SECRET = ("LINKEDIN_CLIENT_SECRET", ["LINKEDIN_API_SECRET"])
    LINKEDIN_ACCESS_TOKEN = ("LINKEDIN_ACCESS_TOKEN", [])
    LINKEDIN_USER_ID = ("LINKEDIN_USER_ID", [])

    X_API_KEY = ("X_API_KEY", [])
    X_API_SECRET = ("X_API_SECRET", [])
    X_ACCESS_TOKEN = ("X_ACCESS_TOKEN", [])
    # Spec lists both X_ACCESS_TOKEN_SECRET and X_ACCESS_SECRET; accept either.
    X_ACCESS_TOKEN_SECRET = ("X_ACCESS_TOKEN_SECRET", ["X_ACCESS_SECRET"])
    
    # Rate limiting
    LINKEDIN_RATE_LIMIT = 3  # posts per minute
    X_RATE_LIMIT = 300  # tweets per 15 minutes
    
    # Retry configuration
    MAX_RETRIES = 3
    INITIAL_BACKOFF = 2.0  # seconds
    BACKOFF_MULTIPLIER = 2.0
    
    # Logging
    LOG_DIR = Path.home() / ".hermes" / "logs"
    LOG_FILE = LOG_DIR / "social_media_publisher.log"

# =============================================================================
# DATA MODELS
# =============================================================================

@dataclass
class BlogPost:
    """Represents a blog post"""
    slug: str
    title: str
    description: str
    date: datetime
    tags: List[str]
    draft: bool
    url: str
    file_path: Path
    
    @classmethod
    def from_mdx(cls, file_path: Path) -> 'BlogPost':
        """Parse MDX file to create BlogPost instance"""
        post = frontmatter.load(file_path)
        
        # ``.stem`` already strips the final extension (.md/.mdx).
        slug = file_path.stem
        title = post.get('title', '')
        description = post.get('description', '')
        raw_date = post.get('date', '')
        tags = post.get('tags', []) or []
        draft = post.get('draft', True)

        parsed_date = cls._parse_date(raw_date)
        
        url = f"https://ochoajorge.me/es/blog/{slug}"
        
        return cls(
            slug=slug,
            title=title,
            description=description,
            date=parsed_date,
            tags=tags,
            draft=draft,
            url=url,
            file_path=file_path
        )

    @staticmethod
    def _parse_date(raw) -> datetime:
        """Coerce a frontmatter date into a timezone-aware datetime.

        PyYAML may hand us a ``datetime``/``date`` object (unquoted date) or a
        string (quoted date). The original code only handled the string case and
        silently fell back to ``now()`` for real date objects, corrupting the
        newest-first sort order.
        """
        if isinstance(raw, datetime):
            return raw if raw.tzinfo else raw.replace(tzinfo=timezone.utc)
        if isinstance(raw, date):
            return datetime(raw.year, raw.month, raw.day, tzinfo=timezone.utc)
        if isinstance(raw, str) and raw.strip():
            for fmt in ('%Y-%m-%d', '%Y-%m-%dT%H:%M:%S', '%Y-%m-%d %H:%M:%S'):
                try:
                    return datetime.strptime(raw.strip(), fmt).replace(tzinfo=timezone.utc)
                except ValueError:
                    continue
            logger.warning(f"Unrecognized date format: {raw!r}; using current time")
        return datetime.now(timezone.utc)

@dataclass
class SocialMediaTemplate:
    """Represents a social media template"""
    platform: Platform
    content: str
    file_path: Path
    
    @classmethod
    def from_file(cls, file_path: Path) -> 'SocialMediaTemplate':
        """Parse social media template file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Determine platform
        if 'linkedin' in file_path.name.lower():
            platform = Platform.LINKEDIN
        elif 'x-thread' in file_path.name.lower():
            platform = Platform.X_TWITTER
        else:
            raise ValueError(f"Unknown platform for file: {file_path}")
        
        return cls(platform=platform, content=content, file_path=file_path)
    
    # A fenced code block, optionally with a language hint after the opening
    # fence. Used to pull out the actual tweet bodies from the template.
    _FENCE_RE = re.compile(
        r'^```[^\n]*\n(?P<body>.*?)(?:\n)?^```\s*$',
        re.DOTALL | re.MULTILINE,
    )

    def extract_tweets(self) -> List[str]:
        """Extract individual tweets from a thread template.

        The canonical template format used by this blog is::

            # Thread de X (Twitter) - <title>
            ## Post 1 (Main)
            ```
            <tweet text, possibly multi-line>
            ```
            ## Post 2 (...)
            ```
            <tweet text>
            ```

        i.e. each tweet lives inside a fenced code block. That is the primary
        strategy. If a template uses no code fences we fall back to older
        conventions (``N/N`` counters or ``---`` separators) so hand-written
        threads still work.
        """
        tweets = self._extract_from_fences()
        if tweets:
            return tweets
        return self._extract_from_markers()

    def _extract_from_fences(self) -> List[str]:
        """Extract each fenced code block as one tweet."""
        return [
            m.group('body').strip()
            for m in self._FENCE_RE.finditer(self.content)
            if m.group('body').strip()
        ]

    def _extract_from_markers(self) -> List[str]:
        """Fallback parser for fence-less threads.

        Splits on standalone ``N/N`` counters or ``---`` rules, dropping
        markdown headings/decorations so we do not post ``## Post 1`` as a tweet.
        """
        tweets: List[str] = []
        current: List[str] = []

        def flush():
            text = '\n'.join(current).strip()
            if text:
                tweets.append(text)
            current.clear()

        for raw in self.content.split('\n'):
            line = raw.strip()
            # Separators / counters delimit tweets.
            if re.match(r'^\d+/\d+\s*$', line) or re.match(r'^-{3,}\s*$', line):
                flush()
                continue
            # Skip markdown headings (e.g. "## Post 1 (Main)") and the title.
            if line.startswith('#'):
                flush()
                continue
            if line:
                current.append(raw)

        flush()
        return tweets

@dataclass
class PublishResult:
    """Result of a publish operation"""
    platform: Platform
    success: bool
    post_id: Optional[str] = None
    error_message: Optional[str] = None
    # default_factory so each result gets its own creation time; a bare
    # ``datetime.now(...)`` default is evaluated once at import and frozen.
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

# =============================================================================
# EXCEPTIONS
# =============================================================================

class SocialMediaPublisherError(Exception):
    """Base exception for social media publisher"""
    pass

class ConfigurationError(SocialMediaPublisherError):
    """Raised when configuration is invalid"""
    pass

class AuthenticationError(SocialMediaPublisherError):
    """Raised when authentication fails"""
    pass

class RateLimitError(SocialMediaPublisherError):
    """Raised when rate limit is exceeded"""
    pass

class ContentError(SocialMediaPublisherError):
    """Raised when content is invalid"""
    pass

# =============================================================================
# LOGGING SETUP
# =============================================================================

def setup_logging() -> logging.Logger:
    """Configure logging with file and console handlers"""
    Config.LOG_DIR.mkdir(parents=True, exist_ok=True)
    
    logger = logging.getLogger('social_media_publisher')
    logger.setLevel(logging.INFO)
    
    # File handler
    file_handler = logging.FileHandler(Config.LOG_FILE)
    file_handler.setLevel(logging.INFO)
    file_format = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S %Z'
    )
    file_handler.setFormatter(file_format)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_format = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_format)
    
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

logger = setup_logging()

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def get_env_var(spec, required: bool = True) -> Optional[str]:
    """Get an environment variable, supporting a canonical name plus aliases.

    ``spec`` is either a plain string name or a ``(canonical, [aliases])`` tuple
    as defined on :class:`Config`. The first name that resolves to a non-empty,
    stripped value is returned so that legacy variable names keep working.
    """
    if isinstance(spec, tuple):
        canonical, aliases = spec
    else:
        canonical, aliases = spec, []

    for name in (canonical, *aliases):
        value = os.getenv(name)
        if value and value.strip():
            return value.strip()

    if required:
        names = " / ".join((canonical, *aliases))
        raise ConfigurationError(
            f"Required environment variable {names} is not set"
        )
    return None

def retry_on_rate_limit(func, max_retries: int = Config.MAX_RETRIES,
                        backoff: float = Config.INITIAL_BACKOFF) -> Any:
    """Retry ``func`` with exponential backoff, but ONLY on rate-limit errors.

    Publishing to LinkedIn/X is NOT idempotent: a 429 means the write was
    rejected (safe to retry), but a network error or unexpected exception may
    have already committed the post. Blindly retrying those would double-post,
    so we deliberately do not catch generic exceptions here — callers surface
    them as a failed result instead.
    """
    last_exception = None

    for attempt in range(max_retries):
        try:
            return func()
        except RateLimitError as e:
            last_exception = e
            if attempt < max_retries - 1:
                delay = backoff * (Config.BACKOFF_MULTIPLIER ** attempt)
                logger.warning(
                    f"Rate limit hit (attempt {attempt + 1}/{max_retries}); "
                    f"backing off {delay:.1f}s"
                )
                time.sleep(delay)

    logger.error(f"All {max_retries} attempts failed due to rate limiting")
    raise last_exception or RateLimitError("All retry attempts failed")

def validate_content(content: str, platform: Platform) -> None:
    """Validate social media content"""
    if not content or not content.strip():
        raise ContentError(f"Content is empty for {platform.value}")
    
    if platform == Platform.X_TWITTER:
        # Twitter/X character limit (approximate, varies with URLs)
        if len(content) > 280:
            # URLs are t.co shortened to ~23 chars, so count actual URL length
            url_pattern = r'https?://\S+'
            urls = re.findall(url_pattern, content)
            char_count = len(content)
            for url in urls:
                char_count -= len(url)
                char_count += 23
            
            if char_count > 280:
                raise ContentError(f"Tweet too long: {char_count} chars (max 280)")

# =============================================================================
# LINKEDIN CLIENT
# =============================================================================

class LinkedInClient:
    """LinkedIn API client with proper authentication and error handling"""
    
    def __init__(self):
        """Initialize LinkedIn client with credentials from environment"""
        # client id/secret are only needed for OAuth token minting, not for
        # posting with an existing access token — so they are optional here.
        self.client_id = get_env_var(Config.LINKEDIN_CLIENT_ID, required=False)
        self.client_secret = get_env_var(Config.LINKEDIN_CLIENT_SECRET, required=False)
        self.access_token = get_env_var(Config.LINKEDIN_ACCESS_TOKEN)
        self.user_id = get_env_var(Config.LINKEDIN_USER_ID)
        
        # Note: Using requests directly for LinkedIn UGC API
        # python-linkedin_v2 may not support UGC API fully
        self.base_url = "https://api.linkedin.com/v2/ugcPosts"
        self.headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
        }
    
    def publish_post(self, content: str) -> PublishResult:
        """Publish article-style post to LinkedIn"""
        try:
            validate_content(content, Platform.LINKEDIN)
            
            # Prepare UGC post payload
            post_data = {
                "author": f"urn:li:person:{self.user_id}",
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {
                            "text": content
                        },
                        "shareMediaCategory": "NONE"
                    }
                },
                "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            }
            
            logger.info(f"Publishing to LinkedIn ({len(content)} chars)")
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=post_data,
                timeout=30
            )
            
            if response.status_code == 201:
                post_id = response.headers.get('X-RestLi-Id')
                logger.info(f"LinkedIn post published successfully: {post_id}")
                return PublishResult(
                    platform=Platform.LINKEDIN,
                    success=True,
                    post_id=post_id
                )
            elif response.status_code == 429:
                # 429 => the write was rejected, so retrying is safe. Let it
                # propagate to the rate-limit retry wrapper.
                raise RateLimitError("LinkedIn rate limit exceeded")
            else:
                # Truncate the response body: LinkedIn error payloads can be
                # large and may echo request context; keep logs bounded.
                body = (response.text or "")[:500]
                error_msg = f"LinkedIn API error: {response.status_code} - {body}"
                logger.error(error_msg)
                return PublishResult(
                    platform=Platform.LINKEDIN,
                    success=False,
                    error_message=error_msg
                )

        except RateLimitError:
            # Re-raise so retry_on_rate_limit can back off and retry.
            raise
        except ContentError as e:
            logger.error(f"LinkedIn content error: {str(e)}")
            return PublishResult(
                platform=Platform.LINKEDIN,
                success=False,
                error_message=str(e)
            )
        except requests.RequestException as e:
            # Network-level failure: the POST may or may not have landed, so we
            # do NOT retry (non-idempotent). Report as a failure.
            error_msg = f"LinkedIn network error: {type(e).__name__}: {str(e)}"
            logger.error(error_msg)
            return PublishResult(
                platform=Platform.LINKEDIN,
                success=False,
                error_message=error_msg
            )
        except Exception as e:
            logger.error(f"Unexpected LinkedIn error: {str(e)}")
            return PublishResult(
                platform=Platform.LINKEDIN,
                success=False,
                error_message=f"Unexpected error: {str(e)}"
            )

# =============================================================================
# X (TWITTER) CLIENT
# =============================================================================

class XClient:
    """X (Twitter) API client with proper authentication and error handling"""
    
    def __init__(self):
        """Initialize X client with credentials from environment"""
        self.api_key = get_env_var(Config.X_API_KEY)
        self.api_secret = get_env_var(Config.X_API_SECRET)
        self.access_token = get_env_var(Config.X_ACCESS_TOKEN)
        self.access_secret = get_env_var(Config.X_ACCESS_TOKEN_SECRET)
        
        # Initialize Tweepy client
        self.client = tweepy.Client(
            consumer_key=self.api_key,
            consumer_secret=self.api_secret,
            access_token=self.access_token,
            access_token_secret=self.access_secret,
            wait_on_rate_limit=True
        )
        
        # Also initialize API for v1.1 if needed
        auth = tweepy.OAuth1UserHandler(
            self.api_key,
            self.api_secret,
            self.access_token,
            self.access_secret
        )
        self.api = tweepy.API(auth)
    
    def publish_tweet(self, content: str, reply_to: Optional[str] = None) -> PublishResult:
        """Publish a single tweet to X"""
        try:
            validate_content(content, Platform.X_TWITTER)
            
            logger.info(f"Publishing to X ({len(content)} chars)")
            
            if reply_to:
                response = self.client.create_tweet(
                    text=content,
                    in_reply_to_tweet_id=reply_to
                )
            else:
                response = self.client.create_tweet(text=content)
            
            tweet_id = str(response.data['id'])
            logger.info(f"X tweet published successfully: {tweet_id}")
            
            return PublishResult(
                platform=Platform.X_TWITTER,
                success=True,
                post_id=tweet_id
            )
        
        except tweepy.TooManyRequests:
            raise RateLimitError("X rate limit exceeded")
        except tweepy.TweepyException as e:
            error_msg = f"X API error: {str(e)}"
            logger.error(error_msg)
            return PublishResult(
                platform=Platform.X_TWITTER,
                success=False,
                error_message=error_msg
            )
        except Exception as e:
            error_msg = f"Unexpected X error: {str(e)}"
            logger.error(error_msg)
            return PublishResult(
                platform=Platform.X_TWITTER,
                success=False,
                error_message=error_msg
            )
    
    def publish_thread(self, tweets: List[str]) -> List[PublishResult]:
        """Publish a thread of tweets to X.

        The full thread is validated up-front: if any tweet is invalid (empty or
        over the character limit) we post NOTHING and return a single failure,
        rather than posting a partial thread that dies half-way. Rate limits are
        retried per-tweet in place so already-posted tweets are never replayed.
        """
        if not tweets:
            return [PublishResult(
                platform=Platform.X_TWITTER,
                success=False,
                error_message="Thread is empty (no tweets extracted from template)",
            )]

        # Pre-flight: validate every tweet before posting any of them.
        problems = []
        for i, tweet in enumerate(tweets):
            try:
                validate_content(tweet, Platform.X_TWITTER)
            except ContentError as e:
                problems.append(f"tweet {i+1}/{len(tweets)}: {e}")
        if problems:
            error_msg = "Thread rejected before posting (fix template): " + "; ".join(problems)
            logger.error(error_msg)
            return [PublishResult(
                platform=Platform.X_TWITTER,
                success=False,
                error_message=error_msg,
            )]

        results = []
        last_tweet_id = None

        for i, tweet in enumerate(tweets):
            logger.info(f"Publishing tweet {i+1}/{len(tweets)} of thread")

            # Retry rate limits for THIS tweet only; never restart the thread.
            def _post_one():
                return self.publish_tweet(tweet, reply_to=last_tweet_id)

            try:
                result = retry_on_rate_limit(_post_one)
            except RateLimitError as e:
                result = PublishResult(
                    platform=Platform.X_TWITTER,
                    success=False,
                    error_message=f"Rate limited after retries: {e}",
                )

            results.append(result)

            if result.success:
                last_tweet_id = result.post_id
                # Small delay between tweets to avoid rate limiting
                if i < len(tweets) - 1:
                    time.sleep(1)
            else:
                logger.error(f"Failed to publish tweet {i+1} in thread; stopping thread")
                break

        return results

# =============================================================================
# POST DISCOVERY
# =============================================================================

class PostDiscovery:
    """Discover blog posts and their associated social media templates"""
    
    @staticmethod
    def get_published_posts() -> List[BlogPost]:
        """Get all published blog posts (draft: false)"""
        posts = []
        
        if not Config.CONTENT_DIR.exists():
            logger.warning(f"Content directory not found: {Config.CONTENT_DIR}")
            return posts
        
        for file_path in Config.CONTENT_DIR.glob('*.mdx'):
            try:
                post = BlogPost.from_mdx(file_path)
                if not post.draft:
                    posts.append(post)
            except Exception as e:
                logger.error(f"Error parsing {file_path}: {str(e)}")
        
        # Sort by date (newest first)
        posts.sort(key=lambda p: p.date, reverse=True)
        return posts
    
    @staticmethod
    def find_social_template(post: BlogPost, platform: Platform) -> Optional[SocialMediaTemplate]:
        """Find social media template for a given post and platform"""
        # Try exact match first
        if platform == Platform.LINKEDIN:
            template_name = f"linkedin-{post.slug}.md"
        else:
            template_name = f"x-thread-{post.slug}.md"
        
        template_path = Config.CONTENT_DIR / template_name
        
        if template_path.exists():
            try:
                return SocialMediaTemplate.from_file(template_path)
            except Exception as e:
                logger.error(f"Error loading template {template_path}: {str(e)}")
        
        # Try case-insensitive match
        for file_path in Config.CONTENT_DIR.glob('*.md'):
            filename = file_path.name.lower()
            if platform == Platform.LINKEDIN:
                pattern = f"linkedin-{post.slug}".lower()
            else:
                pattern = f"x-thread-{post.slug}".lower()
            
            if filename == pattern + '.md':
                try:
                    return SocialMediaTemplate.from_file(file_path)
                except Exception as e:
                    logger.error(f"Error loading template {file_path}: {str(e)}")
        
        return None

# =============================================================================
# PUBLISH TRACKING
# =============================================================================

class PublishTracker:
    """Track which posts have been published to which platforms"""
    
    def __init__(self):
        self.track_file = Config.LOG_DIR / "social_media_tracker.json"
        self.tracker = self._load_tracker()
    
    def _load_tracker(self) -> Dict:
        """Load publish tracking data"""
        if self.track_file.exists():
            try:
                with open(self.track_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading tracker: {str(e)}")
        
        return {}
    
    def _save_tracker(self) -> None:
        """Save publish tracking data"""
        try:
            with open(self.track_file, 'w', encoding='utf-8') as f:
                json.dump(self.tracker, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error saving tracker: {str(e)}")
    
    def is_published(self, post_slug: str, platform: Platform) -> bool:
        """Check if post has been published to platform"""
        return self.tracker.get(post_slug, {}).get(platform.value, False)
    
    def mark_published(self, post_slug: str, platform: Platform, post_id: str) -> None:
        """Mark post as published to platform"""
        if post_slug not in self.tracker:
            self.tracker[post_slug] = {}
        
        self.tracker[post_slug][platform.value] = {
            'published': True,
            'post_id': post_id,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        self._save_tracker()

# =============================================================================
# MAIN PUBLISHER
# =============================================================================

class SocialMediaPublisher:
    """Main social media publisher orchestrator"""
    
    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.tracker = PublishTracker()
        
        # Initialize clients
        self.linkedin_client = None
        self.x_client = None
        
        try:
            self.linkedin_client = LinkedInClient()
            logger.info("LinkedIn client initialized")
        except Exception as e:
            logger.warning(f"Could not initialize LinkedIn client: {str(e)}")
        
        try:
            self.x_client = XClient()
            logger.info("X client initialized")
        except Exception as e:
            logger.warning(f"Could not initialize X client: {str(e)}")
    
    def publish_to_linkedin(self, post: BlogPost, template: SocialMediaTemplate) -> PublishResult:
        """Publish post to LinkedIn"""
        if not self.linkedin_client:
            return PublishResult(
                platform=Platform.LINKEDIN,
                success=False,
                error_message="LinkedIn client not initialized"
            )
        
        if self.dry_run:
            logger.info(f"[DRY RUN] Would publish to LinkedIn: {post.slug}")
            return PublishResult(
                platform=Platform.LINKEDIN,
                success=True,
                post_id="dry-run-id"
            )
        
        def _publish():
            return self.linkedin_client.publish_post(template.content)

        try:
            return retry_on_rate_limit(_publish)
        except RateLimitError as e:
            return PublishResult(
                platform=Platform.LINKEDIN,
                success=False,
                error_message=f"Rate limited after retries: {e}",
            )
    
    def publish_to_x(self, post: BlogPost, template: SocialMediaTemplate) -> List[PublishResult]:
        """Publish post to X (thread format)"""
        if not self.x_client:
            return [PublishResult(
                platform=Platform.X_TWITTER,
                success=False,
                error_message="X client not initialized"
            )]
        
        tweets = template.extract_tweets()
        
        if self.dry_run:
            logger.info(f"[DRY RUN] Would publish {len(tweets)} tweets to X: {post.slug}")
            return [PublishResult(
                platform=Platform.X_TWITTER,
                success=True,
                post_id="dry-run-id"
            )]
        
        # publish_thread handles per-tweet rate-limit retries internally; we
        # must NOT wrap the whole thread in a retry (that would replay
        # already-posted tweets and create duplicates).
        return self.x_client.publish_thread(tweets)
    
    def publish_post(self, post: BlogPost) -> Dict[str, any]:
        """Publish a blog post to all configured platforms"""
        results = {
            'post_slug': post.slug,
            'post_url': post.url,
            'platforms': {}
        }
        
        # LinkedIn
        linkedin_template = PostDiscovery.find_social_template(post, Platform.LINKEDIN)
        if linkedin_template:
            if not self.tracker.is_published(post.slug, Platform.LINKEDIN):
                result = self.publish_to_linkedin(post, linkedin_template)
                results['platforms']['linkedin'] = {
                    'success': result.success,
                    'post_id': result.post_id,
                    'error': result.error_message
                }
                
                if result.success:
                    self.tracker.mark_published(post.slug, Platform.LINKEDIN, result.post_id)
            else:
                logger.info(f"Post {post.slug} already published to LinkedIn")
                results['platforms']['linkedin'] = {'success': True, 'skipped': True}
        else:
            logger.warning(f"No LinkedIn template found for {post.slug}")
            results['platforms']['linkedin'] = {'success': False, 'error': 'Template not found'}
        
        # X (Twitter)
        x_template = PostDiscovery.find_social_template(post, Platform.X_TWITTER)
        if x_template:
            if not self.tracker.is_published(post.slug, Platform.X_TWITTER):
                results_list = self.publish_to_x(post, x_template)
                success = all(r.success for r in results_list)
                post_id = results_list[0].post_id if results_list else None
                error = next((r.error_message for r in results_list if not r.success), None)
                
                results['platforms']['x'] = {
                    'success': success,
                    'post_id': post_id,
                    'error': error
                }
                
                if success:
                    self.tracker.mark_published(post.slug, Platform.X_TWITTER, post_id)
            else:
                logger.info(f"Post {post.slug} already published to X")
                results['platforms']['x'] = {'success': True, 'skipped': True}
        else:
            logger.warning(f"No X template found for {post.slug}")
            results['platforms']['x'] = {'success': False, 'error': 'Template not found'}
        
        return results
    
    def publish_all(self) -> List[Dict[str, any]]:
        """Publish all unpublished posts"""
        posts = PostDiscovery.get_published_posts()
        results = []
        
        logger.info(f"Found {len(posts)} published posts")
        
        for post in posts:
            logger.info(f"Processing post: {post.slug}")
            result = self.publish_post(post)
            results.append(result)
            
            # Small delay between posts to avoid rate limiting
            time.sleep(2)
        
        return results

# =============================================================================
# CLI INTERFACE
# =============================================================================

def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description='Social Media Publisher for ochoajorge.me'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Run without actually publishing (for testing)'
    )
    parser.add_argument(
        '--post-slug',
        type=str,
        help='Publish specific post by slug'
    )
    parser.add_argument(
        '--list-posts',
        action='store_true',
        help='List all published posts'
    )
    parser.add_argument(
        '--check-env',
        action='store_true',
        help='Check environment variables'
    )
    
    args = parser.parse_args()
    
    # Check environment variables
    if args.check_env:
        print("Environment Variables Check:")
        print("-" * 50)

        # (spec, required). Optional vars are reported but do not fail the check.
        vars_to_check = [
            (Config.LINKEDIN_CLIENT_ID, False),
            (Config.LINKEDIN_CLIENT_SECRET, False),
            (Config.LINKEDIN_ACCESS_TOKEN, True),
            (Config.LINKEDIN_USER_ID, True),
            (Config.X_API_KEY, True),
            (Config.X_API_SECRET, True),
            (Config.X_ACCESS_TOKEN, True),
            (Config.X_ACCESS_TOKEN_SECRET, True),
        ]

        all_required_set = True
        for spec, required in vars_to_check:
            canonical = spec[0] if isinstance(spec, tuple) else spec
            value = get_env_var(spec, required=False)
            if value:
                status = "✓ SET"
            elif required:
                status = "✗ MISSING (required)"
                all_required_set = False
            else:
                status = "· not set (optional)"
            print(f"{canonical}: {status}")

        print("-" * 50)
        print(f"All required variables: {'✓ YES' if all_required_set else '✗ NO'}")
        return 0 if all_required_set else 1
    
    # List posts
    if args.list_posts:
        posts = PostDiscovery.get_published_posts()
        print(f"\nPublished Posts ({len(posts)}):")
        print("-" * 80)
        
        for post in posts:
            print(f"Slug: {post.slug}")
            print(f"Title: {post.title}")
            print(f"Date: {post.date.strftime('%Y-%m-%d')}")
            print(f"URL: {post.url}")
            print(f"Tags: {', '.join(post.tags)}")
            print("-" * 80)
        
        return 0
    
    # Initialize publisher
    try:
        publisher = SocialMediaPublisher(dry_run=args.dry_run)
    except Exception as e:
        logger.error(f"Failed to initialize publisher: {str(e)}")
        return 1
    
    # Publish specific post or all
    if args.post_slug:
        posts = PostDiscovery.get_published_posts()
        post = next((p for p in posts if p.slug == args.post_slug), None)
        
        if not post:
            logger.error(f"Post not found: {args.post_slug}")
            return 1
        
        results = [publisher.publish_post(post)]
    else:
        results = publisher.publish_all()
    
    # Print summary
    print("\n" + "=" * 80)
    print("PUBLISH SUMMARY")
    print("=" * 80)
    
    for result in results:
        print(f"\nPost: {result['post_slug']}")
        print(f"URL: {result['post_url']}")
        
        for platform, platform_result in result['platforms'].items():
            if platform_result.get('skipped'):
                status = "SKIPPED (already published)"
            elif platform_result['success']:
                status = f"SUCCESS (ID: {platform_result['post_id']})"
            else:
                status = f"FAILED: {platform_result.get('error', 'Unknown error')}"
            
            print(f"  {platform.upper()}: {status}")
    
    print("\n" + "=" * 80)
    
    # Check for any failures
    has_failures = any(
        not platform_result.get('success', True)
        for result in results
        for platform_result in result['platforms'].values()
        if not platform_result.get('skipped', False)
    )
    
    return 1 if has_failures else 0

if __name__ == '__main__':
    sys.exit(main())