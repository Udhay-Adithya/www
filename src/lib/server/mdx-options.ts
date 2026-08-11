import { transformerCopyButton } from '@rehype-pretty/transformers';

// Shared across blog, work and project content so code blocks render identically.
// keepBackground is off so the theme's own surface colour doesn't get inlined onto
// the <pre>; the block picks up the site palette from .blog-content instead, and
// only the token colours come from the theme.
export const prettyCodeOptions = {
    theme: 'github-dark',
    keepBackground: false,
    bypassInlineCode: true,
    defaultLang: 'plaintext',
    transformers: [
        transformerCopyButton({
            visibility: 'hover',
            feedbackDuration: 3_000,
        }),
    ],
};
