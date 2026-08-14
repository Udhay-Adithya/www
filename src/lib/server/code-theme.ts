/**
 * A greyscale syntax theme.
 *
 * Every colour in the site palette is oklch(x 0 0) — no chroma at all. An
 * off-the-shelf theme puts pink, blue and purple into the one element on the
 * page that has any colour, which is what makes code blocks read as imported
 * from somewhere else.
 *
 * Hierarchy here comes from lightness and italics instead: structural
 * punctuation recedes, identifiers sit at reading weight, keywords come
 * forward, comments drop back furthest.
 */

// Every step clears 4.5:1 against the block surface. Comments and punctuation
// want to recede, but not to the point of being unreadable — the dimmest pair
// sits just above the line rather than as far down as it could go.
const GREY = {
    keyword: '#FFFFFF',
    text: '#E4E4E4',
    entity: '#CFCFCF',
    string: '#B4B4B4',
    constant: '#A6A6A6',
    punctuation: '#949494',
    comment: '#8A8A8A',
};

export const monoTheme = {
    name: 'mono',
    type: 'dark' as const,
    colors: {
        'editor.foreground': GREY.text,
        // Left unset by keepBackground: false; the stylesheet paints the block
        'editor.background': '#00000000',
    },
    // Must be tokenColors, not the textmate `settings` key:
    // rehype-pretty-code detects a raw theme by looking for this property
    tokenColors: [
        { settings: { foreground: GREY.text } },
        {
            scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
            settings: { foreground: GREY.comment, fontStyle: 'italic' },
        },
        {
            scope: [
                'keyword',
                'storage',
                'storage.type',
                'storage.modifier',
                'keyword.control',
                'keyword.operator.new',
                'variable.language',
                'constant.language',
            ],
            settings: { foreground: GREY.keyword },
        },
        {
            scope: ['string', 'string.quoted', 'meta.string', 'punctuation.definition.string'],
            settings: { foreground: GREY.string },
        },
        {
            scope: ['constant', 'constant.numeric', 'constant.character', 'support.constant'],
            settings: { foreground: GREY.constant },
        },
        {
            scope: [
                'entity.name.function',
                'support.function',
                'entity.name.type',
                'entity.name.class',
                'support.type',
                'support.class',
            ],
            settings: { foreground: GREY.entity },
        },
        {
            scope: ['variable', 'variable.other', 'meta.definition.variable'],
            settings: { foreground: GREY.text },
        },
        {
            scope: [
                'punctuation',
                'meta.brace',
                'keyword.operator',
                'punctuation.separator',
                'punctuation.terminator',
            ],
            settings: { foreground: GREY.punctuation },
        },
        {
            scope: ['entity.name.tag', 'meta.tag'],
            settings: { foreground: GREY.keyword },
        },
        {
            scope: ['entity.other.attribute-name'],
            settings: { foreground: GREY.entity, fontStyle: 'italic' },
        },
    ],
};
