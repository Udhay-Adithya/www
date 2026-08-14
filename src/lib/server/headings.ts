import GithubSlugger from 'github-slugger';

export type Heading = {
    id: string;
    text: string;
    level: number;
};

const HEADING = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const FENCE = /^\s*(```|~~~)/;

/**
 * Pulls the heading outline out of raw mdx.
 *
 * Slugs are generated with the same slugger rehype-slug uses, so the ids here
 * match the ones on the rendered headings and the table of contents can be
 * built on the server rather than scraped from the dom after paint.
 */
export function extractHeadings(raw: string): Heading[] {
    const slugger = new GithubSlugger();
    const headings: Heading[] = [];
    let inFence = false;

    for (const line of raw.split('\n')) {
        // A '# ' inside a fenced block is a comment, not a heading
        if (FENCE.test(line)) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;

        const match = HEADING.exec(line);
        if (!match) continue;

        // Strip the inline markup that would otherwise show up in the outline,
        // leaving backticks in place for now so code can be told apart below
        const raw = match[2]
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
            .trim();

        // Headings render lowercase, and the outline has to agree with them.
        // Inline code keeps its case: registerFactory is not registerfactory.
        const text = raw
            .split(/(`[^`]+`)/)
            .map((part) =>
                part.startsWith('`') && part.endsWith('`')
                    ? part.slice(1, -1)
                    : part.toLowerCase()
            )
            .join('')
            .trim();

        if (!text) continue;

        headings.push({
            // Slugged from the same string rehype-slug sees; github-slugger
            // lowercases either way, so the casing above cannot shift the id
            id: slugger.slug(raw.replace(/`/g, '')),
            text,
            level: match[1].length,
        });
    }

    return headings;
}
