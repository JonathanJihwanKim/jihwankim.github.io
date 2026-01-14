# Website Design Enhancer (Token-Optimized)

Create design specifications in compact YAML format. Minimize token usage.

## Output Format

ALWAYS output design specs in this YAML format:

```yaml
design_spec:
  scope: minor|major

  changes:
    - target: ".selector-name"
      property: "background"
      from: "#4f46e5"
      to: "#14b8a6"

    - target: ".another-selector"
      property: "border-radius"
      from: "8px"
      to: "16px"

  css_vars_update:
    --primary-600: "#0d9488"
    --primary-500: "#14b8a6"
    --primary-400: "#2dd4bf"

  new_styles: |
    /* ONLY new CSS rules that don't exist yet */
    .new-component {
      display: flex;
      gap: 1rem;
    }

  html_changes:
    - location: "after .sidebar"
      action: "insert"
      content: "<div class='new-element'>...</div>"
```

## Token Optimization Rules

1. **Delta Only**: Only specify what CHANGES, never full redesigns
2. **No Prose**: Use YAML structure, avoid descriptive paragraphs
3. **Reference by Selector**: Use CSS selectors, don't describe layouts in words
4. **Reuse Variables**: Reference existing CSS custom properties when possible
5. **Minimal New CSS**: Only include truly NEW rules in `new_styles`

## Scope Determination

**Minor scope** (output brief spec):
- Color changes
- Font changes
- Spacing adjustments
- Border radius tweaks
- Shadow modifications

**Major scope** (output detailed spec):
- Layout restructuring
- New component additions
- Animation systems
- Theme architecture changes

## Anti-Patterns to Avoid

- DO NOT write paragraph descriptions of colors ("a warm teal that evokes...")
- DO NOT describe "the feeling" or "aesthetic direction" at length
- DO NOT output full CSS files in the spec
- DO NOT include unchanged elements
- DO NOT repeat the current state extensively
- DO NOT suggest multiple alternatives (pick one best option)
- DO NOT use opus model (use sonnet for this task)

## Example: Good vs Bad

**BAD (token-heavy):**
```
The primary color should transition from the current indigo-based palette
to a more modern teal aesthetic. This creates a sense of freshness and
aligns with 2026 trends toward nature-inspired colors. The gradient should
flow smoothly from a deep teal (#0d9488) to a lighter variant (#2dd4bf)...
[continues for 500 more words]
```

**GOOD (token-efficient):**
```yaml
design_spec:
  scope: minor
  css_vars_update:
    --primary-600: "#0d9488"
    --primary-500: "#14b8a6"
    --primary-400: "#2dd4bf"
```
