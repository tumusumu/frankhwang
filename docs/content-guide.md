# Content Guide

How to add blog posts and projects to frankhwang.com.

## Adding a Blog Post

Create an MDX file in both locale directories:

- English: `content/blog/en/<slug>.mdx`
- Chinese: `content/blog/zh/<slug>.mdx`

### Required Frontmatter

```yaml
---
title: "Your Post Title"
slug: your-post-slug
date: 2025-01-15
description: "A brief description of the post."
lang: en          # or zh
---
```

### Optional Fields

| Field       | Type    | Default | Description                    |
|-------------|---------|---------|--------------------------------|
| `tags`      | array   | `[]`    | Tags for categorization        |
| `published` | boolean | `true`  | Set `false` to hide the post   |
| `tweetable` | boolean | `false` | Enable tweet sharing           |

## Adding a Project

Create an MDX file in both locale directories:

- English: `content/projects/en/<slug>.mdx`
- Chinese: `content/projects/zh/<slug>.mdx`

### Required Frontmatter

```yaml
---
title: "Project Name"
slug: project-name
description: "What the project does."
lang: en          # or zh
---
```

### Optional Fields

| Field      | Type    | Default | Description                           |
|------------|---------|---------|---------------------------------------|
| `url`      | string  | —       | Live project URL                      |
| `repo`     | string  | —       | Source code URL                        |
| `image`    | string  | —       | Cover image path                      |
| `featured` | boolean | `false` | Set `true` to show on the homepage    |

## Publishing Workflow

```
1. Write MDX file(s) in content/blog/ or content/projects/
2. pnpm dev        # Preview locally at localhost:3000
3. git add + commit + push
4. Vercel auto-deploys from main branch
```

## Notes

- Slugs must match across locales (same slug for en and zh versions)
- Velite compiles MDX at build time — `pnpm dev` runs `velite && next dev`
- Images go in `content/` and Velite copies them to `public/static/`
