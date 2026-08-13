'use client';

import { useRef, useState, type ComponentPropsWithoutRef } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * Wraps the <figure> rehype-pretty-code emits around a code block and adds a
 * copy button.
 *
 * The button lives here rather than in a rehype transformer because a
 * transformer can only emit an inline onclick attribute, which react rejects
 * when the tree is rendered through compileMDX.
 */
export default function CodeFigure({
    children,
    className,
    ...rest
}: ComponentPropsWithoutRef<'figure'>) {
    const figureRef = useRef<HTMLElement>(null);
    const [copied, setCopied] = useState(false);

    // Only code blocks get a copy button; a plain figure in mdx is left alone
    const isCodeBlock = 'data-rehype-pretty-code-figure' in rest;

    const copy = async () => {
        const code = figureRef.current?.querySelector('code')?.textContent;
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard is unavailable over plain http or without permission
        }
    };

    if (!isCodeBlock) {
        return (
            <figure className={className} {...rest}>
                {children}
            </figure>
        );
    }

    return (
        <figure
            ref={figureRef}
            className={`group relative ${className ?? ''}`}
            {...rest}
        >
            {children}
            <button
                type="button"
                onClick={copy}
                aria-label={copied ? 'copied' : 'copy code'}
                className="absolute right-3 top-3 rounded-md border border-border bg-card p-2 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
            >
                {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
        </figure>
    );
}
