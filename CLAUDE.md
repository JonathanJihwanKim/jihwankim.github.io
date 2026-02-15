# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog for Jihwan Kim (powerbimvp.com), a Microsoft MVP and Power BI & Fabric architect. Hosted on GitHub Pages with a custom domain via CNAME.

## Architecture

**Static HTML site with no build system, bundler, or static site generator.** All files are served as-is by GitHub Pages.

### File Layout

- `index.html` (~1500 lines) - Homepage with embedded CSS, HTML, and JS in a single file
- `posts/*.html` (5 files, ~1150-1250 lines each) - Blog posts, each fully self-contained
- `images/` - Profile images, badges, icons (SVG/PNG)
- `images/blog/<post-slug>/` - Per-post images (featured images, screenshots)
- `.claude/agents/website-orchestrator.md` - Agent config for coordinated site redesigns

### Critical: No Shared CSS/JS

Every HTML file (index.html + each blog post) contains its **own complete copy** of all CSS and JavaScript. There are no shared stylesheets or script files. When changing design tokens, layout rules, or shared styles, the same change must be applied to **all 6 files**:
1. `index.html`
2. `posts/building-portable-time-intelligence-library-dax-udf.html`
3. `posts/building-hybrid-semantic-models-tabular-editor.html`
4. `posts/pbir-filter-layer-order.html`
5. `posts/pbir-edit-interactions.html`
6. `posts/pbir-visual-json-field-parameters.html`

### Page Structure Differences

**index.html**: Sidebar (name, title, bio, links, search, photos) + main content with hero section (credential badges) + 2-column blog post grid. Blog cards are rendered by JS from a `posts` array (~line 1457) with fields: `id`, `title`, `preview`, `date`, `tags`, `url`, `featuredImage`. Search and pagination are JS-driven.

**Blog posts**: Same sidebar structure but with badge-icons in the sidebar. Main content has article header, metadata, prose, code blocks (Prism.js with `prism-tomorrow` theme), and inline images with lightbox overlay. Each post includes full OG/Twitter Card meta tags for social sharing.

### Content-Security-Policy

Both index.html and blog posts have a CSP meta tag. **They differ**: blog posts allow `cdnjs.cloudflare.com` in `script-src` and `style-src` for Prism.js; index.html does not. When adding new external resources, update the CSP in the relevant files.

### Design System (Van Gogh-inspired)

CSS custom properties defined in `:root` of every file:
- **Primary**: Starry Night blues (`#1a3a5c` to `#d0e4f0`)
- **Accent**: Sunflower gold (`#d4a017` to `#f0d060`)
- **Secondary**: Cafe Terrace orange (`#c4622d`)
- **Tertiary**: Olive Trees green (`#3d6b3d`)
- **Background**: Warm canvas off-white (`#f7f5f0`)
- **Font**: Inter (Google Fonts)
- **Icons**: Google Material Symbols Outlined

### External Dependencies (CDN only)

- Google Fonts (Inter, Material Symbols Outlined)
- Prism.js 1.29.0 with `prism-tomorrow` theme for syntax highlighting (blog posts only) - includes JSON and Bash language components

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

1. Create `posts/<slug>.html` - copy an existing post as template (includes all CSS, JS, lightbox, Prism.js)
2. Add post images to `images/blog/<slug>/`
3. Add the post entry to the `posts` array in `index.html`'s `<script>` section (~line 1330) with `id`, `title`, `preview`, `date`, `tags`, `url`, and `featuredImage`
4. Set OG/Twitter meta tags in the new post's `<head>` (og:title, og:description, og:image, twitter:card, etc.)
5. Update the Content-Security-Policy meta tag if loading new external resources

## Working with This Codebase

- For bulk CSS changes across all 6 files, use parallel Task agents (one per blog post + one for index.html)
- For large rewrites of index.html (40%+ of content), use the Write tool rather than many Edit calls
- Windows environment: use `rm` not `del` in Bash (git bash shell)
- The website-orchestrator agent (`.claude/agents/website-orchestrator.md`) handles coordinated design reviews and multi-file redesigns using a team-based workflow
