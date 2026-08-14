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

posts can also use react components — including interactive ones —
without importing them:

```mdx
<Callout label="a note">
markdown **works** in here too.
</Callout>
```

to add one, write the component and register it in `mdxComponents` in
`src/lib/server/mdx-options.ts`. mdx resolves any capitalised tag
against that map.

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

## images

everything lives under `public/images`, one folder per kind:

```
public/images/
  blog/<slug>/      images used by a post
  work/<slug>/
  projects/<slug>/
  pov/              the photographs
```

reference them by path — in frontmatter for a cover, or inline in the
body. the quoted part becomes a caption.

```markdown
![alt text](/images/blog/my-post/diagram.png "an optional caption")
```

dimensions are read off disk at build time, so images reserve their
space instead of shifting the page as they load. nothing needs to be
declared. wide images spill past the text column on large screens.

## pov

drop photos into `public/images/pov` and they appear, newest first,
sorted by the exif capture date and falling back to the file date.
there is nothing else to update.

captions are optional. to add one, create `src/content/pov-captions.json`:

```json
{ "DSC_0142.jpg": "somewhere off the coast" }
```

before committing new photos, run `npm run photos`. it resizes the long
edge to 2000px and re-encodes at quality 85, in place. do it before the
first commit — git keeps a full size original forever once it has been
committed once. re-running is safe; anything already small is skipped.

`npm run images` prints what the images add up to and flags anything
over a megabyte. it also runs before every build.

## layout

```
src/
  app/(routes)/     pages
  components/       ui
  content/          the mdx
  lib/server/       reading and rendering the mdx
```
