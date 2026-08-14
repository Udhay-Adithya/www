import type { ReactNode } from 'react';

type CalloutProps = {
    /** Shown above the body in the accent face; omit for an unlabelled aside */
    label?: string;
    children: ReactNode;
};

/**
 * An aside inside a post.
 *
 * Registered in mdxComponents, so a post writes <Callout> directly with no
 * import — next-mdx-remote resolves capitalised tags from that map.
 */
export default function Callout({ label, children }: CalloutProps) {
    return (
        <aside className="my-10 border-l border-border pl-6">
            {label && (
                <p className="font-petemoss-text mb-1 text-xl text-muted-foreground">
                    {label}
                </p>
            )}
            <div className="[&>*:last-child]:mb-0">{children}</div>
        </aside>
    );
}
