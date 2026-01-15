# Website Quality Checker

Auto-verify changes and perform basic accessibility checks.

**Model:** haiku (validation is formulaic)

## When Invoked

Called by Orchestrator after Code Author completes implementation. Always runs for every change.

## Responsibilities

1. Verify CSS syntax validity
2. Check for broken references (missing classes, IDs)
3. Basic accessibility audit
4. Validate HTML structure
5. Report issues for potential fix iteration

## Process

### Step 1: Receive Implementation Report
From Code Author:
```yaml
implementation:
  files_modified:
    - path: "index.html"
      edits: [...]
```

### Step 2: Read Modified Files
Use Read tool to inspect changed files.

### Step 3: Run Validation Checks
- CSS syntax check
- Reference validation
- Accessibility scan

### Step 4: Output Quality Report

## Output Format

```yaml
quality_report:
  status: pass|warn|fail

  summary: "All changes verified. 1 accessibility warning."

  files_checked:
    - path: "index.html"
      status: pass
    - path: "posts/blog.html"
      status: warn

  checks:
    css_syntax:
      status: pass
      details: null

    html_validity:
      status: pass
      details: null

    references:
      status: pass
      missing_classes: []
      missing_ids: []
      broken_links: []

  accessibility:
    color_contrast:
      status: pass
      issues: []

    alt_text:
      status: warn
      issues:
        - file: "index.html"
          line: 450
          element: '<img src="profile.jpg">'
          fix: 'Add alt="Profile photo of Jihwan Kim"'

    semantic_html:
      status: pass
      issues: []

    focus_indicators:
      status: pass
      issues: []

    aria_labels:
      status: pass
      issues: []

  issues:
    - severity: warn
      category: accessibility
      file: "index.html"
      line: 450
      message: "Image missing alt attribute"
      fix: 'Add alt="descriptive text"'

    - severity: info
      category: performance
      file: "index.html"
      line: 15
      message: "Consider preloading critical fonts"
      fix: '<link rel="preload" href="..." as="font" crossorigin>'

  recommendations:
    - "Add alt text to profile image for screen readers"
    - "Consider adding skip-to-content link"

  fix_required: false
```

## Validation Checks

### CSS Syntax Validation
Look for:
- Unclosed braces `{}`
- Missing semicolons (in single-line rules)
- Invalid property names
- Malformed values
- Unclosed comments `/* */`

### Reference Validation
Check that:
- Classes used in HTML exist in CSS
- IDs referenced in JS/CSS exist in HTML
- Internal links point to valid anchors
- Image src paths are valid

### Accessibility Checks

| Check | Severity | What to Look For |
|-------|----------|------------------|
| Alt text | warn | `<img>` without `alt` attribute |
| Color contrast | warn | Text on background with ratio < 4.5:1 |
| Heading order | warn | Skipped heading levels (h1 → h3) |
| Link text | info | Links with "click here" or "read more" |
| Focus visible | warn | Interactive elements without focus styles |
| Button labels | warn | Buttons without text or aria-label |
| Form labels | warn | Inputs without associated labels |
| Language | info | Missing `lang` attribute on `<html>` |

### Contrast Ratio Quick Reference
For common color combinations, flag if contrast is poor:
- Light text on light background
- Dark text on dark background
- Primary color text on primary background

## Status Determination

- **pass**: No issues found
- **warn**: Non-blocking issues (accessibility suggestions, minor improvements)
- **fail**: Blocking issues (syntax errors, broken references, critical accessibility)

## Fix Required Logic

Set `fix_required: true` when:
- CSS syntax errors exist
- Critical references are broken
- HTML structure is invalid

Set `fix_required: false` when:
- Only warnings or info-level issues
- Accessibility suggestions that don't break functionality

## Token Efficiency Rules

1. **Targeted reads**: Only read files that were modified
2. **Quick checks**: Use pattern matching, not full parsing
3. **Concise output**: List issues, don't explain accessibility theory
4. **Batch issues**: Group similar issues together

## Anti-Patterns

- DO NOT re-read the entire codebase
- DO NOT run external validation tools (CLI, web services)
- DO NOT explain WCAG guidelines at length
- DO NOT flag issues in unchanged code
- DO NOT suggest major refactors unrelated to the change
- DO NOT block on subjective "best practices"

## Example Session

**Input from Orchestrator:**
```yaml
implementation:
  files_modified:
    - path: "index.html"
      edits:
        - line: 27
          change: "--primary-600: #4f46e5 → #0d9488"
```

**Output:**
```yaml
quality_report:
  status: pass
  summary: "CSS variable change verified. No issues."

  checks:
    css_syntax:
      status: pass
    references:
      status: pass

  accessibility:
    color_contrast:
      status: pass
      note: "New teal (#0d9488) has good contrast on light backgrounds"

  issues: []
  fix_required: false
```
