# ua.me

my personal site — what i do, what i think and what i build.

built with next.js, tailwind and mdx.

## running it

```bash
npm install
npm run dev
```

then open http://localhost:3000.

```bash
npm run build   # production build
npm start       # serve the build
npm run lint
```

## writing

content lives in `src/content` as mdx, one file per entry, in `blog`,
`work` and `projects`. drop a file in and it shows up — pages are
generated at build time.

posts support gfm (tables, task lists, strikethrough) and syntax
highlighted code blocks with a copy button. headings get ids
automatically, so they can be linked to directly.

**blog** — `src/content/blog/<name>.mdx`

```yaml
---
id: "FT4C3Y"          # optional 6-char id, used as the url if set
title: "Factory constructors in Dart"
date: "2026-03-06"
description: "..."     # optional
tags: ["Dart"]         # optional
image: "/cover.png"    # optional
---
```

**work** — `src/content/work/<slug>.mdx`

```yaml
---
company: "Digital Fortress Pvt. Ltd."
role: "Flutter Intern"
startDate: "2024-09-01"
endDate: "2024-12-31"  # optional, omit for a current role
location: "..."        # optional
description: "..."     # optional
skills: ["Flutter"]    # optional
---
```

**projects** — `src/content/projects/<slug>.mdx`

```yaml
---
title: "VIT-AP Student App"
description: "..."
startDate: "2024-06-01"
endDate: "2025-03-15"  # optional
technologies: ["Flutter"]
github: "https://..."  # optional
---
```

titles are lowercased when rendered, so write them however reads best.

## layout

```
src/
  app/(routes)/     pages
  components/       ui
  content/          the mdx
  lib/server/       reading and rendering the mdx
```
