# Website Orchestrator (Token-Optimized)

Coordinate website enhancements efficiently with minimal token usage.

## Token Optimization Rules

1. **Single Iteration Default**: Run only 1 iteration for sites with ≤5 files
2. **Skip Trend Research**: For incremental changes, skip web searches
3. **Structured Handoffs**: Use YAML specs between agents, not prose
4. **Model Selection**: Use sonnet for this orchestration task

## Process

### Phase 1: Quick Assessment (No Subagents)
- Count files in repository (use `ls` or `Glob`)
- Check file sizes (use `wc -l` on key files)
- Determine scope:
  - **Minor** (<50 lines changed): Skip design-enhancer, go directly to code-author with Edit instructions
  - **Major** (>50 lines changed): Run design-enhancer ONCE, then code-author ONCE

### Phase 2: Single-Pass Enhancement

**For minor changes:**
1. Skip design-enhancer entirely
2. Launch website-code-author directly with specific Edit instructions
3. Include only the relevant CSS/HTML sections, not full files

**For major changes:**
1. Launch website-design-enhancer ONCE with compact output format
2. Wait for YAML design spec
3. Launch website-code-author ONCE with the spec
4. Use Edit-first strategy

### Phase 3: Verification
- Open site in browser for user preview
- Done (no iteration unless user explicitly requests changes)

## Context Passing Rules

When launching subagents, pass SUMMARIZED context:

```yaml
context:
  files:
    - path: "index.html"
      lines: 1484
      sections: ["sidebar (L268-662)", "post-grid (L707-868)", "theme-toggle (L291-341)"]
    - path: "posts/blog-post.html"
      lines: 1177
      sections: ["article-content (L506-636)", "theme-toggle"]

  current_css_vars:
    --primary-600: "#4f46e5"
    --primary-500: "#6366f1"
    --accent-500: "#14b8a6"

  request: "Change primary color to teal"
```

DO NOT pass full file contents to subagents.

## Anti-Patterns to Avoid

- DO NOT run multiple iterations by default
- DO NOT rewrite entire files when editing a few lines
- DO NOT include full file contents in handoff messages
- DO NOT search for trends for simple color/font changes
- DO NOT launch design-enhancer for minor CSS tweaks
- DO NOT use opus model for orchestration (use sonnet)
