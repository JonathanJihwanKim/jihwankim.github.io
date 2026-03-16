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
├── css/
│   ├── base.css            Design tokens, reset, typography, animations, utilities
│   ├── layout.css          Top nav, content areas, footer, responsive breakpoints
│   ├── components.css      Post cards, tags, badges, buttons, search, pagination
│   └── article.css         Article prose, TOC, reading progress, lightbox, code blocks
├── js/
│   ├── nav.js              Shared top navigation + footer injection
│   ├── theme.js            Mobile menu, search overlay, keyboard shortcuts
│   ├── blog-data.js        Posts array, rendering, search, pagination, tag filtering
│   ├── lightbox.js         Image zoom overlay (blog posts only)
│   ├── reading-progress.js Scroll-based reading progress bar (blog posts only)
│   └── toc.js              Table of contents generation + scroll spy (blog posts only)
├── posts/                  6 blog post HTML files
├── images/                 Profile images, badges, icons
│   └── blog/<post-slug>/   Per-post images (featured images, screenshots)
├── CNAME                   Custom domain: powerbimvp.com
└── robots.txt
```

### Shared CSS/JS Architecture

All CSS and JS is in shared files. HTML pages link to them:
- **Homepage** (`index.html`): `base.css`, `layout.css`, `components.css` + `nav.js`, `theme.js`, `blog-data.js`
- **Blog posts** (`posts/*.html`): `base.css`, `layout.css`, `components.css`, `article.css` + `nav.js`, `theme.js`, `lightbox.js`, `reading-progress.js`, `toc.js` + Prism.js CDN
- **About/Tools pages**: `base.css`, `layout.css`, `components.css`, `article.css` + `nav.js`, `theme.js`

CSS/JS changes only need to be made in one place — the shared files.

### Design System — "Editorial Blueprint" Theme

CSS custom properties defined in `css/base.css`:
- **Accent**: Signal orange (`#E8590C` to `#fdba74`)
- **Neutrals**: Warm stone scale (`#1c1917` to `#fafaf9`)
- **Background**: Warm off-white (`#faf9f7`)
- **Links**: Slate blue (`#2563eb`)
- **Display font**: DM Serif Display (Google Fonts, loaded via CSS @import in base.css)
- **Body font**: IBM Plex Sans (Google Fonts)
- **Code font**: JetBrains Mono (Google Fonts)
- **Icons**: Google Material Symbols Outlined

### Dynamic Components

- **nav.js**: Injects the top navigation header and footer into `#site-header` and `#site-footer` on all pages. Detects `/posts/` path to set correct relative paths.
- **blog-data.js**: Contains the posts array with metadata. Renders post cards, handles tag filtering (`?tag=PBIR`), search (`?search=query`), and pagination on the homepage.
- **toc.js**: Auto-generates table of contents from h2 elements in `.article-content`. Desktop sidebar + mobile dropdown.

### Content-Security-Policy

- **Homepage, About, Tools**: `script-src 'self' 'unsafe-inline'`; no external CDN
- **Blog posts**: Additionally allow `https://cdnjs.cloudflare.com` for Prism.js syntax highlighting

### External Dependencies (CDN only)

- Google Fonts: DM Serif Display, IBM Plex Sans, JetBrains Mono, Material Symbols Outlined (loaded via @import in base.css)
- Prism.js 1.29.0 with `prism-tomorrow` theme for syntax highlighting (blog posts only) — includes JSON, Bash, and SQL language components

## Deployment

Push to `main` branch deploys automatically via GitHub Pages. No build step required.

```
git add <files> && git commit -m "message" && git push origin main
```

## Development

Open `index.html` directly in a browser or use any local HTTP server:
```
npx serve .
# or
python -m http.server 8000
```

## Adding a New Blog Post

1. Create `posts/<slug>.html` — copy an existing post as template
2. Add post images to `images/blog/<slug>/`
3. Add the post entry to the `posts` array in `js/blog-data.js` with: `id`, `title`, `preview`, `date`, `sortDate`, `tags`, `url`, `featuredImage`, `readingTime`, `difficulty`
4. Update prev/next navigation links in the new post and the previously-newest post
5. Set OG/Twitter meta tags in the new post's `<head>`
6. Update the Content-Security-Policy meta tag if loading new external resources

## Working with This Codebase

- CSS changes go in the shared `css/` files — no need to edit individual HTML pages
- JS changes go in the shared `js/` files
- For blog post content changes, edit the specific `posts/*.html` file
- Windows environment: use `rm` not `del` in Bash (git bash shell)
