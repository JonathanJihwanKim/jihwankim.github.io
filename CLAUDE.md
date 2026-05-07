# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Technical blog for Jihwan Kim (powerbimvp.com), a Microsoft MVP and Power BI & Fabric architect. Hosted on GitHub Pages with a custom domain via CNAME. Blog-first design targeting expert Power BI developers and Microsoft Fabric engineers.

## Architecture

**Static HTML site with no build system, bundler, or static site generator.** All files are served as-is by GitHub Pages.

### File Layout

```
jihwankim.github.io/
├── index.html              Homepage — blog listing with tag filters
├── about.html              Author bio, credentials, photos
├── tools.html              Open source tools showcase
├── sponsors.html           Partner/sponsor page
├── css/
│   ├── base.css            Design tokens, reset, typography, animations, utilities
│   ├── layout.css          Top nav, content areas, footer, responsive breakpoints
│   ├── components.css      Post cards, tags, badges, buttons, search, pagination
│   └── article.css         Article prose, TOC, reading progress, lightbox, code blocks
├── js/
│   ├── nav.js              Shared top navigation + footer injection
│   ├── theme.js            Mobile menu, search overlay, keyboard shortcuts
│   ├── blog-data.js        Posts array, rendering, search, pagination, tag filtering
│   ├── counter.js          Visitor/reader counts via Cloudflare Workers API
│   ├── lightbox.js         Image zoom overlay (blog posts only)
│   ├── reading-progress.js Scroll-based reading progress bar (blog posts only)
│   └── toc.js              Table of contents generation + scroll spy (blog posts only)
├── posts/                  Blog post HTML files
├── images/                 Profile images, badges, icons
│   └── blog/<post-slug>/   Per-post images (featured images, screenshots)
├── CNAME                   Custom domain: powerbimvp.com
├── .gitignore              Ignores tmpclaude-*-cwd harness scratch files
└── robots.txt
```

### Shared CSS/JS Architecture

All CSS and JS is in shared files. HTML pages link to them:
- **Homepage** (`index.html`): `base.css`, `layout.css`, `components.css` + `nav.js`, `theme.js`, `blog-data.js`, `counter.js`
- **Blog posts** (`posts/*.html`): `base.css`, `layout.css`, `components.css`, `article.css` + `nav.js`, `theme.js`, `lightbox.js`, `reading-progress.js`, `toc.js`, `counter.js` + Prism.js CDN
- **About/Tools pages**: `base.css`, `layout.css`, `components.css`, `article.css` + `nav.js`, `theme.js`

CSS/JS changes only need to be made in one place — the shared files.

### Design System — "Microsoft Technical" Theme

CSS custom properties defined in `css/base.css`:
- **Primary accent**: MVP red (`--mvp-500: #E4222E`); also aliased as `--accent-500`
- **Product accents**: Power BI yellow (`--powerbi-500: #F2C811`), Fabric teal (`--fabric-500: #0ea5be`), Microsoft blue (`--msblue-700: #0078d4`)
- **Neutrals**: Fluent grey scale (`--grey-950: #11131a` to `--grey-50: #f7f8fa`); also aliased as `--stone-*`
- **Background**: Clean white (`--bg: #ffffff`)
- **Links**: Microsoft blue (`--msblue-700: #0078d4`)
- **Brand wordmarks**: `--brand-powerbi`, `--brand-microsoft`, `--brand-fabric` CSS vars
- **Display/Body font**: Segoe UI (system font, no external fetch)
- **Code font**: JetBrains Mono (loaded via @import in `css/base.css`)
- **Icons**: Google Material Symbols Outlined (loaded via @import in `css/base.css`)

### Dynamic Components

- **nav.js**: Injects the top navigation header and footer into `#site-header` and `#site-footer` on all pages. Detects `/posts/` path to set correct relative paths (`../` prefix). Also injects sidebar sponsor widgets on blog posts and a floating sponsor pill on the homepage. Exposes `window.sponsors` globally.
- **blog-data.js**: Contains the `posts` array with metadata. Renders post cards, handles tag filtering (`?tag=PBIR`), search (`?search=query`), and pagination on the homepage. Exposes `window.blogPosts` for `theme.js` search. Injects a partner card after the 3rd post on page 1.
- **counter.js**: Records page visits and fetches counts from `https://powerbimvp-counter.jonathan-jihwankim.workers.dev`. Uses `sessionStorage` to prevent double-counting. Homepage fetches total site visits + per-post reader counts; blog posts fetch that post's reader count.
- **toc.js**: Auto-generates table of contents from h2 elements in `.article-content`. Desktop sidebar + mobile dropdown with scroll-spy highlighting.

### Content-Security-Policy

- **Homepage, About, Tools**: `script-src 'self' 'unsafe-inline'`; no external CDN scripts
- **Blog posts**: Additionally allow `https://cdnjs.cloudflare.com` for Prism.js syntax highlighting

When adding any new external resource (script, stylesheet, font), update the CSP meta tag in the affected HTML files.

### External Dependencies (CDN only)

- Google Fonts: JetBrains Mono, Material Symbols Outlined (loaded via @import in `css/base.css`)
- Prism.js 1.29.0 with `prism-tomorrow` theme (blog posts only) — includes JSON, Bash, and SQL language components, loaded from `https://cdnjs.cloudflare.com`

## Deployment

Push to `main` branch deploys automatically via GitHub Pages. No build step required.

```bash
git add <files> && git commit -m "message" && git push origin main
```

## Development

Run a local HTTP server (direct file:// open won't work due to CSP and relative paths):
```bash
npx http-server . -p 8080 -c-1
# or
python -m http.server 8000
```

## Adding a New Blog Post

1. Create `posts/<slug>.html` — copy an existing post as template
2. Add post images to `images/blog/<slug>/`
3. Add the post entry to the `posts` array at the top of `js/blog-data.js` (newest first) with: `id`, `title`, `preview`, `date`, `sortDate`, `tags`, `url`, `featuredImage`, `readingTime`, `difficulty`
4. Update prev/next navigation links in the new post and the previously-newest post
5. Set OG/Twitter meta tags in the new post's `<head>`
6. Update the Content-Security-Policy meta tag if loading new external resources

### Citation Style

Every inline citation in a blog post should name the specific section, heading, or bullet of the source — not just link the article as a whole. This lets readers jump to the exact passage that backs the claim.

## Working with This Codebase

- CSS changes go in the shared `css/` files — no page-specific stylesheets exist
- JS changes go in the shared `js/` files
- For blog post content changes, edit the specific `posts/*.html` file
- All JS files use the IIFE pattern; they don't import each other (nav.js exposes globals via `window.*`)
- Windows environment: use `rm` not `del` in Bash (git bash shell)
- The repo lives at `d:/github.io/jihwankim.github.io/` but Claude is often launched from the parent `d:/github.io/` — `cd` into the project dir or use absolute paths
