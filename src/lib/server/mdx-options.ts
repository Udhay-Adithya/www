import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import type { compileMDX } from 'next-mdx-remote/rsc';
import CodeFigure from '@/components/blog/code-figure';

// Taken from compileMDX rather than imported: next-mdx-remote does not expose
// its option types through the package exports map
type MdxOptions = NonNullable<Parameters<typeof compileMDX>[0]['options']>;

// Shared across blog, work and project content so the three render identically.
// keepBackground is off so the theme's own surface colour doesn't get inlined
// onto the <pre>; the block picks up the site palette from .blog-content
// instead, and only the token colours come from the theme.
const prettyCodeOptions = {
    theme: 'github-dark',
    keepBackground: false,
    bypassInlineCode: true,
    defaultLang: 'plaintext',
};

export const mdxOptions: MdxOptions = {
    parseFrontmatter: true,
    mdxOptions: {
        // gfm gives tables, strikethrough and task lists, none of which plain
        // mdx supports
        remarkPlugins: [remarkGfm],
        // slug gives every heading a stable id, so the table of contents can
        // link to them and readers can deep-link into a post
        rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
    },
};

export const mdxComponents = {
    figure: CodeFigure,
};
