# AGENTS.md — Rules for ALL agents working in this repository

These rules apply to every agent (Claude Code, Hermes, or any other automation)
and to every kind of change, **including publishing blog posts**. They override
any older instruction found elsewhere in this repo.

## Golden rules (non-negotiable)

1. **NEVER commit or push directly to `main`.** `main` is production: Vercel
   deploys only from `main`. It moves exclusively via a reviewed PR from
   `develop`.
2. **NEVER commit or push directly to `develop`.** `develop` is the integration
   branch. It moves exclusively via PRs from feature branches.
3. **All work follows the same flow**, posts included:

   ```bash
   git fetch origin
   git switch -c <type>/<topic> origin/develop   # branch off develop, always
   # ... do the work, commit ...
   git push -u origin HEAD
   gh pr create --base develop --fill            # PR base is develop, never main
   ```

4. **Deploy = PR from `develop` to `main`**, opened only when the user asks for
   a release. Merging that PR is what publishes to production.
5. If `main` ever ends up ahead of `develop` (e.g. a hotfix), sync back
   immediately: `git push origin origin/main:develop` (fast-forward only).
6. Never force-push shared branches. Never rewrite history on `main`/`develop`.

## Branch naming and commits

- Branches: `<type>/<topic>` — `feat/`, `fix/`, `content/`, `docs/`, `chore/`.
  Posts use `content/<post-slug>`.
- Commits: Conventional Commits in the repo's style — `type(scope): subject`
  (e.g. `content(posts): add hexagonal-arch-python post`).

## Publishing a post (summary)

Full workflow: `.agent/workflows/new_post.md`. The short version:

1. `npm run post:new -- "Post Title" es` — scaffold in `content/posts/{lang}/`.
2. Keep `draft: true` while writing.
3. Frontmatter must include: `title`, `description` (150-160 chars), `date`,
   `tags`, and `pillar` — one of the canonical pillar ids:
   `construir-con-ia`, `agentes-en-produccion`, `arquitectura`, `seguridad`.
4. Validate before opening the PR: `npm run seo:audit && npm run build`.
5. Set `draft: false`, then push the `content/<slug>` branch and open the PR
   with base `develop`. **Do not push to `main` — the PR is the publish step.**

## Where the rest of the docs live

- `CLAUDE.md` — architecture, commands, file map, quality rules.
- `.agent/workflows/` — step-by-step workflows (new post, deploy, SEO audit).

If any document in this repo contradicts the golden rules above, the golden
rules win. Report the contradiction instead of following it.
