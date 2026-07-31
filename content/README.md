# Authoring content

All courses live under `content/courses/`. Nothing else needs to change to add a
course — the site reads this folder at build/request time.

## Folder layout

```
content/courses/
  my-course/                # folder name = URL slug (/courses/my-course)
    course.json             # course metadata (required)
    chapters/
      01-intro.mdx          # NN- prefix sets the order; stripped from the URL
      02-next-topic.mdx     # -> /courses/my-course/next-topic
```

## course.json

```json
{
  "title": "My Course",
  "description": "One or two sentences shown on cards and the landing page.",
  "category": "Offensive Security",
  "difficulty": "beginner",          // beginner | intermediate | advanced
  "icon": "globe",                    // see icon names in lib/icons.tsx
  "color": "emerald",                 // emerald | cyan | rose | amber | violet | sky
  "authors": ["Malman"],
  "tags": ["web", "owasp"],
  "featured": true,                   // shows on the homepage
  "order": 1                          // sort order across courses
}
```

## Chapter frontmatter

```yaml
---
title: "Chapter title"
description: "Shown as the subtitle and on the course page."
order: 1              # optional; falls back to the NN- filename prefix
duration: 25          # minutes, used for time estimates
difficulty: beginner
tags: [recon, osint]
video: dQw4w9WgXcQ    # optional YouTube id shown at the top of the chapter
---
```

Start chapter bodies at `##` — the `title` is rendered as the page `<h1>` for you.
`##` and `###` headings automatically populate the "On this page" table of contents.

## Components available in MDX

No imports needed — these are injected globally.

| Component | Use |
| --- | --- |
| ` ```mermaid ` fenced block | Renders a live Mermaid diagram |
| `<AttackPath steps={[...]} />` | Interactive React Flow attack path / kill-chain |
| `<YouTube id="..." timestamps={[...]} />` | Embed with a clickable chapters panel |
| `<PayloadBox label="..." language="...">` | Copy-ready payload box (avoid `<` and `{` in the body — use a code fence for those) |
| `<Alert variant="info\|tip\|warning\|danger\|note" title="...">` | Callout |
| `<DefenseNote title="...">` | Green defensive-countermeasure callout |
| `<LabStep n={1} title="...">` | Numbered lab step |
| `<CVEBadge id="CVE-2021-27101" severity="critical" score={9.8} />` | Inline CVE chip linking to NVD |
| Fenced code blocks | Syntax-highlighted (Shiki) with a copy button |

### AttackPath step shape

```jsx
<AttackPath
  steps={[
    { id: "find", phase: "Recon", type: "recon", label: "Find param", detail: "optional" }
  ]}
  edges={[["find", "next", "optional label"]]}  // omit for a linear chain
/>
```

`type` sets the node color: `recon | entry | exploit | privesc | impact | default`.
